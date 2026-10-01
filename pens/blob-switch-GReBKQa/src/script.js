(() => {
  const input = document.getElementById("input");
  const demo = () => {
    input.checked = !input.checked;
  };
  const interval = setInterval(demo, 1500);
  input.addEventListener("click", () => clearInterval(interval));
})();
