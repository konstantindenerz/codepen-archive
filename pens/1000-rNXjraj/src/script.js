const counts = count.innerText;
const size = 35;
const ctx = canvas.getContext("2d");
const font = `${size}px monospace`;
ctx.font = font;
const metrics = ctx.measureText(counts);
canvas.width = metrics.width;
canvas.height = size;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.font = font;
ctx.fillStyle = "black";
ctx.fillText(counts, 0, canvas.height);

const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
const length = data.length;
const pixels = [];
let x = 0,
  y = 0;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
for (let i = 0; i < length; i += 4) {
  const pixel = { hit: data[i] === 0, i, x: x - centerX, y: y - centerY };
  if (data[i] === 0) {
    pixels.push(pixel);
  }
  x++;
  if (x === canvas.width) {
    x = 0;
    y++;
  }
}
pixels.forEach(({ x, y }, index) => {
  const tile = document.createElement("div");
  tile.style.setProperty("--p-x", `${x}`);
  tile.style.setProperty("--p-y", `${y}`);
  tile.style.setProperty("--p-i", `${index}`);
  tile.style.setProperty("--p-r", `${Math.random()}`);
  tile.style.setProperty("--p-r2", `${Math.random()}`);
  tiles.appendChild(tile);
});

document.addEventListener("click", () => {
  tiles.classList.remove("show");
  requestAnimationFrame(() => {
    tiles.classList.add("show");
  });
});
