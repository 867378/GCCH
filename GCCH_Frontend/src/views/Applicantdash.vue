<template>
  <div class="container">
    <div class="sidebar" :class="{ collapsed: !isSidenavOpen }">
      <img src="/public/gcchnobg.png" alt="GCCH Logo" class="logo" />
      <ul>
        <li style="font-weight: bold">
          <router-link to="/Applicantdash" class="sidenav-text">
            <img src="/public/job-offer.png" class="ikon" />
            JOB LISTINGS
          </router-link>
        </li>
        <li>
          <router-link to="/Applicantmessage" class="sidenav-text">
            <img src="/public/mail.png" class="ikon" /> MESSAGES
          </router-link>
        </li>
        <li>
          <router-link to="/Application" class="sidenav-text">
            <img src="/public/resume.png" class="ikon" /> APPLICATION
          </router-link>
        </li>
        <li>
          <router-link to="/Applicantprofile" class="sidenav-text">
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

        <div v-if="showMail" class="popup-overlay" @click.self="toggleMail">
          <div class="popup">
            <h3>📬 Messages</h3>
            <ul class="popup-list">
              <li>John: Interested in your post.</li>
              <li>Jane: Sent a resume for the job.</li>
              <li>Mark: Asking about job requirements.</li>
            </ul>
            <button @click="toggleMail">Close</button>
          </div>
        </div>

        <div v-if="showNotif" class="popup-overlay" @click.self="toggleNotif">
          <div class="popup">
            <h3>🔔 Notifications</h3>
            <ul class="popup-list">
              
            </ul>
            <button @click="toggleNotif">Close</button>
          </div>
        </div>
      </div>

      <div class="content">
        <div class="left-content">
          <div class="cards">
            <div class="card">
              <p>
                <strong>
                  <img
                    src="/public/management.png"
                    alt="total clients Icon"
                    class="ikon"
                  />
                  ONGOING JOB APPLICATIONS</strong
                >
              </p>
              <p>{{ ongoingApplicationsCount }}</p>
            </div>
            <div class="card">
              <p>
                <strong>
                  <img
                    src="/public/counting.png"
                    alt="total job listings Icon"
                    class="ikon"
                  />
                  MATCHING JOBS COUNT</strong
                >
              </p>
              <p>{{ matchedJobCount }}</p>
            </div>
            <div class="card">
              <p>
                <strong>
                  <img
                    src="/public/email.png"
                    alt="pending applications Icon"
                    class="ikon"
                  />
                  OFFERED JOBS</strong
                >
              </p>
              <p>{{ acceptedApplicationsCount }}</p>
            </div>
          </div>
          <div class="job-content">
            <h3>RECOMMENDED JOBS BASED ON COURSE</h3>
            <div
              class="job-box"
              v-for="matchedJob in recommendedJobs.filter(
                (job) => job.status === 'open'
              )"
              :key="matchedJob.id"
            >
              <div class="job-card">
                <!-- Header -->
                <div class="job-header">
                  <div class="job-title-section">
                    <img src="/public/user.png" class="ikon" />
                    <h3 class="company-name">{{ matchedJob.job_title }}</h3>
                  </div>

                  <!-- Apply and Message Buttons -->
                  <div class="button-group">
                    <button
                      class="message-btn"
                      @click="sendMessage(matchedJob.company_id)"
                    >
                      Send Message
                    </button>
                    <button
                      class="apply-btn"
                      @click="applyToJob(matchedJob.id)"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <p>{{ matchedJob.company.company_name }}</p>
                <!-- Move salary here BELOW description -->
                <div class="job-info">
                  <div class="job-detail">
                    <img src="/public/briefcase.png" class="ikon" />
                    <span class="job-type">{{ matchedJob.job_type }}</span>
                  </div>
                </div>

                <div class="job-info">
                  <div class="job-detail">
                    <img src="/public/money.png" class="ikon" />
                    <span class="salary">₱{{ matchedJob.monthly_salary }}</span>
                  </div>
                </div>

                <!-- Job Slots -->
                <div class="job-info">
                  <div class="job-detail">
                    <img src="/public/people.png" class="ikon" />
                    <p>
                      {{ matchedJob.filled_slots }}/{{ matchedJob.total_slots }}
                    </p>
                  </div>
                </div>
                <!--  -->
                <div class="job-info">
                  <div class="job-detail">
                    <img src="/public/updates.png" class="ikon" />
                    <p>Status: {{ matchedJob.status }}</p>
                  </div>
                </div>
                <!--  -->
                <div class="job-info">
                  <div class="job-detail">
                    <img src="/public/location.png" class="ikon" />
                    <p>Location: {{ matchedJob.job_location }}</p>
                  </div>
                </div>
                <!-- Job Description -->
                <p class="job-description">{{ matchedJob.job_description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="right-content">
          <div v-if="hiredApplication" class="hired">
            <div class="hired-status-box">
              <div class="hired-header">
                <img
                  src="/public/checked.png"
                  alt="success icon"
                  class="ikon"
                />
                <h3>YOU'RE HIRED!</h3>
              </div>
              <div class="hired-content">
                <p>Company Name: {{ hiredJobDetails.company.company_name }}</p>
                <p>Job Title: {{ hiredJobDetails.job_title }}</p>
                <p>Job Type: {{ formatType(hiredJobDetails.job_type) }}</p>
                <p>Started By: {{ formatDate(hiredJobDetails.created_at) }}</p>
                <button @click="downloadCertificate" class="download-btn">
                  Download Certificate
                </button>
              </div>
            </div>
          </div>

          <div v-else class="hired">
            <div class="hired-status-box">
              <div class="hired-header">
                <h3>NO JOB YET</h3>
              </div>
              <div class="hired-content">
                <p>
                  You haven't been hired for any job at the moment. Keep
                  applying!
                </p>
              </div>
            </div>
          </div>

          <div class="upd-content">
            <h3>CHECK THIS OUT</h3>
            <div class="updates-list">
              <div
                v-for="(notif, index) in filteredNotifications"
                :key="index"
                @click="openChat(notif)"
                style="cursor: pointer"
                class="update-box"
              >
                <h2>{{ formatType(notif.type) }}</h2>
                <p>
                  {{ notif.latestContent }}
                  <span v-if="notif.count > 1">
                    ({{ notif.count }} new
                    {{ pluralizeType(notif.type, notif.count) }})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Job Application Pop up -->
  <div
    v-if="showApplyPopup"
    class="popup-overlay"
    @click.self="closeApplyPopup"
  >
    <div class="apply-popup">
      <h3>📄 Upload Your Resume</h3>
      <span>Resume </span>
      <input type="file" @change="handleFileUploadResume" accept=".pdf" />
      <br /><br />
      <span>Cover Letter </span>
      <input type="file" @change="handleFileUploadCoverLetter" accept=".pdf" />
      <br /><br />
      <button @click="submitApplication">Apply</button>
      <button @click="closeApplyPopup">Cancel</button>
    </div>
  </div>

  <!-- Message Function -->
  <div
    v-if="showMessagePopup"
    class="popup-overlay"
    @click.self="showMessagePopup = false"
  >
    <div class="popup">
      <h3>✉️ Message</h3>
      <textarea
        v-model="messageContent"
        placeholder="Type your message here..."
        rows="5"
        style="width: 100%; padding: 8px; resize: none"
      ></textarea>
      <br /><br />
      <button @click="sendActualMessage">Send</button>
      <button @click="showMessagePopup = false" class="cancel-btn">
        Cancel
      </button>
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

// Reactive state variables
const showMail = ref(false);
const showNotif = ref(false);
const showSignOut = ref(false);
const unreadMessages = ref(0);
const newNotifications = ref(0);
const showApplyPopup = ref(false);
const isSidenavOpen = ref(true);
// COUNTS
const ongoingApplicationsCount = ref(0);
const matchedJobCount = ref(0);
const acceptedApplicationsCount = ref(0);

//for Message Popup
const showMessagePopup = ref(false);
const selectedCompanyId = ref(null);
const messageContent = ref("");

//for Apply Popup
const selectedJobId = ref(null);
const resumeFile = ref(null);
const coverLetterFile = ref(null);

//for Job Listings
const recommendedJobs = ref([]);
const hiredApplication = ref(null);
const hiredJobDetails = ref(null);

//For Notifications
const notifications = ref([]);

// NavBar Logic
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
      createToast('Successfully signed out', {
        type: 'success',
        position: 'top-right',
        timeout: 2000,
        showIcon: true
      });
      localStorage.clear();
      router.push("/login");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      createToast('Failed to sign out', {
        type: 'danger',
        position: 'top-right',
        timeout: 3000,
        showIcon: true
      });
    });
}

async function fetchDashboardCounts() {
  try {
    const [totalApplied, matchingJobs, acceptedApplied] = await Promise.all([
      axios.get("/applicant/ongoing-applications"),
      axios.get("/applicant/matched-jobs"),
      axios.get("/applicant/accepted-applications"),
    ]);

    ongoingApplicationsCount.value = totalApplied.data.total_jobs_applied;
    matchedJobCount.value = matchingJobs.data.matched_jobs_count;
    acceptedApplicationsCount.value = acceptedApplied.data.accepted_jobs_count;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchJobs() {
  try {
    const response = await axios.get("/applicant/jobdisplay");

    console.log(response.data);

    recommendedJobs.value = response.data.matchedjobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    alert("Failed to fetch jobs. Please try again later.");
  }
}

function applyToJob(jobId) {
  selectedJobId.value = jobId;
  showApplyPopup.value = true;
}

async function submitApplication() {
  if (!coverLetterFile.value) {
    createToast("Please include a cover letter.", {
      type: "warning",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
      toastBackgroundColor: "#045d56",
    });
    return;
  }

  const formData = new FormData();
  formData.append("job_id", selectedJobId.value);
  formData.append("cover_letter", coverLetterFile.value);

  if (resumeFile.value) {
    formData.append("resume", resumeFile.value);
  }

  try {
    const response = await axios.post("/applicant/jobapply", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    createToast(response.data.message, {
      type: "success",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
      toastBackgroundColor: "#045d56",
    });
    closeApplyPopup();
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const errors = error.response.data.error;
      let errorMessages = Object.values(errors).flat().join("\n");
      createToast(errorMessages, {
        type: "danger",
        position: "top-right",
        timeout: 5000,
        showIcon: true,
        toastBackgroundColor: "#045d56",
      });
    } else {
      createToast("An unexpected error occurred.", {
        type: "danger",
        position: "top-right",
        timeout: 3000,
        showIcon: true,
      });
    }
  }
}

function handleFileUploadResume(event) {
  resumeFile.value = event.target.files[0];
}

function handleFileUploadCoverLetter(event) {
  coverLetterFile.value = event.target.files[0];
}

function closeApplyPopup() {
  showApplyPopup.value = false;
  resumeFile.value = null;
  selectedJobId.value = null;
  coverLetterFile.value = "";
}

// Notification Logic
function pluralizeType(type, count) {
  const formatted = formatType(type).toLowerCase();
  return count > 1 ? `${formatted}s` : formatted;
}

const filteredNotifications = computed(() =>
  notifications.value.filter(
    (notif) =>
      notif && ["message", "inquiry", "application_update"].includes(notif.type)
  )
);

async function fetchNotifications() {
  try {
    const response = await axios.get("/notifications");
    const rawNotifications = response.data.notifications || [];

    const grouped = new Map();

    rawNotifications.forEach((notif) => {
      if (!notif || !notif.type) return;

      const key = `${notif.sender_id || "system"}_${notif.type}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          ...notif,
          count: 1,
          latestContent: notif.content,
        });
      } else {
        const existing = grouped.get(key);
        existing.count += 1;
        existing.latestContent = notif.content; // latest content
        grouped.set(key, existing);
      }
    });

    notifications.value = Array.from(grouped.values());
    newNotifications.value = notifications.value.length;

    console.log("Fetched notifications:", rawNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

function formatType(type) {
  switch (type) {
    case "job_application":
      return "Job Application";
    case "inquiry":
      return "Inquiry";
    case "application_update":
      return "Application Update";
    case "message":
      return "Message";
    case "full_time":
      return "Full-Time";
    case "part_time":
      return "Part-Time";
    case "internship":
      return "Internship";
    case "contract":
      return "Contract";
    case "other":
      return "Other";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function fetchHiredApplication() {
  try {
    const response = await axios.get("/applicant/applications");
    console.log("Applications:", response.data.applications);

    hiredApplication.value =
      response.data.applications.find((app) => app.status === "hired") || null;

    if (hiredApplication.value) {
      await fetchJobs(hiredApplication.value.job_id);

      const allJobs = [...recommendedJobs.value];
      hiredJobDetails.value =
        allJobs.find((job) => job.id === hiredApplication.value.job_id) || null;

      console.log("Hired job details:", hiredJobDetails.value);
    }
  } catch (error) {
    console.error("Error Occurred fetching applications", error);
  }
}

const downloadCertificate = async () => {
  if (!hiredApplication.value || !hiredApplication.value.id) {
    createToast("No hired application found.", {
      type: "warning",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
    });
    return;
  }

  try {
    const response = await axios.get(
      `/certificate/download/${hiredApplication.value.id}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `acceptance_certificate_${hiredApplication.value.id}.pdf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    createToast("Failed to download certificate.", {
      type: "danger",
      position: "top-right",
      timeout: 3000,
      showIcon: true,
    });
  }
};

function sendMessage(companyId) {
  selectedCompanyId.value = companyId;
  showMessagePopup.value = true;
}

async function sendActualMessage() {
  try {
    const response = await axios.post("/message/send", {
      receiver_id: selectedCompanyId.value,
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
      toastBackgroundColor: "#045d56",
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

onMounted(() => {
  fetchHiredApplication();
  fetchJobs();
  fetchNotifications();
  fetchDashboardCounts();
});
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
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: #fafafa;
  padding: 20px 0;
  border-radius: 2vh;
  border-right: 3.5px solid #045d56;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  margin-top: 15vh;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.topbar {
  height: 60px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #ccc;
  flex-shrink: 0;
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

.sidebar.collapsed {
  width: 0px;
  overflow: hidden;
  transition: width 0.3s ease;
}

.left-top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  background: #ffffff;
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
  width: 28%;
  max-height: 400px;
  overflow-y: auto;
  text-align: left;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease;
  resize: none;
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
  margin-right: 2vh;
}

.popup button:hover {
  background-color: #033f3a;
}

.apply-popup {
  background-color: #fff;
  padding: 30px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

.apply-popup h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
}

.apply-popup span {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #333;
}

.apply-popup input[type="file"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.apply-popup button {
  padding: 10px 20px;
  border: none;
  margin-right: 2vh;
  border-radius: 8px;
  cursor: pointer;
  background-color: #045d56;
  color: #fff;
  font-weight: bold;
  transition: background-color 0.2s ease;
}

.apply-popup button:hover {
  background-color: #f1f1f1;
  color: #045d56;
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
  margin-top: 10px;
  padding: 20px;
  display: flex;
  gap: 20px;
  overflow-y: auto;
}

.left-content {
  flex: 3;
}

.left-content h3 {
  margin-bottom: 2vh;
}

.cards {
  display: flex;
  gap: 15px;
}
.card {
  background: white;
  padding: 15px;
  border-radius: 3vh;
  text-align: center;
  flex: 1;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  margin-bottom: 1vh;
  border-bottom: #045d56 solid 4px;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.company-name {
  font-size: 20px;
  font-weight: bold;
}

.apply-btn {
  background-color: #045d56;
  color: #fff;
  border: none;
  margin-left: 0;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform: scale(1);
}

.apply-btn:hover {
  background-color: #f1f1f1;
  color: #045d56;
  transform: scale(1.08);
}

.message-btn {
  background-color: #045d56;
  color: #fff;
  width: auto;
  margin-left: 0;
  margin-right: 10px;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  transform: scale(1);
}

.message-btn:hover {
  background-color: #f1f1f1;
  color: #045d56;
  transform: scale(1.08);
}

.job-content {
  flex: 3;
  background: white;
  border-radius: 10px;
  border-bottom: #045d56 4px solid;
  padding: 15px;
  overflow: auto;
}
.job-box {
  border: 1px solid #ddd;
  padding: 15px;
  max-width: 90%;
  margin-left: 5vh;
  margin-bottom: 20px;
  border-radius: 12px;
  white-space: pre-line;
  border-left: #045d56 4px solid;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  text-transform: capitalize;
}

.job-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.job-title-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.job-description {
  font-size: 15px;
  margin-top: 3vh;
  margin-bottom: 3vh;
  margin-left: 10vh;
  margin-right: 10vh;
  line-height: 1.1;
  font-size: 18px;
  text-align: justify;
  text-indent: 2em;
}

.job-media {
  max-width: 100%;
  max-height: 60vh;
  margin-left: 25vh;
  margin-bottom: 10px;
}

.job-type,
.salary {
  font-weight: 500;
}
.job-info {
  display: flex;
  margin-top: 10px;
}

.job-detail {
  display: flex;
  margin-right: 5vh;
  align-items: center;
  gap: 5px;
}

label {
  background-color: #045d56;
  color: #fff;
  padding: 8px 10px;
  margin-top: 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 70%;
  transition: color 0.5s ease-in-out;
}

.right-content {
  flex: 1;
  border-radius: 10px;
  padding: 20px;
  height: fit-content;
  margin-top: -2vh;
}
.upd-content {
  flex: 1;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  height: fit-content;
}
.hired-status-box {
  background-color: white;
  border-bottom: 4px solid #2e7d32;
  border-radius: 1vh;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.hired-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.download-btn {
  background-color: #045d56;
  color: white;
  border: none;
  padding: 8px 16px;
  margin-top: 3vh;
  margin-left: 7vh;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.download-btn:hover {
  background-color: #f1f1f1;
  color: #045d56;
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

.custom-dropdown {
  position: absolute;
  top: 30px;
  right: 10%;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: none;
  width: 200px;
  z-index: 10;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-dropdown .dropdown-label {
  padding: 8px 12px;
  background-color: #045d56;
  color: white;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: bold;
}

.custom-dropdown .dropdown-options {
  list-style: none;
  margin: 0;
  padding: 0;
}

.custom-dropdown .dropdown-options li {
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.custom-dropdown .dropdown-options li:hover {
  background-color: #e0f2f1;
}

.industry-dropdown:hover .custom-dropdown {
  display: block;
}

.update-box {
  background-color: #f4f8fc;
  border-bottom: 4px solid #045d56;
  border-radius: 1vh;
  padding: 20px;
  font-size: 10px;
  margin-top: 2vh;
  margin-bottom: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-transform: capitalize;
}

.update-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1024px) {
  .hamburger {
    display: flex;
    z-index: 1001;
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

  .content {
    padding: 15px;
    gap: 15px;
  }
  .update-box {
    font-size: 12px;
    padding: 15px;
  }
  .left-content {
    flex: 3;
    padding: 20px;
    overflow-y: auto;
  }

  .main {
    margin-left: 0;
  }

  .topbar {
    left: 0;
  }
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    height: calc(100vh - 60px);
    padding: 15px;
    margin-top: 60px;
    overflow-y: auto;
  }

  .left-content {
    width: 100%;
    padding: 15px;
    height: auto;
    min-height: fit-content;
  }

  .right-content {
    width: 100%;
    padding: 15px;
    height: auto;
    margin-top: 15px;
  }

  .cards {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
  }

  .card {
    width: 100%;
    padding: 12px;
  }

  .job-box {
    width: 95%;
    margin: 10px auto;
    padding: 12px;
  }

  .job-description {
    margin: 15px;
    font-size: 14px;
  }

  .upd-content {
    margin-top: 15px;
  }

  .hired-status-box {
    margin-bottom: 15px;
  }

  .button-group {
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
  }

  .message-btn,
  .apply-btn {
    padding: 6px 10px;
    font-size: 12px;
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 10px;
  }

  .left-content,
  .right-content {
    padding: 10px;
  }

  .job-box {
    width: 100%;
    margin: 8px 0;
    padding: 10px;
  }

  .job-description {
    margin: 10px;
    font-size: 12px;
  }

  .message-btn,
  .apply-btn {
    font-size: 10px;
    padding: 4px 8px;
  }
}
</style>
