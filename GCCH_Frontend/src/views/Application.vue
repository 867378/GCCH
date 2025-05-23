<template>
  <div class="container">
    <div class="sidebar" :class="{ collapsed: !isSidenavOpen }">
      <img src="/public/gcchnobg.png" alt="GCCH Logo" class="logo" />
      <ul>
        <li>
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
        <li style="font-weight: bold">
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
                <strong>{{ formatType(notif.type) }}</strong
                >: {{ notif.latestContent }}
                <span v-if="notif.count > 1"> ({{ notif.count }} new)</span
                ><br />
                <small>{{ new Date(notif.created_at).toLocaleString() }}</small>
              </li>
            </ul>
            <button @click="toggleNotif">Close</button>
          </div>
        </div>
      </div>

      <!-- Job Applications for Applicants -->
      <div class="content">
        <div class="left-content">
          <div class="resume-box">
            <h3 class="resumeh3">Applications</h3>
            <div class="form-row">
              <div class="resume-list">
                <div
                  v-for="application in applications"
                  :key="index"
                  class="resume-item received"
                >
                  <h4>Job Application for : {{ application.job_title }}</h4>
                  <p><strong>Job Title:</strong> {{ application.job_title }}</p>
                  <p><strong>Status:</strong> {{ application.status }}</p>
                  <p>
                    <strong>Schedule:</strong>
                    {{ application.schedule || "To be announced" }}
                  </p>
                  <p>
                    <strong>Comments:</strong>
                    {{ application.comments || "No comments yet." }}
                  </p>
                  <p>
                    <strong>Updated At:</strong> {{ formatDate(application.updated_at) }}
                  </p>

                  <!-- <button @click="viewResume(app.resume, app)">
                    View Resume
                  </button> -->
                </div>
                <!-- <div
                  v-if="showResumeModal"
                  class="app-overlay"
                  @click.self="closeResume"
                >
                  <div class="app">
                    <h3>📄 Resume</h3>
                    <p><strong>Name:</strong> {{ selectedApplicant.name }}</p>
                    <p>
                      <strong>Message:</strong>
                      {{ selectedApplicant.message || "No message provided." }}
                    </p>

                    <iframe
                      v-if="selectedResume"
                      :src="selectedResume"
                      width="100%"
                      height="500px"
                      frameborder="0"
                    ></iframe>
                    <button @click="closeResume">Close</button>
                  </div>
                </div> -->

              </div>
            </div>
          </div>
        </div>
        <!-- Notifications -->
        <div class="right-content">
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
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const isSidenavOpen = ref(true);
const showMail = ref(false);
const showNotif = ref(false);
const showSignOut = ref(false);
const unreadMessages = ref(0);
const newNotifications = ref(0);

const messages = ref([]);
const notifications = ref([]);
const applications = ref([]);

const router = useRouter();

//Methods for Nav Bars
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
    .then((response) => {
      console.log("Sign out successful:", response.data.message);
      router.push("/login");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
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
    case "other":
      return "Other";
  }
}

async function fetchJobApplications(){
  try{
    const response = await axios.get('/applicant/applications');
    console.log("Success", response.data);
    applications.value = response.data.applications;
    
  } catch (error) {
    console.error("Error Occured", error);
  }
}

// function viewResume(resumeLink, applicant) {
//   selectedResume.value = resumeLink;
//   selectedApplicant.value = applicant;
//   showResumeModal.value = true;
// }

// function closeResume() {
//   showResumeModal.value = false;
//   selectedResume.value = null;
//   selectedApplicant.value = null;
// }

// function saveStatus() {}

onMounted(() => {
  fetchJobApplications();
  fetchNotifications();
});

//   mounted() {
//     setInterval(() => {
//       this.unreadMessages += 1;
//       this.newNotifications += 1;
//     }, 20000);
//   },
// };

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  position: relative;
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

.resume-box {
  background: white;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 3vh;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
}
.resumeh3 {
  text-align: left;
  font-size: 1.7rem;
  margin-bottom: 2vh;
}
.resume-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 3vh;
  max-height: 100%;
  max-width: 100%;
}

.resume-item {
  padding: 12px 20px;
  border-radius: 10px;
  margin-left: 13vh;
  width: 60%;
  position: relative;
}

.resume-item.received {
  background-color: #f1f1f1;
  align-self: flex-start;
  border-left: 4px solid #045d56;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 58%;
  height: 100%;
  margin-left: 13vh;
  margin-bottom: 20px;
}

.resume-item button {
  background-color: #045d56;
  color: white;
  border: none;
  margin-right: 1vh;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.resume-item button:hover {
  background-color: #033f3a;
  transform: translateY(-2px);
}

.status-select {
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #bbb;
  border-radius: 6px;
  background-color: #f9f9f9;
  color: #333;
  cursor: pointer;
  margin-top: 1vh;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.status-select:focus {
  outline: none;
  border-color: #045d56;
  box-shadow: 0 0 3px rgba(4, 93, 86, 0.5);
}

.right-content {
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 20px;
  height: 80vh;
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

.app-overlay {
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

.app {
  background: white;
  padding: 25px;
  border: 1px solid #ccc;
  border-radius: 15px;
  max-width: 80%;
  max-height: 100%;
  overflow-y: auto;
  text-align: left;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: popIn 0.3s ease;
}

.app h3 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #045d56;
}

.app button {
  background-color: #045d56;
  color: rgb(247, 245, 245);
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.app button:hover {
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

.status-dropdown {
  padding: 6px 12px;
  font-size: 14px;
  border: 1px solid #bbb;
  border-radius: 6px;
  background-color: #f9f9f9;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 1vh;
  margin-top: 2vh;
}

.status-dropdown:focus {
  outline: none;
  border-color: #045d56;
  box-shadow: 0 0 3px rgba(4, 93, 86, 0.5);
}

.savebtn {
  background-color: #045d56;
  color: white;
  border: none;
  padding: 4px 14px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 10px;
  margin-left: 1vh;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.savebtn:hover {
  background-color: #033f3a;
  transform: translateY(-2px);
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

  .resume-box {
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
  }

  .resume-list {
    margin-left: -5vh;
    grid-template-columns: repeat(2, 1fr);
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

  .avatar {
    width: 30px;
    height: 30px;
  }
  .resume-box {
    width: 95%;
    max-height: 85vh;
    overflow-y: auto;
  }

  .resumeh3 {
    font-size: 1.5rem;
    margin-bottom: 2vh;
  }
  .resume-item {
    font-size: 12px;
    border-radius: 10px;
    width: 80%;
    position: relative;
  }
  .resume-item.received {
    background-color: #f1f1f1;
    align-self: flex-start;
    border-left: 4px solid #045d56;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 80%;
    height: 100%;
    margin-left: 5vh;
    margin-bottom: 20px;
  }
  .resume-item button {
    font-size: 10px;
    padding: 4px 10px;
  }
  .status-select {
    font-size: 10px;
    padding: 6px 10px;
  }
  .update-box {
    font-size: 8px;
    padding: 10px;
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

  .content {
    overflow: hidden;
    display: flex;
    flex-direction: column;
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
  .resume-box {
    overflow: auto;
  }

  .right-content {
    overflow: auto;
    width: 60vh;
    margin-left: 1vh;
    margin-bottom: 5vh;
  }
  .update-box {
    font-size: 8px;
    padding: 5px;
  }

  .sidebar.active {
    transform: translateX(0);
  }
}

@media (max-width: 385px) {
  .sidebar {
    width: 21vh;
    font-size: 8px;
  }
  .logo {
    height: 6vh;
    width: 10vh;
    margin-left: 3vh;
    margin-bottom: 5vh;
  }
  .resume-box {
    width: 95%;
    max-height: 50vh;
  }

  .resume-list {
    grid-template-columns: repeat(1, 1fr);
  }

  .left-content {
    flex: 1;
  }
  .right-content {
    width: 45vh;
    margin-left: 5vh;
    margin-bottom: 5vh;
  }
}
</style>
