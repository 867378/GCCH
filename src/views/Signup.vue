<template>
  <div class="container">
    <div class="main-wrapper">
      <div class="photo-panel">
        <img src="/public/gcch logos.png" alt="Login Illustration" />
      </div>

      <div class="content-box">
        <div v-if="currentStep === 'select'">
          <h2 class="title">SELECT YOUR ROLE</h2>

          <select v-model="selectedRole" class="dropdown">
            <option value="" disabled selected>Select a role</option>
            <option value="applicant">APPLICANT</option>
            <option value="company">COMPANY</option>
          </select>

          <div v-if="selectedRole" class="selection-text">
            You selected: <strong>{{ selectedRole }}</strong>
            <button
              class="continue-btn"
              :disabled="!selectedRole"
              @click="continueAction"
            >
              CONTINUE
            </button>
          </div>
        </div>

        <!-- APPLICANT FORM  -->
        <div v-else-if="currentStep === 'applicant'" class="form-view">
          <h2 class="title">Applicant Information</h2>
          <form @submit.prevent>
            <input placeholder="First Name" v-model="form.firstName" required />
            <input
              placeholder="Middle Name (optional)"
              v-model="form.middleName"
            />
            <input placeholder="Last Name" v-model="form.lastName" required />
            <input type="date" v-model="form.birthday" required />
            <select v-model="form.gender" required>
              <option value="" disabled selected>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <input
              placeholder="Phone Number"
              v-model="form.phone"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="13"
              @input="form.phone = form.phone.replace(/\D/g, '')"
            />
            <input placeholder="Course" v-model="form.course" />

            <div class="button-group">
              <button type="button" class="back-btn" @click="goBack">
                Back
              </button>
              <button type="submit" class="kontinue-btn">Continue</button>
            </div>
          </form>
        </div>

        <!-- COMPANY FORM  -->
        <div v-else-if="currentStep === 'company'" class="form-view">
          <h2 class="title">Company Information</h2>
          <form @submit.prevent>
            <input
              placeholder="Company Name"
              v-model="form.companyName"
              required
            />
            <input
              placeholder="Company Telephone"
              v-model="form.telephone"
              inputmode="tel"
              maxlength="11"
              @input="
                form.telephone = form.telephone
                  .replace(/[^0-9()\-]/g, '')
                  .slice(0, 11)
              "
              required
            />
            <input
              placeholder="Street Address"
              v-model="form.address"
              required
            />
            <input placeholder="City" v-model="form.city" required />
            <input
              placeholder="Zip Code"
              v-model="form.zip"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="5"
              @input="form.zip = form.zip.replace(/\D/g, '').slice(0, 4)"
              required
            />
            <input placeholder="Country" v-model="form.country" required />
            <input
              placeholder="Industry Type"
              v-model="form.industry"
              required
            />

            <div class="button-group">
              <button type="button" class="back-btn" @click="goBack">
                Back
              </button>
              <button type="submit" class="kontinue-btn">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedRole: "",
      currentStep: "select",
      form: {
        // Common fields
        firstName: "",
        middleName: "",
        lastName: "",
        birthday: "",
        gender: "",
        phone: "",
        course: "",
        companyName: "",
        telephone: "",
        address: "",
        city: "",
        zip: "",
        country: "",
        industry: "",
      },
    };
  },
  methods: {
    continueAction() {
      this.currentStep = this.selectedRole;
    },
    goBack() {
      this.currentStep = "select";
    },
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("/public/bgtest.jpg") no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
}

.main-wrapper {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background-color: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.photo-panel {
  flex: 1;
  background-color: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.photo-panel img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.content-box {
  background-color: #ffffff;
  color: #111827;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-top: 5vh;
  max-width: 500px;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.dropdown,
input,
select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: box-shadow 0.2s;
}

.dropdown:focus,
input:focus,
select:focus {
  box-shadow: 0 0 0 2px #60a5fa;
}

.selection-text {
  margin-top: 1rem;
  color: #4b5563;
}

.continue-btn {
  margin-top: 1.5rem;
  background-color: #045d56;
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 70%;
  font-size: 1rem;
}

.continue-btn:hover:enabled {
  background-color: #f3f4f6;
  color: #045d56;
}

.continue-btn:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.kontinue-btn {
  margin-top: 1.5rem;
  background-color: #045d56;
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 20%;
  font-size: 1rem;
}

.kontinue-btn:hover:enabled {
  background-color: #f3f4f6;
  color: #045d56;
}

.kontinue-btn:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.back-btn {
  background-color: #e5e7eb;
  color: #111827;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1.25rem;
  border: none;
  margin-right: 10vh;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  background-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.photo-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 1rem;
}

.photo-panel img {
  max-width: 100%;
  height: 100%;
  border-radius: 1rem;
  object-fit: contain;
}
</style>
