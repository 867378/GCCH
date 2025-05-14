<template>
  <div class="container">
    <div class="sidebar">
      <img src="/public/gcchnobg.png" alt="GCCH Logo" class="logo" />
      <ul>
        <li>
          <router-link to="/CompanyDash" class="sidenav-text">
            <img src="/public/home.png" class="ikon" />
            HOME
          </router-link>
        </li>
        <li>
          <router-link to="/CompanyPost" class="sidenav-text">
            <img src="/public/laptop.png" class="ikon" /> POSTED JOBS
          </router-link>
        </li>
        <li>
          <router-link to="/CompanyMessage" class="sidenav-text">
            <img src="/public/message.png" class="ikon" />
            MESSAGES
          </router-link>
        </li>
        <li style="font-weight: bold">
          <router-link to="/CompanyApplication" class="sidenav-text">
            <img src="/public/resume.png" class="ikon" />
            APPLICATIONS
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
              <li>3 new applicants this week</li>
              <li>Job Posted</li>
              <li></li>
            </ul>
            <button @click="toggleNotif">Close</button>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="left-content">
          <div class="resume-box">
            <h3 style="text-align: left; font-size: 30px">Applications</h3>
            <div class="form-row">
              <div class="resume-list">
                <div
                  v-for="(app, index) in applications"
                  :key="index"
                  class="resume-item received"
                >
                  <h4>{{ app.name }}</h4>
                  <button @click="viewResume(app.resume, app)">
                    Open Resume
                  </button>

                  <select
                    v-model="app.status"
                    @change="app.showSave = true"
                    class="status-select"
                  >
                    <option disabled value="">Select status</option>
                    <option>Pending</option>
                    <option>Interview</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>

                  <button v-if="app.showSave" @click="saveStatus(app)" class="savebtn" >
                    Save
                  </button>
                </div>
                <div
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-content">
          <h3>UPDATES</h3>
          <div class="updates-list">
            <div
              v-for="(update, index) in updates"
              :key="index"
              class="update-box"
            >
              <h2>
                <span v-if="update.type === 'message'"></span>
                <span v-if="update.type === 'applicant'"></span>
                <span v-if="update.type === 'job_post'"></span>
                {{ update.user }} {{ update.content }}
              </h2>
              <p>{{ update.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMail: false,
      showNotif: false,
      showSignOut: false,
      unreadMessages: 0,
      newNotifications: 0,
      selectedUser: null,
      selectedApplicant: null,
      selectedStatus: "",
      showSave: false,

      updates: [
        {
          type: "message",
          user: "Jape",
          time: "10:47 AM",
          content: "sent you a message",
        },
        {
          type: "applicant",
          user: "Paulo",
          time: "9:15 AM",
          content: "submitted a resume",
        },
        {
          type: "job_post",
          user: "You",
          time: "8:00 AM",
          content: "posted a job ",
        },
      ],
      applications: [
        {
          name: "Paulo Cordova",
          resume: "/vincent.pdf",
          message:
            "I am interested in the posted job. My resume is below for your review.",
          status: "",
        },
        {
          name: "Prince Epal",
          resume: "/vincent.pdf",
          message:
            "Hello, I’d love to apply for this position. Please see my resume below.",
          status: "",
        },
        {
          name: "Jasper Espinoza",
          resume: "/vincent.pdf",
          message:
            "I’m excited to be considered for this opportunity. Resume is below.",
          status: "",
        },
        {
          name: "CJ Castillejo",
          resume: "/vincent.pdf",
          message:
            "I’m excited to be considered for this opportunity. Resume is below.",
          status: "",
        },
      ],
      showResumeModal: false,
      selectedResume: "",
    };
  },
  methods: {
    toggleMail() {
      this.showMail = !this.showMail;
      if (this.showMail) {
        this.unreadMessages = 0;
      }
    },
    toggleNotif() {
      this.showNotif = !this.showNotif;
      if (this.showNotif) {
        this.newNotifications = 0;
      }
    },
    toggleSignOut() {
      this.showSignOut = !this.showSignOut;
    },
    confirmSignOut() {
      console.log("Signing out...");
      window.location.href = "/login";
    },
    viewResume(resumeLink, applicant) {
      this.selectedResume = resumeLink;
      this.selectedApplicant = applicant;
      this.showResumeModal = true;
    },
    closeResume() {
      this.showResumeModal = false;
      this.selectedResume = null;
      this.selectedApplicant = null;
    },
  },
  saveStatus(applicant) {
    console.log(`Status for ${applicant.name} saved: ${applicant.status}`);
    this.updates.unshift({
      type: "status_update",
      user: "You",
      time: new Date().toLocaleTimeString(),
      content: `set ${applicant.name}'s application to "${applicant.status}"`,
    });
    this.newNotifications++;

    applicant.showSave = false;
  },

  mounted() {
    setInterval(() => {
      this.unreadMessages += 1;
      this.newNotifications += 1;
    }, 20000);
  },
};
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
  margin-top: 22vh;
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
  width: 98%;
  max-height: 85vh;
  overflow-y: auto;
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
  max-width: 60%;
  height: 100%;
  margin-left: 13vh;
  margin-bottom: 20px;
}

.resume-item button {
  background-color: #045d56;
  color: white;
  border: none;
  padding: 4px 14px;
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
  height: fit-content;
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
</style>
