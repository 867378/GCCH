<template>
  <div class="container-wrapper">
    
    <!-- Login Section -->
    <section class="login-section" id="login">
      <div class="login-page">
        <nav class="navbar">
          <div class="logo">
            <img src="/public/gcchnobg.png" alt="GCCH Logo" />
          </div>
          <ul class="nav-links">
            <li><a href="#login">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#footer">Contact</a></li>
          </ul>
          <button class="sign-up">SIGN UP</button>
        </nav>
      </div>
      <div class="login-container">
        <form class="login-form">
          <h2>Welcome To GCCH</h2>
          <p>E-mail Address:</p>
          <input
            type="text"
            class="login-input"
            placeholder="sample@gmail.com"
            required
          />
          <p>Password:</p>
          <input
            type="password"
            class="login-input"
            placeholder="Password"
            required
          />
          <button type="submit" class="login-btn">Login</button>
        </form>
      </div>
    </section>

    <div class="overlay-modal" id="signupModal">
      <div class="signup-modal">
        <span class="close-btn" id="closeModal">&times;</span>
        <div id="applicantFields">
          <span class="close-btn" id="closeModal">&times;</span>
          <h2>Create an Account</h2>
          <div class="signup-toggle">
            <button type="button" class="toggle-btn active" id="applicantBtn">
              Applicant
            </button>
            <button type="button" class="toggle-btn" id="companyBtn">
              Company
            </button>
          </div>
          <form class="signup-form">
            <div class="auth-buttons">
              <button class="google-btn">
                <img src="/public/google.png" alt="Google" />
                Continue with Google
              </button>

            </div>
          </form>
        </div>

        <div id="companyFields">
          <span class="close-btn" id="closeModal">&times;</span>
          <h2>Create an Account</h2>
          <div class="signup-toggle">
            <button type="button" class="toggle-btn active" id="applicantBtn2">
              Applicant
            </button>
            <button type="button" class="toggle-btn" id="companyBtn2">
              Company
            </button>
          </div>
          <form class="signup-form">
            <div class="auth-buttons">
              <button class="google-btn">
                <img src="/public/google.png" alt="Google" />
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- About Us Section -->
    <section class="about-section" id="about">
      <div class="about-container">
        <h1 class="about-title">About Us</h1>
        <div class="about-content">
          <div class="about-gcch">
            <div class="about-heading">
              <h2>About GCCH</h2>
            </div>
            <p>
              Our website connects individuals with job opportunities that match
              their interests. We aim to simplify the application process,
              helping job seekers find employment quickly and efficiently.
              Additionally, our platform benefits companies by providing access
              to a pool of talented students and graduates from Gordon College,
              ready to contribute their skills and knowledge.
            </p>
          </div>
          <div class="about-mission-vision">
            <div class="about-mission">
              <div class="about-heading">
                <h3>Our Mission</h3>
              </div>
              <p>
                To connect students and job seekers with meaningful
                opportunities, empowering them to achieve career growth through
                a simplified and efficient platform.
              </p>
            </div>
            <div class="about-vision">
              <div class="about-heading">
                <h4>Our Vision</h4>
              </div>
              <p>
                To become the leading platform that bridges students, graduates,
                and employers, fostering a future where talent meets opportunity
                seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="footer-section" id="footer">
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-section">
            <h3>Navigation</h3>
            <a href="#login">Home</a>
            <a href="#about">About Us</a>
          </div>
          <div class="footer-section">
            <h3>CONTACT US</h3>
            <p>&#9993; GCCH@gordoncollege.edu.ph</p>
            <p>&#9742; 09991225486</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 GCCH. All Rights Reserved.</p>
        </div>
      </footer>
    </section>
  </div>
</template>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const signUpBtn = document.querySelector(".sign-up");
  const signupModal = document.getElementById("signupModal");

  const applicantBtn = document.getElementById("applicantBtn");
  const companyBtn = document.getElementById("companyBtn");
  const applicantBtn2 = document.getElementById("applicantBtn2");
  const companyBtn2 = document.getElementById("companyBtn2");

  const applicantFields = document.getElementById("applicantFields");
  const companyFields = document.getElementById("companyFields");

  signUpBtn.addEventListener("click", () => {
    signupModal.style.display = "flex";
    showApplicantForm();
  });

  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      signupModal.style.display = "none";
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target === signupModal) {
      signupModal.style.display = "none";
    }
  });

  function showApplicantForm() {
    applicantFields.style.display = "block";
    companyFields.style.display = "none";
    applicantBtn.classList.add("active");
    companyBtn.classList.remove("active");
    applicantBtn2.classList.add("active");
    companyBtn2.classList.remove("active");
  }

  function showCompanyForm() {
    applicantFields.style.display = "none";
    companyFields.style.display = "block";
    applicantBtn.classList.remove("active");
    companyBtn.classList.add("active");
    applicantBtn2.classList.remove("active");
    companyBtn2.classList.add("active");
  }

  applicantBtn.addEventListener("click", showApplicantForm);
  applicantBtn2.addEventListener("click", showApplicantForm);

  companyBtn.addEventListener("click", showCompanyForm);
  companyBtn2.addEventListener("click", showCompanyForm);
});
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Poppins', sans-serif;
  overflow: auto;
  overflow-x: hidden;
}

.container-wrapper {
  width: 100%;
}

section {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
  width: 100%;
}

.login-section {
  flex-shrink: 0;
  height: 100vh;
}

.login-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url("/public/landingpage.png");
  background-size: cover;
  min-height: 100vh;
}

.navbar {
  position: sticky;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem 2rem;
  background-color: #f1f6f3;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #ddd;
  z-index: 1000;
}

.logo img {
  height: 7vh;
  width: 13vh;
  margin-top: 1vh;
  margin-left: 4vh;
}

.nav-links {
  font-family: sans-serif;
  list-style: none;
  display: flex;
  gap: 20px;
  margin-top: 1.5vh;
  margin-right: 100vh;
}

.nav-links li a {
  text-decoration: none;
  color: #045d56;
  font-size: 1.2rem;
  padding: 10px 20px;
}

.nav-links li a:hover {
  background: #045d56;
  border-radius: 20px;
  color: #eaedea;
  transition: background 0.3s ease;
}

.sign-up {
  padding: 10px 20px;
  margin-right: 6vh;
  font-family: sans-serif;
  background: #045d56;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #eaedea;
}

.sign-up:hover {
  background: #97bbb7;
  color: #151515;
  transition: background 0.3s ease;
}

.auth-buttons {
  flex-direction: column;
  align-items: center;
  width: 200vh; 
  text-align: center;
}

.auth-buttons button {
  width: 100%;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}


.separator {
  font-weight: bold;
  color: #999;
  margin: 20px auto;
}

.login-container {
  position: absolute;
  top: 55%;
  left: 75%;
  transform: translate(-50%, -50%);
  background: #fff8f0;
  padding: 3rem;
  border-radius: 20px;
  border-color: #086972;
  border-width: 2px;
  border-style: solid;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  text-align: center;
  height: 50vh;
  width: 50vh;
}

.login-form h2 {
  font-size: 5vh;
  margin-top: -.5vh;
  margin-bottom: 1.5 rem;
  font-family: "Arial", sans-serif;
  color: #17224d;
  letter-spacing: 0.5px;
}

.login-form p {
  font-size: 1rem;
  font-weight: bold;
  font-family: "Arial", sans-serif;
  color: #17224d;
  text-align: left;
}

.login-form h3 {
  font-size: 0.7rem;
  font-family: "Arial", sans-serif;
  color: #17224d;
}

.login-input {
  padding: 12px;
  font-size: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}

.login-input:focus {
  border-color: #045d56;
  outline: none;
  box-shadow: 0 0 5px rgba(4, 93, 86, 0.5);
}

.login-btn {
  padding: 12px 20px;
  background-color: #045d56;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  width: 80%;
  margin-top: 1rem;
}

.login-btn:hover {
  background-color: #f1f1f1;
  color: #045d56;
  transition: background-color 0.3s ease;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.social-icon:hover {
  transform: scale(1.1);
}

.about-section {
  flex-grow: 1;
}

.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #374151;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.about-title {
  font-size: 5.5rem;
  font-weight: 800;
  color: #045d56;
  margin-top: 1rem;
  margin-bottom: 4rem;
  text-transform: uppercase;
  letter-spacing: 5px;
  text-align: center;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr, 1fr;
  gap: 20vh;
  max-width: 60rem;
  width: 150vh;
}

.about-mission-vision {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 40rem;
}

.about-heading h2 {
  font-size: 3.5rem;
  font-weight: bold;
  color: #045d56;
  margin-bottom: 1rem;
  text-align: center;
}

.about-heading h3 {
  font-size: 3.5rem;
  font-weight: bold;
  color: #045d56;
  margin-top: -1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.about-heading h4 {
  font-size: 3.5rem;
  font-weight: bold;
  color: #045d56;
  margin-top: -1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.about-gcch p {
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.2;
  color: #374151;
  text-align: center;
}

.about-gcch:hover,
.about-mission:hover,
.about-vision:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(4, 93, 86, 0.8);
  transition: transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out;
}

.footer-section {
  background-color: #0f8073;
  color: white;
  height: 18vh;
  text-align: center;
}

.footer-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 100%;
}

.footer-section h3 {
  font-weight: bold;
}
.footer-section a {
  color: white;
  text-decoration: none;
  display: block;
  margin-top: 5px;
}
.footer-section a:hover {
  text-decoration: underline;
}
.footer-bottom {
  border-top: 1px solid white;
  background-color: #0f8073;
  margin-top: 1px;
  font-size: 14px;
}
.footer-bottom p {
  margin: 0;
  padding: 10px;
  color: white;
  font-size: 14px;
  text-align: center;
}

.overlay-modal {
  display: none;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
}

.signup-modal {
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
  height: 25vh;
  width: 50vh;
  max-width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  position: center;
  margin-left: 80vh;
  margin-top: 25vh;
  max-height: 65vh;
}

.signup-modal h2 {
  color: #045d56;
  font-weight: bold;
  font-size: 2.5rem;
  margin-top: -0.1rem;
  margin-bottom: 1.5rem;
}

.signup-form button {
  width: 20%;
  display: block;
  padding: 10px;
  background: #f1f1f1;
  color: #045d56;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  justify-content: center;
  transition: background 0.3s ease;
}

.signup-form button:hover {
  background-color: #045d56;
  color: #eaedea;
}

.auth-buttons {
margin-left: 5vh;
}

.google-btn {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ddd;
}

.email-btn {
  background-color: #f1f1f1;
  color: #333;
  width: 1vh;
  border: 1px solid #ccc;
}

.facebook-btn {
  background-color: #3b5998;
  color: #ffffff;
}

.auth-buttons img {
  width: 24px;
  height: 24px;
}

.signup-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.toggle-btn {
  padding: 10px 20px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.toggle-btn.active {
  background-color: #045d56;
  color: white;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: #444;
}
</style>
