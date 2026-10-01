const [button] = document.querySelectorAll("[labs-button]");
button.addEventListener("mousemove", (event) => {
  const rect = button.getBoundingClientRect();
  const { style } = button;
  const right = event.offsetX > rect.width / 2;
  const top = event.offsetY <= rect.height / 2;
  style.removeProperty("--tr");
  style.removeProperty("--br");
  style.removeProperty("--tl");
  style.removeProperty("--bl");
  if (right) {
    button.classList.add("right");
  } else {
    button.classList.remove("right");
  }
  if (top && right) {
    style.setProperty("--tr", "1");
  } else if (!top && right) {
    style.setProperty("--br", "1");
  } else if (!top && !right) {
    style.setProperty("--bl", "1");
  } else if (top && !right) {
    style.setProperty("--tl", "1");
  }
  style.setProperty("--x", `${event.offsetX}px`);
  style.setProperty("--y", `${event.offsetY}px`);
});

button.addEventListener("mouseleave", () => {
  const { style } = button;
  style.removeProperty("--tr");
  style.removeProperty("--br");
  style.removeProperty("--tl");
  style.removeProperty("--bl");
});
