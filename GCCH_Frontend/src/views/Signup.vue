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
          <form @submit.prevent = "submitApplicantForm">
            <input placeholder="First Name" v-model="form.firstName" required />
            <input
              placeholder="Middle Name (optional)"
              v-model="form.middleName"
            />
            <input placeholder="Last Name" v-model="form.lastName" required />
            <label for="birthday">Birthday</label>
            <input type="date" v-model="form.birthday" required />
            <select v-model="form.gender" required>
              <option value="" disabled selected>Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer Not To Say</option>
            </select>
            <input
              placeholder="Phone Number"
              v-model="form.phone"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="13"
              @input="form.phone = form.phone.replace(/\D/g, '')"
            />
            <select v-model="form.course" required>
              <option value="" disabled selected>Select Program</option>
              <option value="BSIT">BSIT</option>
              <option value="BSCS">BSCS</option>
              <option value="BSEMC">BSEMC</option>
              <option value="BSN">BSN</option>
              <option value="BSM">BSM</option>
              <option value="BSA">BSA</option>
              <option value="BSBA-FM">BSBA-FM</option>
              <option value="BSBA-HRM">BSBA-HRM</option>
              <option value="BSBA-MM">BSBA-MM</option>
              <option value="BSCA">BSCA</option>
              <option value="BSHM">BSHM</option>
              <option value="BSTM">BSTM</option>
              <option value="BAComm">BAComm</option>
              <option value="BECEd">BECEd</option>
              <option value="BCAEd">BCAEd</option>
              <option value="BPEd">BPEd</option>
              <option value="BEED">BEED</option>
              <option value="BSEd-Eng">BSEd-Eng</option>
              <option value="BSEd-Math">BSEd-Math</option>
              <option value="BSEd-Fil">BSEd-Fil</option>
              <option value="BSEd-SS">BSEd-SS</option>
              <option value="BSEd-Sci">BSEd-Sci</option>
              <option value="Other">Other</option>
            </select>

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
          <form @submit.prevent = "submitCompanyForm">
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
            <input placeholder="Province" v-model="form.province" required/>
            <input placeholder="Country" v-model="form.country" required />
            <input
              placeholder="Industry Type"
              v-model="form.industry_type"
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

<script setup>
import { ref,onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const userId = route.params.userId;
const currentStep = ref("select");
const selectedRole = ref("");
const form = ref({
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
  province: "",
  country: "",
  industry_type: "", 
})

if (!userId) {
  alert("User ID not found. Please log in again.");
  router.push("/login");
}

const continueAction = async() => {
  try {
    await axios.post(`user/set-role/${userId}`, {
      role: selectedRole.value,
    }, {withCredentials: true});

    currentStep.value = selectedRole.value;
  } catch (error) {
    console.error("Error setting role:", error);
    alert(error.response.data.message || "An error occurred");
  }
}
const goBack = () => {
  currentStep.value = "select";
}

const submitApplicantForm = async() => {
  try {
    const response = await axios.post(`user/applicant/profile/${userId}`,{
      first_name: form.value.firstName,
      middle_name: form.value.middleName,
      last_name: form.value.lastName,
      date_of_birth: form.value.birthday,
      gender: form.value.gender,
      phone_number: form.value.phone,
      course: form.value.course,
    });

    console.log(response.data);

    router.push("/applicantdash");
  } catch (error) {
    console.error("Error submitting form:", error);
    alert(error.response.data.message || "An error occurred");
  }
}

const submitCompanyForm = async() => {
  try {
    const response = await axios.post(`user/company/profile/${userId}`,{
      company_name: form.value.companyName,
      company_telephone: form.value.telephone,
      street_address: form.value.address,
      city: form.value.city,
      province: form.value.province,
      country: form.value.country,
      industry_type: form.value.industry_type,
    });

    console.log(response.data);

    router.push("/companydash");
  } catch (error) {
    console.error("Error submitting form:", error);
    alert(error.response.data.message);
  }
}
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

label[for="birthday"] {
  color: #045d56;
  font-size: 0.8rem;
  text-align: left;
  display: block; 
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  padding-left: 0.25rem;
}

/* .form-view label{
  font-size: 1rem;
text-align: left;
margin-right: 100vh;
margin-top: 0.5rem;

} */

/* label[for="birthday"] {
  color: #6B7280;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  text-align: left;
  font-weight: 500;
} */

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
