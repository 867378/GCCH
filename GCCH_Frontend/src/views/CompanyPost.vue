<template>
  <div class="container">
    <div class="sidebar" :class="{ collapsed: !isSidenavOpen }">
      <img src="/public/gcchnobg.png" alt="GCCH Logo" class="logo" />
      <ul>
        <li>
          <router-link to="/companydash" class="sidenav-text">
            <img src="/public/home.png" class="ikon" />
            HOME
          </router-link>
        </li>
        <li style="font-weight: bold">
          <router-link to="/companypost" class="sidenav-text">
            <img src="/public/laptop.png" class="ikon" /> POSTED JOBS
          </router-link>
        </li>
        <li>
          <router-link to="/companymessage" class="sidenav-text">
            <img src="/public/message.png" class="ikon" />
            MESSAGES
          </router-link>
        </li>
        <li>
          <router-link to="/companyapplication" class="sidenav-text">
            <img src="/public/resume.png" class="ikon" />
            APPLICATIONS
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
          <img class="avatar" src="/public/user.png" alt="Avatar" />
        </div>
        <div class="icons-right">
          <div class="icon" @click="toggleMail">
            <img src="/public/mail.png" />
            <span v-if="unreadMessages > 0">{{ unreadMessages }}</span>
          </div>
          <div class="icon" @click="toggleNotif">
            <img src="/public/notification.png" />
            <span v-if="newNotifications > 0">{{ newNotifications }}</span>
          </div>
        </div>

        <div v-if="showMail" class="popup-overlay" @click.self="toggleMail">
          <div class="popup">
            <h3>📬 Messages</h3>
            <ul class="popup-list">
              <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
            </ul>
            <button @click="toggleMail">Close</button>
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

      <!-- JOB POSTING -->
      <div class="content">
        <div class="left-content">
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

            <h3>Applicants</h3>
            <ul v-if="jobApplicants.length > 0">
              <li v-for="application in jobApplicants" :key="application.applicant.id" class="mb-4">
                <strong>{{ application.applicant.first_name }} {{ application.applicant.last_name }}</strong><br>
                <span><strong>Course:</strong> {{ application.applicant.course }}</span><br>
                <span><strong>Phone:</strong> {{ application.applicant.phone_number }}</span><br>
                <span><strong>Cover Letter:</strong> {{ application.cover_letter }}</span><br>
                <span><strong>Status:</strong> {{ application.status }}</span><br>
                <span><strong>Date Applied:</strong> {{ application.date_applied }}</span><br>

                <div v-if="application.resume">
                  <a :href="application.resume.embed_url" target="_blank">📄 View Resume</a>
                </div>

                <div>
                  <button @click="assessApplication(application.applicant.id, 'accepted')">✅ Accept</button>
                  <button @click="assessApplication(application.applicant.id, 'rejected')">❌ Reject</button>
                  <button @click="scheduleInterview(application.applicant.id)">📅 Schedule Interview</button>
                  <button @click="scheduleAssessment(application.applicant.id)">📝 Schedule Assessment</button>
                </div>

                <hr>
              </li>
            </ul>

            <p v-else>No applicants have applied yet.</p>
            
          </div>
          <div v-else>
            <p>Select a job to view details and applicants.</p>
          </div>
        </div>

        <!-- JOB DISPLAY -->
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
              <p>{{ job.job_description }}</p>
              <p><strong>Location:</strong> {{ job.job_location }}</p>
              <p><strong>Type:</strong> {{ job.job_type }}</p>
              <p><strong>Monthly Salary:</strong> ₱{{ job.monthly_salary }}</p>
              <p><strong>Date Posted:</strong> {{ job.date_posted }}</p>
              <p>Status: {{ job.status }}</p>
            </div>
            <p v-if="postedJobs.length === 0">No jobs posted yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const showMail = ref(false);
const showNotif = ref(false);
const showSignOut = ref(false);
const unreadMessages = ref(0);
const newNotifications = ref(0);
const isSidenavOpen = ref(true);

const selectedJob = ref(null);
const jobApplicants = ref([]);
const messages = ref([]);
const notifications = ref([]);
const postedJobs = ref([]);

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
    axios.post('/logout')
      .then((response) => {
        console.log("Sign out successful:", response.data.message);
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

//Get Applicants of a Certain Job
  async function fetchApplicants(selectedJob) {
  try{
    const response = await axios.get(`/job/${selectedJob}/applications`);
    jobApplicants.value = response.data.applications;
    console.log(response.data)
  } catch (error) {
    console.error("Failed to fetch applicants", error);
  }
}

//Fetch Jobs
async function fetchPostedJobs() {
  try {
    const response = await axios.get("/company/jobdisplay");
    postedJobs.value = response.data.jobs;
    console.log(response.data)

    const applicants = await fetchApplicants(selectedJob);

    if (applicants === null) {
      alert("Error fetching applicants.");
      console.log("No applicants yet.");
      jobApplicants.value = []; // or set a message to show in the UI

    } else {
      jobApplicants.value = applicants;
    }

  } catch (error) {
    console.error("Error fetching posted jobs:", error);
  }
}

async function assessApplication(applicationId, status, scheduleAt = null, comment = ''){
  try {
    const payload = {
      status,
      scheduled_at: scheduleAt,
      comment
    };

    const response = await axios.post(`/company/job-applications/${applicationId}/assess`, payload);
    console.log ("Assessment Successful:", response.data);

    await fetchApplicants(selectedJob);

  } catch (error) {
    console.error("Error updating application status:", error.response?.data || error);
    alert(error.response?.data?.error || 'Failed to update application');
  }
}

onMounted(fetchPostedJobs);

function selectJob(job) {
  selectedJob.value = job;
  fetchApplicants(job.id); // assuming job.id is the unique identifier
}

function scheduleInterview(applicationId) {
  const date = prompt("Enter interview date (YYYY-MM-DD HH:MM:SS):");
  if (date) {
    assessApplication(applicationId, 'interview', date);
  }
}

function scheduleAssessment(applicationId) {
  const date = prompt("Enter assessment date (YYYY-MM-DD HH:MM:SS):");
  if (date) {
    assessApplication(applicationId, 'assessment', date);
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
  height: 100vh;
  overflow: hidden;
}
.sidebar {
  width: 200px;
  background: #fafafa;
  padding: 20px 0;
  border-right: 1px solid #ccc;
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
  display: flex;
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
}
.left-content {
  flex: 3;
}
.post-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 10px;
  border-radius: 3vh;
  margin-left: 4vh;
  width: 10vh;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 1vh;
  align-items: center;
  margin-top: 3vh;
}

.upload-media {
  display: flex;
  align-items: center;
  border-radius: 2vh;
  cursor: pointer;
}

.job-form {
  flex: 1;
  position: relative;
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

.job-form:focus {
  outline: none;
  box-shadow: 0 0 0 2px #80cbc4;
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

.job-title:hover {
  background-color: #e0f2f1;
  color: #045d56;
}

.job-title:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 2px #00bfa5;
  color: #000;
}
.job-input {
  width: 32vh;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
  margin-left: 2.5vh;
}
.salary-input {
  width: 32vh;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-left: 2.5vh;
}
.job-type {
  background-color: #045d56;
  color: #ffffff;
}

.salary-range {
  background-color: #045d56;
  color: #ffffff;
}

.job-type,
.salary-range {
  display: block;
  width: 70%;
}

.job-type option,
.salary-range option {
  background-color: white;
  color: black;
}

label {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #045d56;
  color: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

label:hover {
  background-color: #f1f1f1;
  color: #045d56;
}

.label:focus {
  outline: none;
  box-shadow: 0 0 0 2px #80cbc4;
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
  margin: 2vh;
  width: 35vh;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
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
  }
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 25vh;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .logo {
    margin-top: 8vh;
    margin-left: 4vh;
    margin-bottom: 10vh;
  }

  .post-box {
    border-radius: 3vh;
    width: 95%;
  }
  .post-box textarea {
    width: 100%;
    margin-top: 2vh;
    height: 25vh;
  }

  .right-content {
    padding-top: 3vh;
    margin-right: 1vh;
    height: 85vh;
    width: 50vh;
    overflow: auto;
  }

  .posted-jobs-box {
    margin-left: 2vh;
    width: 25vh;
    padding: 10px 20px;
  }

  .label {
    padding: 10px 10px;
    margin-right: 2vh;
  }

  .form-row {
    gap: 10vh;
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
    gap: 0;
    padding: 10px;
  }

  .sidebar {
    font-size: 10px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 25vh;
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

  .post-box {
    border-radius: 3vh;
    width: 95%;
  }
  .post-box textarea {
    width: 100%;
    margin-top: 1vh;
    height: 20vh;
  }

  .right-content {
    padding-top: 3vh;
    height: 80vh;
    overflow: auto;
  }

  .posted-jobs-box {
    font-size: 10px;
    width: 20vh;
    padding: 10px 10px;
  }

  .upload-media,
  .job-type,
  .salary-range {
    font-size: 10px;
    padding: 8px 10px;
  }

  .form-row {
    gap: 5vh;
  }

  .avatar {
    width: 30px;
    height: 30px;
  }
  .sign-out {
    width: 60px;
    height: 40px;
    margin-left: 5.5vh;
  }
}

@media (max-width: 480px) {
  .hamburger {
    display: flex;
    z-index: 1001;
  }
  .topbar {
    height: 12.5vh;
  }
  .content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .left-content {
    padding-left: 3vh;
    flex: 1;
  }
  .logo {
    margin-left: 5vh;
    margin-top: 5vh;
    margin-bottom: 5vh;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 25vh;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .post-box {
    width: 95%;
    margin-bottom: 10px;
    border-radius: 2vh;
  }

  .post-box button {
    padding: 6px 10px;
    margin-top: -5vh;
  }

  .right-content {
    flex: 1;
    margin-left: 7vh;
    padding-top: 3vh;
    height: auto;
    overflow: auto;
  }

  .posted-jobs-box {
    margin-left: 3vh;
    font-size: 10px;
    width: 40vh;
    padding: 10px 10px;
  }

  .upload-media,
  .job-type,
  .salary-range {
    font-size: 6px;
    padding: 6px 8px;
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

  .post-box {
    margin-bottom: 5px;
    border-radius: 2vh;
  }
  .post-box h3 {
    font-size: 25px;
  }
  .post-box textarea {
    margin-top: 2vh;
    height: 12vh;
  }
  .post-box button {
    font-size: 6px;
    padding: 8px 10px;
    margin-top: -4vh;
  }
  .right-content {
    flex: 1;
    margin-left: 3.5vh;
    padding-top: 3vh;
    height: auto;
    overflow: auto;
  }
}
</style>
