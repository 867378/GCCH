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
        <li style="font-weight: bold">
          <router-link to="/Applicantmessage" class="sidenav-text">
            <img src="/public/mail.png" class="ikon" /> MESSAGES
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
        <div class="left-content">
          <div class="message-box">
            <h3 style="text-align: left; font-size: 30px">Messages</h3>
            <div class="form-row">
              <div class="messages-list">
                <div
                  v-for="(msgs, user) in messages"
                  :key="user"
                  class="message-item received"
                  @click="openChat(user)"
                  style="cursor: pointer"
                >
                  <p>
                    <strong>{{ user }}:</strong>
                    {{ msgs[msgs.length - 1].text }}
                  </p>
                  <span class="timestamp">{{
                    msgs[msgs.length - 1].time
                  }}</span>
                </div>
              </div>
              <div
                v-if="showMessagePopup"
                class="popup-overlay"
                @click.self="closeChat"
              >
                <div class="popup chat-popup">
                  <h3>💬 Chat with {{ selectedUser }}</h3>
                  <div
                    style="
                      max-height: 300px;
                      overflow-y: auto;
                      margin-bottom: 1rem;
                    "
                  >
                    <div
                      v-for="(msg, index) in messages[selectedUser]"
                      :key="index"
                      :class="[
                        'message-item',
                        msg.from === 'You' ? 'sent' : 'received',
                      ]"
                    >
                      <p>
                        <strong>{{ msg.from }}:</strong> {{ msg.text }}
                      </p>
                      <span class="timestamp">{{ msg.time }}</span>
                    </div>
                  </div>
                  <div class="reply-box">
                    <textarea
                      v-model="newReply"
                      placeholder="Type your message..."
                      @keyup="handleKeyUp"
                      @keydown.enter.prevent="sendReply"
                      class="expanding-textarea"
                    ></textarea>
                    <button @click="sendReply">Send</button>
                  </div>
                  <button @click="closeChat">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-content">
          <h3>CHECK THIS OUT</h3>
          <div>
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
      showMessagePopup: false,
      selectedUser: null,
      selectedCompany: null,
      messageContent: "",
      newReply: "",

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

      messages: {
        Jape: [
          {
            from: "Jane",
            text: "Hello! I'm interested in the job post.",
            time: "10:45 AM",
          },
          {
            from: "You",
            text: "Thank you! Please send your resume.",
            time: "10:46 AM",
          },
          {
            from: "Jane",
            text: "I just sent it. Let me know if received!",
            time: "10:47 AM",
          },
        ],
        Paulo: [
          {
            from: "Mark",
            text: "Can I apply without experience?",
            time: "9:15 AM",
          },
          {
            from: "You",
            text: "Yes, feel free to send your resume.",
            time: "9:17 AM",
          },
        ],

        Aaron: [
          {
            from: "Mark",
            text: "Can I apply without experience?",
            time: "9:15 AM",
          },
          {
            from: "You",
            text: "Yes, feel free to send your resume.",
            time: "9:17 AM",
          },
        ],
      },
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
    openChat(user) {
      this.selectedUser = user;
      this.showMessagePopup = true;
    },
    closeChat() {
      this.showMessagePopup = false;
      this.selectedUser = null;
    },
    handleKeyUp(event) {
      const textarea = event.target;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;

      if (event.key === "Enter" && !event.shiftKey) {
        this.sendReply();
      }
    },
    sendReply() {
      if (this.newReply.trim() && this.selectedUser) {
        const now = new Date();
        const time = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        this.messages[this.selectedUser].push({
          from: "You",
          text: this.newReply,
          time: time,
        });
        this.newReply = "";
      }
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
  width: 28%;
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

.popup.chat-popup {
  display: flex;
  flex-direction: column;
  height: auto;
  width: 90vh;
  padding: 20px;
  border-radius: 16px;
  background: white;
  overflow: hidden;
}

.popup.chat-popup h3 {
  margin-bottom: 15px;
  font-size: 22px;
  color: #045d56;
}

.popup.chat-popup .message-item {
  padding: 12px 15px;
  border-radius: 10px;
  max-width: 75%;
  position: relative;
  margin-bottom: 10px;
  font-size: 14px;
  word-wrap: break-word;
}

.popup.chat-popup .sent {
  background-color: #d1f4ec;
  align-self: flex-end;
  border-right: 4px solid #045d56;
  margin-left: 18vh;
}

.popup.chat-popup .received {
  background-color: #f1f1f1;
  align-self: flex-start;
  border-left: 4px solid #045d56;
}

.popup.chat-popup .timestamp {
  font-size: 11px;
  color: #666;
  margin-top: 5px;
  text-align: right;
  display: block;
}

.popup.chat-popup button {
  background-color: #045d56;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
}

.popup.chat-popup button:hover {
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
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  gap: 20px;
}
.left-content {
  flex: 3;
}

.message-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border-radius: 3vh;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.messages-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
  margin-left: 20vh;
  max-height: 100%;
  max-width: 100%;
  overflow-y: auto;
}

.message-item {
  padding: 12px 20px;
  border-radius: 10px;
  max-width: 75%;
  position: relative;
}

.message-item.received {
  background-color: #f1f1f1;
  align-self: flex-start;
  border-left: 4px solid #045d56;
  max-width: 80%;
  max-height: fit-content;
}

.message-item.sent {
  background-color: #d1f4ec;
  align-self: flex-end;
  border-right: 4px solid #045d56;
  text-align: right;
  max-width: 80%;
}

.timestamp {
  font-size: 11px;
  color: #666;
  margin-top: 5px;
  display: block;
  text-align: right;
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
}

.update-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}


.reply-box {
  display: flex;
  gap: 10px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #ccc;
}

.reply-box input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 1vh;
}

.reply-box button {
  background-color: #045d56;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.reply-box button:hover {
  background-color: #e0f2f1;
  color: #045d56;
}

.expanding-textarea {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  overflow: hidden;
  line-height: 1.4;
  font-family: inherit;
  font-size: 1rem;
  max-height: 150px; 
  transition: height 0.2s ease; 
  margin-top: 1vh;
  overflow-y: auto;
}
</style>
