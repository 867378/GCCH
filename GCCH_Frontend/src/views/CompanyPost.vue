<template>
  <div class="container">
    <div class="sidebar" :class="{ collapsed: !isSidenavOpen }">
      <img src="/public/gcchnobg.png" alt="GCCH Logo" class="logo" />
      <ul>
        <li>
          <router-link to="/companydash" class="sidenav-text">
            <img src="/public/home.png" class="ikon" />
            DASHBOARD
          </router-link>
        </li>
        <li style="font-weight: bold">
          <router-link to="/companypost" class="sidenav-text">
            <img src="/public/laptop.png" class="ikon" /> POSTED JOBS
          </router-link>
        </li>
        <li>
          <router-link to="/companyaccepted" class="sidenav-text">
            <img src="/public/agreement.png" class="ikon" /> ACCEPTED
          </router-link>
        </li>
        <li>
          <router-link to="/companymessage" class="sidenav-text">
            <img src="/public/message.png" class="ikon" />
            MESSAGES
          </router-link>
        </li>

        <li>
          <router-link to="/companyprofile" class="sidenav-text">
            <img src="/public/user.png" class="ikon" />
            PROFILE
          </router-link>
        </li>
      </ul>
      <button class="sign-out" @click="toggleSignOut">
        <img src="/public/logout.png" alt="Sign Out Icon" />
      </button>

      <div v-if="showSignOut" class="popup-overlay" @click.self="toggleSignOut">
        <div class="popup signout-popup">
          <h3>⚠️ Sign Out</h3>
          <p>Are you sure you want to sign out?</p>
          <div class="signout-actions">
            <button class="cancel-btn" @click="toggleSignOut">Cancel</button>
            <button class="signout-btn" @click="confirmSignOut">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="topbar">
        <div class="left-top">
          <div class="hamburger" @click="isSidenavOpen = !isSidenavOpen">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="icons-right">
          <div class="icon" @click="toggleNotif">
            <img src="/public/notification.png" />
            <span v-if="newNotifications > 0">{{ newNotifications }}</span>
          </div>
        </div>

        <div v-if="showNotif" class="popup-overlay" @click.self="toggleNotif">
          <div class="popup">
            <h3>🔔 Notifications</h3>
            <ul class="popup-list">
              <li v-for="(notif, index) in notifications" :key="index">
                {{ notif }}
              </li>
            </ul>
            <button @click="toggleNotif">Close</button>
          </div>
        </div>
      </div>

      <!-- POSTED JOBS DISPLAY -->
      <div class="content">
        <div class="left-content">
          <form @submit.prevent="postJob">
            <div class="post-box">
              <h3>Job Description</h3>
              <button>Post Job</button>
              <input
                v-model="jobData.job_title"
                type="text"
                placeholder="Enter Job Title"
                class="job-title"
              />

              <textarea
                v-model="jobData.job_description"
                placeholder="Describe the job responsibilities, requirements, and any other relevant details."
              ></textarea>

              <div class="form-row">
                <select
                  v-model="jobData.job_type"
                  class="job-form job-type"
                  id="job_type"
                >
                  <option disabled selected value="">Job Type</option>
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>

                <div class="dropdown-checkbox">
                  <button
                    type="button"
                    @click="toggleCourseDropdown"
                    class="dropdown-btn"
                  >
                    Recommended Programs
                    <span v-if="selectedCourses.length"
                      >({{ selectedCourses.length }}/3)</span
                    >
                  </button>
                  <div v-if="showCourseDropdown" class="dropdown-list">
                    <label v-for="course in courseOptions" :key="course">
                      <input
                        type="checkbox"
                        :value="course"
                        :checked="selectedCourses.includes(course)"
                        @change="handleCheckboxChange($event, course)"
                      />
                      {{ course }}
                    </label>
                  </div>
                </div>

                <div class="dropdown-checkbox">
                  <button
                    type="button"
                    @click="toggleExpertiseDropdown"
                    class="dropdown-btn"
                  >
                    Recommended Expertise
                    <span v-if="selectedExpertise.length"
                      >({{ selectedExpertise.length }}/3)</span
                    >
                  </button>
                  <div v-if="showExpertiseDropdown" class="dropdown-list">
                    <label v-for="expertise in filteredExpertise" :key="expertise">
                      <input
                        type="checkbox"
                        :value="expertise"
                        :checked="selectedExpertise.includes(expertise)"
                        @change="handleExpertiseCheckboxChange($event, expertise)"
                      />
                      {{ expertise }}
                    </label>
                  </div>
                </div>

                <input
                  v-model="jobData.job_location"
                  type="text"
                  placeholder="Enter Job Location"
                  class="job-input"
                />

                <input
                  type="number"
                  v-model="jobData.monthly_salary"
                  placeholder="Enter Monthly Salary (in Php)"
                  class="salary-input"
                />

                <input
                  type="number"
                  v-model="jobData.total_slots"
                  placeholder="Hiring Slot"
                  class="slot-input"
                />
              </div>
            </div>
          </form>

          <!-- Add the new sections here -->
          <div v-if="selectedJob" class="selected-job-box">
            <h2>{{ selectedJob.job_title }}</h2>
            <p>{{ selectedJob.job_description }}</p>
            <p><strong>Location:</strong> {{ selectedJob.job_location }}</p>
            <p><strong>Type:</strong> {{ selectedJob.job_type }}</p>
            <p>
              <strong>Monthly Salary:</strong> ₱{{ selectedJob.monthly_salary }}
            </p>
            <p><strong>Date Posted:</strong> {{ selectedJob.date_posted }}</p>
            <p><strong>Status:</strong> {{ selectedJob.status }}</p>
            <p>
              <strong>Slots:</strong>{{ selectedJob.filled_slots }}/{{
                selectedJob.total_slots
              }}
            </p>
          </div>

          <div v-if="selectedJob" class="selected-job-box">
            <h3>Ongoing Applications</h3>
            <ul v-if="jobApplicants.length > 0">
              <li
                v-for="application in jobApplicants"
                :key="application.id"
                class="mb-4"
              >
                <strong
                  >{{ application.applicant.first_name }}
                  {{ application.applicant.last_name }}</strong
                ><br />
                <span
                  ><strong>Course:</strong>
                  {{ application.applicant.course }}</span
                ><br />
                <span
                  ><strong>Phone:</strong>
                  {{ application.applicant.phone_number }}</span
                ><br />
                <span
                  ><strong>Date Applied:</strong>
                  {{ application.date_applied }}</span
                ><br />
                <span><strong>Status:</strong> {{ application.status }}</span
                ><br />
                <span
                  ><strong>Schedule: </strong
                  >{{ application.scheduled_at }}</span
                ><br />

                <div>
                  <a :href="application.cover_letter.embed_url" target="_blank">
                    📄 View Cover Letter
                  </a>
                </div>
                <div v-if="application.resume">
                  <a :href="application.resume.embed_url" target="_blank">
                    📄 View Resume
                  </a>
                </div>

                <div>
                  <div v-if="!showStatusOptions">
                    <button
                      class="message-btn"
                      @click="sendMessage(application.applicant.id)"
                    >
                      Send Message
                    </button>
                    <button
                      v-if="application.status !== 'accepted'"
                      @click="showStatusOptions = true"
                    >
                      Select Status
                    </button>
                    <span v-else class="italic text-gray-600">
                      ⏳ Waiting for the applicant's response to the job offer
                    </span>
                  </div>

                  <div v-else>
                    <div class="button-group">
                      <label>
                        <input
                          type="checkbox"
                          @change="openConfirmModal(application.id, 'accepted')"
                        />
                        ✅ Accept
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          @change="openConfirmModal(application.id, 'rejected')"
                        />
                        ❌ Reject
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          @change="scheduleInterview(application.id)"
                        />
                        📅 Schedule Interview
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          @change="scheduleAssessment(application.id)"
                        />
                        📝 Schedule Assessment
                      </label>
                    </div>

                    <textarea
                      v-model="comment"
                      placeholder="Add a comment (optional)"
                      rows="3"
                      class="border p-2 mt-2 w-full"
                    ></textarea>

                    <button
                      @click="showStatusOptions = false"
                      class="cancel-button"
                    >
                      Cancel
                    </button>
                    <button @click="submitApplicationDecision">
                      Submit Update
                    </button>
                  </div>
                </div>
              </li>
            </ul>
            <p v-else>No applicants have applied yet.</p>
          </div>

          <div v-else>
            <p>Select a job to view details and applicants.</p>
          </div>
        </div>

        <!-- Keep your existing right-content section -->
        <div class="right-content">
          <h3>POSTED JOBS</h3>
          <div class="posted-jobs">
            <div
              class="posted-jobs-box"
              v-for="(job, index) in postedJobs"
              :key="index"
              @click="selectJob(job)"
            >
              <h2>{{ job.job_title }}</h2>
              <p><strong>Location:</strong> {{ job.job_location }}</p>
              <p><strong>Type:</strong> {{ job.job_type }}</p>
              <p><strong>Monthly Salary:</strong> ₱{{ job.monthly_salary }}</p>
              <p><strong>Date Posted:</strong> {{ job.date_posted }}</p>
              <p><strong>Status:</strong> {{ job.status }}</p>
              <p>
                <strong>Slots: </strong> {{ job.filled_slots }}/{{
                  job.total_slots
                }}
              </p>
            </div>
            <p v-if="postedJobs.length === 0">No jobs posted yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

const router = useRouter();

const showMail = ref(false);
const showNotif = ref(false);
const showSignOut = ref(false);
const unreadMessages = ref(0);
const newNotifications = ref(0);
const isSidenavOpen = ref(true);

const selectedJob = ref(null);
const jobApplicants = ref([]);

const notifications = ref([]);
const postedJobs = ref([]);
// Dummy data for messages

const showStatusOptions = ref(false);
const comment = ref("");

//popup confirmation
const showConfirmModal = ref(false);
const selectedApplicationId = ref(null);
const decisionType = ref("");
const scheduledAt = ref(null);

//message variables
const selectedApplicantId = ref(null);
const showMessagePopup = ref(false);
const messageContent = ref("");

function sendMessage(applicationId) {
  selectedApplicantId.value = applicationId;
  showMessagePopup.value = true;
}

async function sendActualMessage() {
  try {
    const response = await axios.post("/message/send", {
      receiver_id: selectedApplicantId.value,
      message: messageContent.value,
    });

    console.log("Message Sent:", response.data);
    showMessagePopup.value = false;
    messageContent.value = "";
    createToast("Message sent successfully!", {
      type: "success",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    createToast("Failed to send message. Please try again.", {
      type: "danger",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
    });
  }
}

function openConfirmModal(applicationId, type) {
  selectedApplicationId.value = applicationId;
  decisionType.value = type; // e.g. 'accepted', 'rejected'
  showStatusOptions.value = true; // show status section if hidden
}

async function scheduleInterview(applicationId) {
  const date = prompt("Enter interview date (YYYY-MM-DD HH:MM:SS):");
  if (date) {
    selectedApplicationId.value = applicationId;
    decisionType.value = "interview";
    scheduledAt.value = date;
    showStatusOptions.value = true;
    createToast("Interview scheduled successfully", {
      type: "success",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
      toastBackgroundColor: "#045d56",
    });
  }
}

async function scheduleAssessment(applicationId) {
  const date = prompt("Enter assessment date (YYYY-MM-DD HH:MM:SS):");
  if (date) {
    selectedApplicationId.value = applicationId;
    decisionType.value = "assessment";
    scheduledAt.value = date;
    showStatusOptions.value = true;
    createToast("Assessment scheduled successfully", {
      type: "success",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
      toastBackgroundColor: "#045d56",
    });
  }
}

function closeConfirmModal() {
  showConfirmModal.value = false;
}

function confirmDecision() {
  assessApplication(
    selectedApplicationId.value,
    decisionType.value,
    null,
    comment.value
  );
  closeConfirmModal();
}

function getApplicationStatus(applicationId) {
  const application = jobApplicants.value.find(
    (app) => app.id === applicationId
  );
  return application ? application.status : null;
}

function toggleMail() {
  showMail.value = !showMail.value;
  if (showMail.value) {
    unreadMessages.value = 0;
  }
}

function toggleNotif() {
  showNotif.value = !showNotif.value;
  if (showNotif.value) {
    newNotifications.value = 0;
  }
}

function toggleSignOut() {
  showSignOut.value = !showSignOut.value;
}

function confirmSignOut() {
  axios
    .post("/logout")
    .then(() => {
      createToast("Successfully signed out!", {
        type: "success",
        position: "top-right",
        timeout: 2000,
        showIcon: true,
        toastBackgroundColor: "#045d56",
      });
      localStorage.clear();
      router.push("/login");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      createToast("Failed to sign out. Please try again.", {
        type: "danger",
        position: "top-right",
        timeout: 3000,
        showIcon: true,
      });
    });
}

//Get Applicants of a Certain Job
async function fetchApplicants(jobId) {
  try {
    const response = await axios.get(`/job/${jobId}/applications`);
    jobApplicants.value = response.data.applications.filter(
      (applicant) =>
        applicant.status !== "rejected" && applicant.status !== "hired"
    );
    console.log(response.data);
  } catch (error) {
    console.error("Failed to fetch applicants", error);
    jobApplicants.value = [];
  }
}

//Fetch Jobs
async function fetchPostedJobs() {
  try {
    const response = await axios.get("/company/jobdisplay");
    postedJobs.value = response.data.jobs;
    console.log(response.data);

    if (postedJobs.value.length > 0) {
      selectedJob.value = postedJobs.value[0]; // or let user pick
      await fetchApplicants(selectedJob.value.id);
    } else {
      jobApplicants.value = [];
    }
  } catch (error) {
    console.error("Error fetching posted jobs:", error);
  }
}

async function submitApplicationDecision() {
  if (!selectedApplicationId.value || !decisionType.value) {
    createToast("Please choose an applicant and a decision", {
      type: "warning",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
      toastBackgroundColor: "#045d56",
    });
    return;
  }

  await assessApplication(
    selectedApplicationId.value,
    decisionType.value,
    scheduledAt.value,
    comment.value
  );

  // Reset form
  selectedApplicationId.value = null;
  decisionType.value = null;
  scheduledAt.value = null;
  comment.value = "";
  showStatusOptions.value = false;
}

async function assessApplication(
  applicationId,
  status,
  scheduleAt = null,
  comment = ""
) {
  try {
    const payload = {
      status,
      scheduled_at: scheduleAt,
      comment,
    };

    const response = await axios.post(
      `/company/job-applications/${applicationId}/assess`,
      payload
    );

    createToast("Application status updated successfully", {
      type: "success",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
      toastBackgroundColor: "#045d56",
    });

    if (status === "accepted") {
      try {
        const offerResponse = await axios.post(
          `/company/offer-job/${applicationId}`
        );
        createToast("Job offer sent successfully", {
          type: "success",
          position: "top-right",
          timeout: 3000,
          showIcon: true,
          toastBackgroundColor: "#045d56",
        });
      } catch (offerError) {
        console.error("Error sending job offer:", offerError);
        createToast(
          offerError.response?.data?.error || "Failed to send job offer",
          {
            type: "danger",
            position: "top-right",
            timeout: 3000,
            showIcon: true,
          }
        );
      }
    }

    await fetchApplicants(selectedJob.value.id);
    await fetchPostedJobs();
  } catch (error) {
    console.error("Error updating application status:", error);
    createToast(error.response?.data?.error || "Failed to update application", {
      type: "danger",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
    });
  }
}

onMounted(fetchPostedJobs);

function selectJob(job) {
  selectedJob.value = job;
  fetchApplicants(job.id);
}

// Add these to your existing script setup
const showCourseDropdown = ref(false);
const selectedCourses = ref([]);
const selectedExpertise = ref([]);

const filteredExpertise = computed(() => {
  const expertiseSet = new Set();

  selectedCourses.value.forEach((course) => {
    const expertiseList = expertiseMap[course] || [];
    expertiseList.forEach((expertise) => expertiseSet.add(expertise));
  });

  return Array.from(expertiseSet);
});

const showExpertiseDropdown = ref(false);

function toggleExpertiseDropdown() {
  showExpertiseDropdown.value = !showExpertiseDropdown.value;
}

const courseOptions = [
  "BSIT",
  "BSCS",
  "BSEMC",
  "BSN",
  "BSM",
  "BSA",
  "BSBA-FM",
  "BSBA-HRM",
  "BSBA-MM",
  "BSCA",
  "BSHM",
  "BSTM",
  "BAComm",
  "BECEd",
  "BCAEd",
  "BPEd",
  "BEED",
  "BSEd-Eng",
  "BSEd-Math",
  "BSEd-Fil",
  "BSEd-SS",
  "BSEd-Sci",
  "Other",
];

const expertiseMap = {
  BSIT: [
    "Web Development",
    "Networking",
    "Cybersecurity",
    "System Administration",
    "Other",
  ],
  BSCS: ["Data Science", "AI", "Software Engineering", "Algorithms","Other"],
  BSEMC: ["Multimedia Arts", "Animation", "Game Development","Other"],
  BSN: ["Clinical Nursing", "Community Health", "Medical-Surgical Nursing","Other"],
  BSM: ["Strategic Management", "Operations Management", "Entrepreneurship","Other"],
  BSA: ["Financial Accounting", "Auditing", "Taxation","Other"],
  "BSBA-FM": ["Corporate Finance", "Investment Analysis", "Banking","Other"],
  "BSBA-HRM": [
    "Human Resources",
    "Talent Management",
    "Organizational Development",
    "Other",
  ],
  "BSBA-MM": ["Marketing Strategy", "Advertising", "Sales Management","Other"],
  BSCA: ["Customs Brokerage", "Trade Compliance", "Logistics","Other"],
  BSHM: ["Hotel Management", "Food & Beverage Service", "Customer Relations","Other"],
  BSTM: ["Tourism Planning", "Event Management", "Travel Services","Other"],
  BAComm: ["Journalism", "Public Relations", "Media Production","Other"],
  BECEd: ["Early Childhood Development", "Preschool Education","Other"],
  BCAEd: ["Arts Education", "Cultural Studies", "Creative Expression","Other"],
  BPEd: ["Sports Science", "Physical Fitness", "Coaching","Other"],
  BEED: ["Elementary Teaching", "Child Psychology", "Classroom Management","Other"],
  "BSEd-Eng": ["English Education", "Literature", "Language Teaching","Other"],
  "BSEd-Math": ["Mathematics Education", "Algebra", "Calculus","Other"],
  "BSEd-Fil": [
    "Filipino Language",
    "Philippine Literature",
    "Language Teaching",
    "Other",
  ],
  "BSEd-SS": ["Social Studies", "Philippine History", "Civics & Culture","Other"],
  "BSEd-Sci": ["General Science", "Biology", "Chemistry", "Physics","Other"],
  Other: ["Other"],
};

const jobData = ref({
  job_title: "",
  job_description: "",
  job_location: "",
  monthly_salary: "",
  job_type: "",
  recommended_course: "",
  recommended_course_2: "",
  recommended_course_3: "",
  recommeded_expertise: "",
  recommended_expertise_2: "",
  recommended_expertise_3: "",
  total_slots: "",
});

function toggleCourseDropdown() {
  showCourseDropdown.value = !showCourseDropdown.value;
}

const handleExpertiseCheckboxChange = (event, expertise) => {
  if (event.target.checked) {
    if (selectedExpertise.value.length < 3) {
      selectedExpertise.value.push(expertise);
    } else {
      selectedExpertise.value.shift();
      selectedExpertise.value.push(expertise);
    }
  } else {
    selectedExpertise.value = selectedExpertise.value.filter((e) => e !== expertise);
  }
};


const handleCheckboxChange = (event, course) => {
  if (event.target.checked) {
    if (selectedCourses.value.length < 3) {
      selectedCourses.value.push(course);
    } else {
      selectedCourses.value.shift();
      selectedCourses.value.push(course);
    }
  } else {
    selectedCourses.value = selectedCourses.value.filter((c) => c !== course);
  }
};

async function postJob() {
  try {
    jobData.value.recommended_course = selectedCourses.value[0] || null;
    jobData.value.recommended_course_2 = selectedCourses.value[1] || null;
    jobData.value.recommended_course_3 = selectedCourses.value[2] || null;
    jobData.value.recommended_expertise = selectedExpertise.value[0] || null;
    jobData.value.recommended_expertise_2 = selectedExpertise.value[1] || null;
    jobData.value.recommended_expertise_3 = selectedExpertise.value[2] || null;


    const response = await axios.post("/company/postjob", {
      job_title: jobData.value.job_title,
      job_description: jobData.value.job_description,
      job_location: jobData.value.job_location,
      monthly_salary: jobData.value.monthly_salary,
      job_type: jobData.value.job_type,
      recommended_course: jobData.value.recommended_course,
      recommended_course_2: jobData.value.recommended_course_2 || null,
      recommended_course_3: jobData.value.recommended_course_3 || null,
      recommended_expertise: jobData.value.recommended_expertise,
      recommended_expertise_2: jobData.value.recommended_expertise_2 || null,
      recommended_expertise_3: jobData.value.recommended_expertise_3 || null,
      total_slots: jobData.value.total_slots,
    });

    createToast(response.data.message, {
      type: "success",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
      toastBackgroundColor: "#045d56",
    });

    // Reset form
    jobData.value = {
      job_title: "",
      job_description: "",
      job_location: "",
      monthly_salary: "",
      job_type: "",
      recommended_course: "",
      recommended_course_2: "",
      recommended_course_3: "",
      recommended_expertise: "",
      recommended_expertise_2: "",
      recommended_expertise_3: "",
      total_slots: "",
    };

    selectedCourses.value = [];
    selectedExpertise.value = [];
    await fetchPostedJobs();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const errors = error.response.data.error;
      let errorMessages = Object.values(errors).flat().join("\n");
      createToast(errorMessages, {
        type: "danger",
        position: "top-right",
        timeout: 5000,
        showIcon: true,
      });
    } else {
      console.error("Unexpected error:", error);
      createToast("An unexpected error occurred.", {
        type: "danger",
        position: "top-right",
        timeout: 3000,
        showIcon: true,
      });
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: work-sans, sans-serif;
}
body,
.container {
  display: flex;
  background: #e6f0ea;
  height: auto;
  overflow: AUTO;
}
.sidebar {
  position: fixed; 
  top: 0;
  left: 0;
  height: 100vh;
  width: 200px;
  background: #fafafa;
  padding: 20px 0;
  border-radius: 2vh;
  border-right: 3.5px solid #045d56;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto; 
  z-index: 1000; 
}
.logo {
  height: 8vh;
  width: 14vh;
  margin-left: 5.5vh;
  margin-bottom: 15vh;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar ul li {
  padding: 20px 20px;
  margin-bottom: 10px;
  gap: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
}

.sidebar ul li:hover {
  color: #045d56;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
}

.sidenav-text {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.sign-out {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
  padding: 15px 20px;
  margin-top: 10vh;
  margin-left: 8.5vh;
  border-radius: 10px;
}

.sign-out img {
  width: 20px;
  height: 20px;
}

.sign-out:hover {
  background-color: #e0f2f1;
  transform: translateX(5px);
  color: #045d56;
}

.signout-popup {
  text-align: center;
}

.signout-popup p {
  margin: 10px 0 20px;
}

.signout-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  background-color: gray;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #555;
}

.signout-btn {
  background-color: #d32f2f;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.signout-btn:hover {
  background-color: #b71c1c;
}

.ikon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.main {
  margin-left: 200px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #eaf4f2;
}
.topbar {
  height: 60px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #ccc;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 20px;
  cursor: pointer;
  margin: 0 10px;
  transition: transform 0.3s ease-in-out;
}

.hamburger span {
  display: block;
  height: 3px;
  background-color: #333;
  border-radius: 3px;
}

.left-top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  background: #f1f1f1;
  border-radius: 50%;
}
.topbar input[type="text"] {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  width: 300px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 25px;
  border-radius: 15px;
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  text-align: left;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease;
}

.popup h3 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #045d56;
}

.popup-list {
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
}

.popup-list li {
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
}

.popup button {
  background-color: #045d56;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.popup button:hover {
  background-color: #033f3a;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.content {
  padding: 20px;
  display: flex;
  gap: 20px;
  overflow: auto;
  margin-bottom: 0.5vh;
}
.left-content {
  flex: 3;
}

.post-box {
  background: white;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5vh;
  width: 130vh;
  border-bottom: #045d56 solid 4px;
  overflow: auto;
}

.post-box textarea {
  width: 100%;
  background-color: #f1f1f1;
  padding: 10px 15px;
  margin-top: 2vh;
  border-radius: 13px;
  height: 30vh;
  border: none;
  font-size: 14px;
  resize: none;
  outline: none;
}

.post-box h3 {
  text-align: left;
  font-size: 30px;
}

.post-box button {
  background: #00695c;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 10px;
  margin-top: -30px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  float: right;
}

.post-box button:hover {
  color: #045d56;
  background: #f1f1f1;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 3fr);
  gap: 1vh;
  align-items: center;
  margin-top: 3vh;
}

.job-form {
  flex: 1;
  position: relative;
  width: 45vh;
  padding: 10px 6px;
  margin-left: 3vh;
  border-radius: 2vh;
  background-color: #045d56;
  color: #e0f2f1;
  font-size: 14px;
  transition: background-color 0.3s ease-in-out;
  z-index: 1;
}

.job-form:hover {
  background-color: #e0f2f1;
  color: #045d56;
}

.job-title {
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 12px;
  background-color: #f1f1f1;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease-in-out;
  box-shadow: inset 0 0 0 1px transparent;
  outline: none;
}

.dropdown-checkbox {
  position: relative;
  display: flex;
  margin-top: 4vh;
}

.dropdown-btn {
  padding: 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  width: 75%;
  text-align: left;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  width: 80%;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.dropdown-list label {
  display: block;
  padding: 5px 10px;
  cursor: pointer;
}

.job-input,
.salary-input,
.slot-input {
  width: 44vh;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-left: 2.5vh;
}

.selected-job-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 3vh;
  border-radius: 3vh;
  border-left: #045d56 4px solid;
  width: 95%;
  max-height: 80vh;
  margin-left: 3vh;
  overflow-y: auto;
  text-transform: capitalize;
}

.selected-job-box h2 {
  margin-top: 0;
  font-size: 30px;
  font-weight: bold;
  color: #151718;
}

.selected-job-box h3 {
  margin-top: 3vh;
  margin-bottom: 3vh;
  font-size: 20px;
  color: #151718;
}

.selected-job-box p {
  margin: 8px 0;
  color: #151718;
  white-space: pre-line;
  line-height: 1.5;
}

.selected-job-box ul {
  list-style: none;
  padding: 10px;
}

.selected-job-box li {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 10px;
  border: 2px solid #e0e6ed;
  border-bottom: #045d56 4px solid;
  width: 100vh;
  max-height: 80vh;
  margin-left: 8vh;
  margin-bottom: 10vh;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.selected-job-box li:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
}

.selected-job-box li strong {
  display: inline-block;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.selected-job-box li span {
  display: block;
  margin: 2px 0;
  color: #444;
  font-size: 14px;
}

.selected-job-box button {
  margin-top: 2vh;
  margin-bottom: 2vh;
  padding: 5px 24px;
  font-size: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #045d56;
  color: white;
  transition: background-color 0.2s ease;
}

.selected-job-box button:hover {
  opacity: 0.9;
}
.cancel-button {
  margin-left: 8px;
  margin-right: 5vh;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 1vh;
  margin-left: 5vh;
  margin-bottom: 1vh;
}

.button-group label {
  display: flex;
  align-items: center;
  background-color: #045d56;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 10px;
  transition: background-color 0.2s ease;
}

.button-group label:hover {
  background-color: #033f3a;
}

.button-group input[type="checkbox"] {
  margin-right: 6px;
  width: 14px;
  height: 14px;
  cursor: pointer;
  accent-color: #e0f2f1; /* Modern color for check */
}

.button-group input[type="checkbox"]:focus {
  outline: 2px solid #e0f2f1;
  outline-offset: 2px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 20px 30px;
  border-radius: 10px;
  text-align: center;
}
.modal-buttons button {
  margin: 20px 20px;
  padding: 6px 15px;
  background-color: #d32f2f;
  color: white;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

textarea {
  border: 1px solid #ccc;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  resize: none;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.right-content {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 20px;
  height: 85vh;
  overflow: auto;
}
.icons-right {
  display: flex;
  gap: 20px;
  align-items: center;
}
.icon {
  position: relative;
  cursor: pointer;
}
.icon img {
  width: 25px;
  height: 25px;
}
.icon span {
  font-size: 12px;
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 5px;
}

.posted-jobs-box {
  background-color: #ffffff;
  border: 1px solid #e0e6ed;
  border-radius: 16px;
  border-left: #045d56 4px solid;
  margin: 2vh;
  width: 35vh;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-transform: capitalize;
  overflow: hidden;
}

.posted-jobs-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 0px;
  overflow: hidden;
  transition: width 0.3s ease;
}

@media (max-width: 1024px) {
  .hamburger {
    display: flex;
    z-index: 1001;
  }
  .content {
    gap: 0;
    overflow: hidden;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 35vh;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .logo {
    margin-top: 4vh;
    margin-left: 4vh;
    margin-bottom: 8vh;
  }

  .right-content {
    padding-top: 3vh;
    margin-right: 1vh;
    height: 85vh;
    width: 50vh;
    overflow: auto;
  }

  .posted-jobs-box {
    width: 35vh;
    height: auto;
    margin: 10px;
    font-size: 14px;
  }
  .selected-job-box {
    width: 95%;
    max-height: 43vh;
    margin-left: 2vh;
    font-size: 14px;
    padding: 20px;
    border-radius: 3vh;
  }
  .selected-job-box h3 {
    font-size: 30px;
  }

  .sign-out {
    margin-left: 7.5vh;
  }
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
    z-index: 1001;
  }
  .content {
    flex-direction: column;
    height: calc(100vh - 60px);
    padding: 20px;
    margin-top: 10px;
    overflow: auto;
  }

  .sidebar {
    font-size: 14px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 28vh;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .ikon {
    height: 15px;
    width: 15px;
  }

  .icon img {
    width: 20px;
    height: 20px;
  }

  .logo {
    height: 8vh;
    width: 13vh;
    margin-left: 4vh;
    margin-bottom: 10vh;
  }

  .right-content {
    padding: 15px;
    height: auto;
    min-height: 300px;
    width: 90%;
    margin-left: 5vh;
    overflow: auto;
  }

  .posted-jobs-box {
    width: 100%;
    margin: 10px 0;
    padding: 8px;
    font-size: 12px;
  }

  .selected-job-box {
    width: 95%;
    max-height: 43vh;
    margin-left: 2vh;
    font-size: 14px;
    padding: 20px;
    border-radius: 3vh;
  }
  .selected-job-box h3 {
    font-size: 30px;
  }

  .sign-out {
    margin-left: 7.5vh;
  }
}

@media (max-width: 435px) {
  .hamburger {
    display: flex;
    z-index: 1001;
  }
  .topbar {
    height: 12.5vh;
  }
  .content {
    display: grid;
    flex-direction: column;
  }
  .logo {
    margin-left: 5vh;
    margin-top: 5vh;
    margin-bottom: 5vh;
  }
  .ikon {
    height: 15px;
    width: 15px;
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 35vh;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }
  .selected-job-box {
    width: 80%;
    max-height: 50vh;
    margin-left: 5vh;
    font-size: 12px;
    padding: 15px;
    border-radius: 3vh;
  }
  .selected-job-box h3 {
    font-size: 20px;
  }
  .selected-job-box p {
    font-size: 10px;
  }
  .selected-job-box li {
    font-size: 10px;
    width: 100%;
  }

  .right-content {
    width: 90%;
    margin-left: 3vh;
    overflow: auto;
  }

  .posted-jobs-box {
    width: 90%;
    margin: 10px 0;
    padding: 15px;
    font-size: 12px;
    margin-left: 2vh;
  }

  .sign-out {
    width: 60px;
    height: 40px;
    margin-left: 7.5vh;
  }
}
@media (max-width: 385px) {
  .sidebar {
    width: 20vh;
    font-size: 8px;
  }
  .logo {
    height: 6vh;
    width: 10vh;
    margin-left: 3vh;
    margin-bottom: 5vh;
  }
  .ikon {
    height: 20px;
    width: 20px;
  }
  .sidebar {
    font-size: 12px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 35vh;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .right-content {
    flex: 1;
    margin-left: 3.5vh;
    padding-top: 3vh;
    height: auto;
    overflow: auto;
  }
  .sign-out {
    width: 60px;
    height: 40px;
    margin-left: 7.5vh;
  }
}
</style>
