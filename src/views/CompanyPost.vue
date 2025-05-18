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
        <li style="font-weight: bold">
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
        <li>
          <router-link to="/CompanyApplication" class="sidenav-text">
            <img src="/public/resume.png" class="ikon" />
            APPLICATIONS
          </router-link>
        </li>
        <li>
          <router-link to="/CompanyProfile" class="sidenav-text">
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
      <div class="content">
        <div class="left-content">
          <div class="post-box">
            <h3 style="text-align: left; font-size: 30px">Job Description</h3>
            <button @click="postJob">Post Job</button>
            <input
              type="text"
              placeholder="Enter Job Title"
              class="job-title"
            />
            <textarea
              placeholder="Describe the job description of your company....."
            ></textarea>
            <div class="form-row">
              <div class="upload-media">
                <input type="file" id="media-picker" />
                <label for="media-picker">
                  <img
                    src="/public/gallery.png"
                    alt="upload icon"
                    class="ikon"
                  />
                  Upload Media
                </label>
              </div>

              <select class="job-form job-type" id="job-type">
                <option disabled selected>Industry</option>
                <option>Tech Field</option>
                <option>Hospitality & Tourism Management</option>
                <option>Education, Arts & Sciences</option>
                <option>Business & Accountancy</option>
                <option>Health Profession</option>
                <!-- 
                  <option>Information Technology</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Finance</option>
                  <option>Construction</option>
                  <option>Manufacturing</option>
                  <option>Retail</option>
                  <option>Hospitality</option>
                  <option>Transportation</option>
                  <option>Logistics</option>
                  <option>Real Estate</option>
                  <option>Marketing</option>
                  <option>Telecommunications</option>
                  <option>Media & Entertainment</option>
                  <option>Engineering</option>
                  <option>Legal Services</option>
                  <option>Government</option>
                  <option>Nonprofit</option>
                  <option>Agriculture</option>
                  <option>Automotive</option>
                  <option>Food & Beverage</option>
                  <option>Pharmaceuticals</option>
                  <option>Energy</option>
                  <option>Environmental Services</option>
                  <option>Fashion</option>
                  <option>Human Resources</option>
                  <option>Business Consulting</option>
                  <option>Arts & Design</option>
                  <option>Customer Service</option>
                  <option>Aerospace</option>
                  <option>Insurance</option>
                  <option>Security & Law Enforcement</option>
                  <option>Mining & Metals</option>
                  <option>Sports & Recreation</option>
                  <option>Tourism & Travel</option>
                  <option>E-commerce</option>
                  <option>Utilities</option>
                  <option>Publishing</option>
                  <option>Petroleum & Gas</option>
                  <option>Biotechnology</option> -->
              </select>

              <select class="job-form salary-range" id="salary-range">
                <option disabled selected>Salary</option>
                <option>₱0 - ₱10,000</option>
                <option>₱10,000 - ₱20,000</option>
                <option>₱20,001 - ₱30,000</option>
                <option>₱30,001 - ₱40,000</option>
                <option>₱40,001+</option>
              </select>
            </div>
          </div>
        </div>
        <div class="right-content">
          <h3>POSTED JOBS</h3>
          <div class="posted-jobs">
            <div
              class="posted-jobs-box"
              v-for="(job, index) in postedJobs"
              :key="index"
            >
              <h2>{{ job.title }}</h2>
              <p>{{ job.description }}</p>
              <small>{{ job.salary }}</small>
            </div>
            <p v-if="postedJobs.length === 0">No jobs posted yet.</p>
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
      messages: [
        "Jape: Interested in your post.",
        "Paulo: Sent a resume for the job.",
        "Cj: Asking about job requirements.",
      ],

      notifications: ["3 new applicants this week", "Job Posted", "bengbeng"],

      postedJobs: [
        {
          title: "Tech Field",
          description:
            "We are seeking a junior web developer to join our startup team. You’ll be helping build scalable applications.",
          salary: "₱20,001 - ₱30,000",
        },
        {
          title: "Tech Field",
          description:
            "We are seeking a junior web developer to join our startup team. You’ll be helping build scalable applications.",
          salary: "₱20,001 - ₱30,000",
        },
        {
          title: "Tech Field",
          description:
            "We are seeking a junior web developer to join our startup team. You’ll be helping build scalable applications.",
          salary: "₱20,001 - ₱30,000",
        },
        {
          title: "Tech Field",
          description:
            "We are seeking a junior web developer to join our startup team. You’ll be helping build scalable applications.",
          salary: "₱20,001 - ₱30,000",
        },
      ],
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
    postJob() {
      const text = document.querySelector("textarea").value;
      const industry = document.getElementById("job-type").value;
      const salary = document.getElementById("salary-range").value;

      if (!text || industry === "Industry" || salary === "Salary") {
        alert("Please complete all fields before posting.");
        return;
      }

      const job = {
        title: industry,
        description: text,
        salary: salary,
      };

      this.postedJobs.push(job);

      document.querySelector("textarea").value = "";
      document.getElementById("job-type").selectedIndex = 0;
      document.getElementById("salary-range").selectedIndex = 0;
    },
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

  /* background-image: url("/public/mainbg.png"); */
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
  margin-bottom: 20px;
  border-radius: 3vh;
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

input[type="file"] {
  display: none;
}

.form-row {
  display: flex;
  gap: 20vh;
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
  padding: 10px 15px;
  border-radius: 2vh;
  background-color: #045d56;
  color: #e0f2f1;
  font-size: 16px;
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
  width: 100%;
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
  padding: 10px;
  padding-top: 3vh;
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
  border: 1px solid #d0d7e1;
  border-radius: 10px;
  margin-top: 2vh;
  margin-left: 4vh;
  margin-bottom: 2vh;
  width: 35vh;
  padding: 10px 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.posted-jobs-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}
</style>
