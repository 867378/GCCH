<template>
  <div class="about-container">
    <h1 class="about-title">About Us</h1>
    <div class="about-content">
      <div class="about-gcch">
        <div class="about-heading">
          <h2 class>About GCCH</h2>
        </div>
        <p>
          Our website connects individuals with job opportunities that match
          their interests. We aim to simplify the application process, helping
          job seekers find employment quickly and efficiently. Additionally, our
          platform benefits companies by providing access to a pool of talented
          students and graduates from Gordon College, ready to contribute their
          skills and knowledge.
        </p>
      </div>
      <div class="about-mission-vision">
        <div class="about-mission">
          <div class="about-heading">
            <h3>Our Mission</h3>
          </div>
          <p>
            To connect students and job seekers with meaningful opportunities,
            empowering them to achieve career growth through a simplified and
            efficient platform.
          </p>
        </div>
        <div class="about-vision">
          <div class="about-heading">
            <h4>Our Vision</h4>
          </div>
          <p>
            To become the leading platform that bridges students, graduates, and
            employers, fostering a future where talent meets opportunity
            seamlessly.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<style>
html,
body {
  overflow: hidden;
  height: 100%;
}

body {
  font-family: sans-serif;
  background-color: #f8f9fa;
}

.about-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #374151;
  background-color: #f8f9fa!important; /* add this line */
  min-height: 100vh;
}

.about-title {
  font-size: 4.5rem;
  font-weight: 800;
  color: #045d56;
  margin-top: -.5rem;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 5px;
  text-align: center;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr;
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


.about-gcch p{
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
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.6s ease-in-out, box-shadow 0.6s ease-in-out;
}



@media (min-width: 768px) {
  .about-content {
    grid-template-columns: 1fr 1fr;
  }
}

.about-gcch {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  width: 100%;
  max-width: 40rem;
}

.about-mission {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  width: 100%;
  max-width: 30rem;
}

.about-vision {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  width: 100%;
  max-width: 30rem;
}

.about-gcch:hover,
.about-mission:hover,
.about-vision:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}
</style>
