<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Job Report - {{ $job->job_title }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #000;
            margin: 30px;
        }
        h2 {
            text-align: left;
        }
        
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ddd;
        }
        .label {
            font-weight: bold;
        }
    </style>
</head>
<body>

    <h2>Accepted Applicants for "{{ $job->job_title }}"</h2>
    <h2>Date Posted: "{{ $job->date_posted }}</h2>
    
    <ul>
        @foreach ($job->applications as $application)
            <li>
                <div><span class="label">Name:</span> {{ $application->applicant->first_name }} {{ $application->applicant->last_name }}</div>
                <div><span class="label">Email:</span> {{ $application->applicant->user->email }}</div>
                <div><span class="label">Course:</span> {{ $application->applicant->course }}</div>
                <div><span class="label">Phone:</span> {{ $application->applicant->phone_number }}</div>
            </li>
        @endforeach
    </ul>

</body>
</html>
