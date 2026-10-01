const primaryColor = "#ea6161";
const source = "";

const getRndInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
let interval;

const start = () => {
  const canvas = document.getElementById("container");
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  const ctx = canvas.getContext("2d");
  const size = 14;
  ctx.font = `${size}px "Klingon pIqaD HaSta"`;
  const columns = Math.round(canvas.width / size);
  const rows = Math.round(canvas.height / size);
  const columnCells = Array(columns)
    .fill(0)
    .map(() => getRndInteger(0, canvas.height));

  const render = () => {
    ctx.fillStyle = "rgba(0,0,0,.07)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = primaryColor;
    columnCells.forEach((y, index) => {
      const text = source[getRndInteger(0, source.length + 2)] ?? "";
      const x = index * size;
      ctx.fillText(text, x, y);
      columnCells[index] =
        y > canvas.height + getRndInteger(0, 10000) ? 0 : y + size;
    });
  };

  interval = window.setInterval(render, 60);
};

(() => {
  start();

  window.addEventListener("resize", () => {
    clearInterval(interval);
    start();
  });
})();
