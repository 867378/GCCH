<template>
  <div class="container">
    <h1>CREATORS</h1>
    <div class="creators">
      <div class="creator">
        <img src="/public/aaron.jpg" alt="Aaron Jan Estacio" />
        <h3>Aaron Jan Estacio</h3>
        <p>Gordon College CCS Student</p>
      </div>
      <div class="creator">
        <img src="/public/vincent.png" alt="Vincent David P. Ong" />
        <h3>Vincent David P. Ong</h3>
        <p>Gordon College CCS Student</p>
      </div>
    </div>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
  text-align: center;
  background-image: url("/public/creatorsbg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.container {
  text-align: center;
  margin-top: 10vh;
}
.creators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20vh;
}
.creator {
  text-align: center;
  margin: 20px;
}
.creator img {
  width: 50vh;
  height: 50vh;
  border-radius: 50%;
  border: 3px solid black;
}
h1 {
  color: #024731;
}
</style>
