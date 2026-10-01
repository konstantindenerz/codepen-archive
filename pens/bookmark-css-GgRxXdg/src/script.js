// demo
setTimeout(() => (input.checked = !input.checked), 300);
const interval = setInterval(() => (input.checked = !input.checked), 4000);
addEventListener("click", () => {
  clearInterval(interval);
});
addEventListener("touchstart", () => {
  clearInterval(interval);
});
