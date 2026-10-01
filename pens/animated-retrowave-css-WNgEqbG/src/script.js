const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const stars = document.getElementById("stars");

const render = () => {
  // Create stars ✨
  stars.innerHTML = "";
  const w = window.innerWidth;
  const h = window.innerHeight;
  const starCount = getRandomInt(42, 100);

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    const x = getRandomInt(0, w);
    const y = getRandomInt(0, h);
    star.style.setProperty("--x", `${x}px`);
    star.style.setProperty("--y", `${y}px`);
    stars.appendChild(star);
  }
};

requestAnimationFrame(render);
const volume = document.getElementById("volume");
const audio = document.getElementById("synthwave-track");

const volumeToggle = () => {
  if (volume.classList.contains("playing")) {
    volume.classList.remove("playing");
    audio.pause();
  } else {
    volume.classList.add("playing");
    audio.play();
  }
};

volume.addEventListener("pointerdown", () => volumeToggle());
volume.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    volumeToggle();
  }
});

window.addEventListener("resize", () => requestAnimationFrame(render));
