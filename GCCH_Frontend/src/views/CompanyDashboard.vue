<template>
  <div class="container">
    <div class="sidebar" :class="{ collapsed: !isSidenavOpen }">
      <img src="/public/gcchnobg.png" alt="GCCH Logo" class="logo" />
      <ul>
        <li style="font-weight: bold">
          <router-link to="/companydash" class="sidenav-text">
            <img src="/public/home.png" class="ikon" />
            HOME
          </router-link>
        </li>
        <li>
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
              <li v-for="(notif, index) in notifications" :key="index">
                <strong>{{ formatType(notif.type) }}</strong
                >: {{ notif.content }}
                <small>{{ new Date(notif.created_at).toLocaleString() }}</small>
              </li>
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
      <div class="content">
        <div class="left-content">
          <div class="cards">
            <div class="card">
              <p>
                <strong>
                  <img
                    src="/public/people.png"
                    alt="total clients Icon"
                    class="ikon"
                  />
                  ACCEPTED APPLICANTS</strong
                >
              </p>
              <p>{{ totalClients }}</p>
            </div>
            <div class="card">
              <p>
                <strong>
                  <img
                    src="/public/checklist.png"
                    alt="total job listings Icon"
                    class="ikon"
                  />
                  TOTAL JOB LISTINGS</strong
                >
              </p>
              <p>{{ totalJobs }}</p>
            </div>
            <div class="card">
              <p>
                <strong>
                  <img
                    src="/public/buffer.png"
                    alt="pending applications Icon"
                    class="ikon"
                  />
                  PENDING APPLICATION</strong
                >
              </p>
              <p>{{ pendingApplications }}</p>
            </div>
          </div>
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
                placeholder="Describe the job description of your company....."
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
                      >({{ selectedCourses.length }})</span
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
              <p><strong>Location:</strong> {{ job.job_location }}</p>
              <p><strong>Type:</strong> {{ job.job_type }}</p>
              <p><strong>Monthly Salary:</strong> ₱{{ job.monthly_salary }}</p>
              <p><strong>Date Posted:</strong> {{ job.date_posted }}</p>
              <p><strong>Status:</strong> {{ job.status }}</p>
              <p>
                <strong
                  >Slot: {{ job.filled_slots }}/{{ job.total_slots }}</strong
                >
              </p>
              <p>
                <strong>Recommended programs:</strong>
                {{
                  [
                    job.recommended_course,
                    job.recommended_course_2,
                    job.recommended_course_3,
                  ]
                    .filter((course) => course)
                    .join(", ")
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const showMail = ref(false);
const showNotif = ref(false);
const showSignOut = ref(false);
const unreadMessages = ref(0);
const newNotifications = ref(0);
const totalClients = ref(120);
const totalJobs = ref(50);
const pendingApplications = ref(10);
const isSidenavOpen = ref(true);

const messages = ref([]);
const notifications = ref({});
const postedJobs = ref([]);
//coirse dropdown

const showCourseDropdown = ref(false);
const selectedCourses = ref([]);

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

const jobData = ref({
  job_title: "",
  job_description: "",
  job_location: "",
  monthly_salary: "",
  job_type: "",
  recommended_course: "",
  recommended_course_2: "",
  recommended_course_3: "",
  total_slots: "",
});

function toggleCourseDropdown() {
  showCourseDropdown.value = !showCourseDropdown.value;
}

function toggleMail() {
  showMail.value = !showMail.value;
  if (showMail.value) unreadMessages.value = 0;
}

function toggleNotif() {
  showNotif.value = !showNotif.value;
  if (showNotif.value) newNotifications.value = 0;
}

function toggleSignOut() {
  showSignOut.value = !showSignOut.value;
}

function confirmSignOut() {
  axios
    .post("/logout")

    .then((response) => {
      console.log("Sign out successful:", response.data.message);
      router.push("/login");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

// Notification Logic
async function fetchNotifications() {
  try {
    const response = await axios.get("/notifications");
    notifications.value = response.data.notifications;
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
      return "Inquiry";
    case "other":
      return "Other";
  }
}

onMounted(() => {
  fetchNotifications();
});

async function postJob() {
  try {
    jobData.value.recommended_course = selectedCourses.value[0] || null;
    jobData.value.recommended_course_2 = selectedCourses.value[1] || null;
    jobData.value.recommended_course_3 = selectedCourses.value[2] || null;

    const response = await axios.post("/company/postjob", {
      job_title: jobData.value.job_title,
      job_description: jobData.value.job_description,
      job_location: jobData.value.job_location,
      monthly_salary: jobData.value.monthly_salary,
      job_type: jobData.value.job_type,
      recommended_course: jobData.value.recommended_course,
      recommended_course_2: jobData.value.recommended_course_2 || null,
      recommended_course_3: jobData.value.recommended_course_3 || null,
      total_slots: jobData.value.total_slots,
    });
    console.log("Job posted successfully:", response.data);
    alert(response.data.message);

    await fetchPostedJobs();

    jobData.value = {
      job_title: "",
      job_description: "",
      job_location: "",
      monthly_salary: "",
      job_type: "",
      recommended_course: "",
      recommended_course_2: "",
      recommended_course_3: "",
      total_slots: "",
    };
  } catch (error) {
    console.error("Error posting job:", error);
    alert(error);
  }
}

async function fetchPostedJobs() {
  try {
    const response = await axios.get("/company/jobdisplay");
    postedJobs.value = response.data.jobs;
  } catch (error) {
    console.error("Error fetching posted jobs:", error);
  }
}

onMounted(fetchPostedJobs);
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
  width: 44vh;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  color: #333;
  margin-left: 2.5vh;
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
  width: 80%;
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

.salary-input {
  width: 44vh;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-left: 2.5vh;
}
.slot-input {
  width: 44vh;
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
  text-transform: capitalize;
  border-left: #045d56 solid 5px;
}

.posted-jobs-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
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
}

.update-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
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

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 200px;
    z-index: 1000;
    transition: transform 0.3s ease;
  }

  .sidebar.active {
    transition: transform 0.3s ease;
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

  .post-box {
    width: 100%;
    padding: 15px;
  }

  .cards {
    flex-wrap: wrap;
    gap: 10px;
  }

  .card {
    min-width: 200px;
    font-size: 0.6rem;
  }

  .form-row {
    grid-template-columns: 2fr, 3;
    gap: 2vh;
  }

  .job-input,
  .salary-input,
  .slot-input {
    width: 100%;
    margin-left: 0;
  }

  .job-type,
  .salary-range {
    width: 100%;
    margin-left: 0;
  }

  .dropdown-checkbox {
    width: 100%;
    margin-left: 0;
  }

  .dropdown-btn {
    width: 100%;
  }

  .posted-jobs-box {
    width: 35vh;
    margin: 10px;
  }

  .right-content {
    padding: 15px;
  }

  .main {
    margin-left: 0;
  }

  .topbar {
    left: 0;
    padding: 0 15px;
  }

  .avatar {
    width: 25px;
    height: 25px;
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
  .left-content {
    flex: 1;
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
  .logo {
    height: 8vh;
    width: 13vh;
    margin-left: 4vh;
    margin-bottom: 10vh;
  }

  .post-box {
    width: 90%;
    padding: 15px;
    border-radius: 2vh;
    margin: 0 auto 15px;
    overflow: visible;
  }

  .post-box textarea {
    height: 20vh;
  }

  .post-box h3 {
    font-size: 24px;
  }
  .post-box button {
    padding: 6px 15px;
    margin-top: 10px;
  }
  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2vh;
    width: 100%;
    margin: 2vh 0;
    align-items: center;
  }
  .dropdown-checkbox {
    margin-top: 0vh;
  }
  .icon img {
    width: 20px;
    height: 20px;
  }
  label {
    padding: 6px 10px;
    margin-right: 13vh;
  }
  .cards {
    height: 5vh;
    width: 90%;
    margin-bottom: 7vh;
    padding-left: 5.6vh;
    font-size: 8px;
  }

  .update-box {
    border-radius: 1vh;
    padding: 20px;
    font-size: 7px;
    margin-bottom: 20px;
  }

  .avatar {
    width: 30px;
    height: 30px;
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
    padding: 15px;
    font-size: 12px;
  }

  .sign-out {
    width: 60px;
    height: 40px;
    margin-left: 5.5vh;
  }
}

@media (max-width: 435px) {
  .hamburger {
    display: flex;
    z-index: 1001;
  }

  .logo {
    margin-left: 5vh;
    margin-top: 5vh;
    margin-bottom: 5vh;
  }
  .cards {
    display: grid;
    grid-template-columns: (2, 1fr);
    width: 90%;
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
    margin-top: 33vh;
    margin-bottom: 10px;
    border-radius: 1vh;
  }
  .post-box textarea {
    margin-top: 2vh;
    height: 15vh;
  }
  .post-box button {
    padding: 6px 10px;
    margin-top: 10px;
    font-size: 10px;
  }

  .right-content {
    width: 90%;
    margin-left: 3vh;
    overflow: auto;
  }
  .form-row {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2vh;
    width: 100%;
    margin: 2vh 0;
    align-items: center;
  }

  .posted-jobs-box {
    width: 90%;
    margin: 10px 0;
    padding: 15px;
    font-size: 12px;
    margin-left: 2vh;
  }
}
@media (max-width: 375px) {
  .sidebar {
    width: 20vh;
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
  .post-box textarea {
    margin-top: 2vh;
    height: 12vh;
  }
  .post-box button {
    padding: 6px 8px;
    margin-top: 10px;
  }
}
</style>
