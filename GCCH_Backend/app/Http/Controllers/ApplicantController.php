<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Models\Applicant;
use App\Models\Job;
use App\Models\User;
use App\Models\Resume;
use App\Models\CoverLetter;
use App\Models\JobApplication;
use App\Services\GoogleDriveService;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Yaza\LaravelGoogleDriveStorage\GDrive;
use Illuminate\Support\Facades\Log; 

class ApplicantController extends Controller
{
    
    protected $googleDriveService;

    public function __construct(GoogleDriveService $googleDriveService)
    {
        $this->googleDriveService = $googleDriveService;
    }

    public function fetchApplicantData($id)
    {
        $user = User::with('applicant')->findOrFail($id);
        return response()->json($user);
    }

    public function jobapply(Request $request)
    {
        try {
            $user = Auth::user();
            $applicant = $user->applicant;
            if (!$applicant) {
                return response()->json(['error' => 'Applicant not found'], 404);
            }

            try {
                $validated = $request->validate([
                    'job_id' => 'required|exists:jobs,id',
                    'resume' => 'nullable|file|mimes:pdf|max:2048',
                    'cover_letter' => 'required|file|mimes:pdf,docx,doc|max:2048',
                ]);
            } catch (ValidationException $e) {
                return response()->json([
                    'error' => 'Validation failed',
                    'messages' => $e->errors()
                ], 422);
            }

            $job = Job::find($validated['job_id']);

            if (!$job || $job->status === 'closed' || $job->filled_slots >= $job->total_slots) {
                return response()->json(['error' => 'Job is no longer accepting applications'], 403);
            }

            $existingApplication = JobApplication::where('applicant_id', $applicant->id)
                ->where('job_id', $validated['job_id'])
                ->first();


            if ($existingApplication) {
                return response()->json([
                    'error' => 'You have already applied for this job',
                    'status' => $existingApplication->status
                ], 422);
            }

            $jobApplication = new JobApplication();
            $jobApplication->job_id = $validated['job_id'];
            $jobApplication->applicant_id = $applicant->id;

            $fileMeta = [];

            if ($request->hasFile('cover_letter')) {
                $file = $request->file('cover_letter');
                $customFileName = $applicant->first_name . '_' . $applicant->last_name . '_cover_letter';
                $fileMeta['cover_letter'] = $this->googleDriveService->uploadFile($file, $customFileName);

                $coverLetter = new CoverLetter();
                $coverLetter->applicant_id = $applicant->id;
                $coverLetter->file_name = $fileMeta['cover_letter']['name'];
                $coverLetter->drive_file_id = $fileMeta['cover_letter']['file_id'];
                $coverLetter->mime_type = $file->getMimeType();
                $coverLetter->save();

                $jobApplication->cover_letter = $coverLetter->id;
            } else {
                Log::warning("Cover letter file missing despite validation success", ['applicant_id' => $applicant->id]);
            }

            if ($request->hasFile('resume')) {
                $file = $request->file('resume');
                $customFileName = $applicant->first_name . '_' . $applicant->last_name . '_resume';
                $fileMeta['resume'] = $this->googleDriveService->uploadFile($file, $customFileName);

                $resume = new Resume();
                $resume->applicant_id = $applicant->id;
                $resume->file_name = $fileMeta['resume']['name'];
                $resume->drive_file_id = $fileMeta['resume']['file_id'];
                $resume->mime_type = $file->getMimeType();
                $resume->save();

                $jobApplication->resume = $resume->id;
            }

            $jobApplication->save();

            // Notify the company about the new application
            $job = Job::find($validated['job_id']);
            if ($job && $job->company_id) {
                $notificationController = new NotificationController();
                $content = "New job application for " . $job->job_title . " from " . $applicant->first_name . " " . $applicant->last_name;
                $notificationController->notifyUser($job->company_id, $content, 'job_application');
            }

            return response()->json([
                'message' => 'Job application submitted successfully',
                'fileMeta' => $fileMeta,
                'job_application' => $jobApplication
            ], 201);

        } catch (Exception $e) {
            // Log::error('Error while submitting job application', [
            //     'error' => $e->getMessage(),
            //     'trace' => $e->getTraceAsString(),
            //     'applicant_id' => isset($applicant) ? $applicant->id : null,
            //     'job_id' => $request->input('job_id')
            // ]);
            return response()->json(['error' => 'An error occurred while applying for the job'], 500);
        }
    }

    public function jobdisplay(){
        try{
            $user = Auth::user();

            $applicant = $user->applicant;

            if (!$applicant) {
                return response()->json(['error' => 'Applicant not found'], 404);
            }

            $course = $applicant->course;

            $matchedJobs = Job::where('recommended_course', $course)
                ->orWhere('recommended_course_2', $course)
                ->orWhere('recommended_course_3', $course)
                ->get();

            $matchedJobsIds = $matchedJobs->pluck('id');
            
            $otherJobs = Job::whereNotIn('id', $matchedJobsIds)
                ->get();

            return response()->json([
                'matchedjobs' => $matchedJobs,
                'otherjobs' => $otherJobs
            ], 200);

        } catch (ValidationException $e) {
            return response()->json(['error' => $e->validator->errors()], 422);
        }
    }

    public function applicationStatus(){
        try{
            $user = Auth::user();
            $applicant = $user->applicant;

            if (!$applicant) {
                return response()->json(['error' => 'Applicant not found'], 404);
            }

            $applications = JobApplication::where('applicant_id', $applicant->id)->with(['job'])->get();
            if ($applications->isEmpty()) {
                return response()->json(['message' => 'No applications found.'], 404);
            }
            $applicationsData = $applications->map(function ($application) {
                return [
                    'id' => $application->id,
                    'job_title' => $application->job->job_title,
                    'status' => $application->status,
                    'updated_at' => $application->created_at,
                ];
            });
            return response()->json(['applications' => $applicationsData], 200);  
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->validator->errors()], 422);
        }
    }
}
