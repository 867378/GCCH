<template>
  <div class="container">
    <div class="sidebar">
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
          <router-link to="/Applicantprofile" class="sidenav-text">
            <img src="/public/user.png" class="ikon" />
            PROFILE
          </router-link>
        </li>
      </ul>
      <button class="sign-out" @click="toggleSignOut">
        <img src="/public/logout.png" alt="Sign Out Icon" />
        SIGN OUT
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
          <input type="text" placeholder="Search..." />
        </div>
        <div class="icons-right">
          <div class="icon industry-dropdown">
            <img src="/public/search.png" />
            <div class="custom-dropdown">
              <div class="dropdown-label">Industry</div>
              <ul class="dropdown-options">
                <li @click="filterBy('Tech Field')">Tech Field</li>
                <li @click="filterBy('Hospitality & Tourism Management')">
                  Hospitality & Tourism Management
                </li>
                <li @click="filterBy('Education, Arts & Sciences')">
                  Education, Arts & Sciences
                </li>
                <li @click="filterBy('Business & Accountancy')">
                  Business & Accountancy
                </li>
                <li @click="filterBy('Health Profession')">
                  Health Profession
                </li>
              </ul>
            </div>
          </div>

          <div class="icon industry-dropdown">
            <img src="/public/company.png" />
            <div class="custom-dropdown">
              <div class="dropdown-label">Company</div>
              <ul class="dropdown-options">
                <li>Estaciong Co.</li>
                <li>Barbatos Co.</li>
                <li>Lopez Co.</li>
                <li>Cordova Co.</li>
                <li>ong co.</li>
              </ul>
            </div>
          </div>

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
              <li>Company profile approved</li>
              <li>New feature: Analytics tab</li>
            </ul>
            <button @click="toggleNotif">Close</button>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="profile-wrapper">
          <div class="profile-card">
            <div class="form-group">
              <label class="profile-avatar-label">
                <img
                  :src="profileImage || '/public/user.png'"
                  alt="Profile"
                  class="profile-avatar"
                />
                <input
                  v-if="isEditing"
                  type="file"
                  accept="image/*"
                  @change="onImageChange"
                  style="display: none"
                />
              </label>
            </div>

            <div class="profile-form">
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" :readonly="!isEditing" v-model="fullName" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Age</label>
                  <select :disabled="!isEditing" v-model="age">
                    <option disabled>Select age</option>
                    <option v-for="n in 43" :key="n">{{ n + 17 }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Date of Birth</label>
                  <input type="date" v-model="profile" :readonly="!isEditing" />
                </div>

                <div class="form-group">
                  <label>Gender</label>
                  <select v-model="profile" :disabled="!isEditing">
                    <option>MALE</option>
                    <option>FEMALE</option>
                    <option>NON-BINARY</option>
                    <option>PREFER NOT TO SAY</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    maxlength="11"
                    :readonly="!isEditing"
                    placeholder="Enter phone number"
                  />
                </div>
                <div class="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    :readonly="!isEditing"
                    v-model="email"
                    placeholder="Example@gmail.com"
                  />
                </div>
              </div>
              <div class="btn-group">
                <button v-if="!isEditing" class="edit-btn" @click="toggleEdit">
                  EDIT
                </button>
                <button v-if="isEditing" class="save-btn" @click="saveChanges">
                  SAVE
                </button>
              </div>
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
      profileImage: null,
      isEditing: false,
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
    onImageChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.profileImage = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    saveChanges() {
      this.isEditing = false;
      // Save logic here (e.g., send to backend)
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
  flex-shrink: 0;
}

.logo {
  height: 8vh;
  width: 14vh;
  margin-right: 2.5vh;
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
  margin-top: 32.5vh;
  margin-left: 3.5vh;
  border-radius: 10px;
}

.sign-out img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
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

.ikon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
.main {
  flex-grow: 1;
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
  width: 25%;
  margin-left: 10%;
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

.content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  gap: 20px;
}
.left-content {
  flex: 3;
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

.profile-wrapper {
  justify-content: center;
}

.profile-card {
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  padding: 2rem;
  height: 100%;
  width: 100%;
  margin-left: 28vh;
  gap: 3rem;
}

.profile-avatar {
  width: 30vh;
  height: 30vh;
  object-fit: cover;
  margin-top: 2vh;
  margin-bottom: 3vh;
  border-radius: 50%;
  border: 4px solid #045d56;
}

.profile-avatar-label {
  cursor: pointer;
  display: inline-block;
}

.profile-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4f46e5;
  outline: none;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
  min-width: 200px;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.edit-btn,
.save-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.edit-btn {
  background: #045d56;
  color: #e0f2f1;
}

.edit-btn:hover {
  background: #d1d5db;
  color: #045d56;
}

.save-btn {
  background: #045d56;
  color: #e0f2f1;
}

.save-btn:hover {
  background: #d1d5db;
  color: #045d56;
}
</style>
