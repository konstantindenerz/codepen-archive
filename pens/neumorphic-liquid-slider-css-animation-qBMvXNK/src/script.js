const number = document.getElementById("number");
const device = document.getElementById("device");
const slider = document.getElementById("slider");
const random = (min, max) => {
  return Math.random() * (max - min) + min;
};

const interval = setInterval(() => {
  const offsetY = random(0, slider.offsetHeight - 20);
  requestAnimationFrame(() => update(offsetY));
}, 2000);

const update = (offsetY) => {
  const pos = Math.max(0, Math.min(slider.offsetHeight - 20, offsetY));
  slider.style.setProperty("--pos", `${pos}px`);
  const progress = Math.max(
    0,
    Math.min(100, 100 - (offsetY / slider.offsetHeight) * 100)
  );
  number.innerText = Math.round(progress * 0.42);
  device.style.setProperty("--progress", `${progress}%`);
};

let pointerdown = false;
slider.addEventListener("pointerdown", () => {
  pointerdown = true;
  clearInterval(interval);
});
slider.addEventListener("pointermove", ({ offsetY }) => {
  if (pointerdown) {
    update(offsetY);
  }
});
slider.addEventListener("pointerup", () => {
  pointerdown = false;
});

slider.addEventListener("pointerleave", () => {
  pointerdown = false;
  clearInterval(interval);
});
