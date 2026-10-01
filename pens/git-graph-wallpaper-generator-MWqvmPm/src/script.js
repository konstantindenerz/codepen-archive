const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const getRandomInt = (max) => Math.floor(Math.random() * max);
const lineWidth = 2;
const gap = 5;
const colorPool = [
  "#3B82F6",
  "#B25FEA",
  "#5D5CDE",
  "#5E5CDD",
  "#EB5545",
  "#F8D74A",
  "#6BD35E",
  "#F8D74A",
  "#F1A33C",
  "#7EBED6",
  "#98989C",
  "#EB4A63"
];
const circleSize = 4;
const circleLineWidth = 3;
const circleCountPool = [0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0];

let reducedColorPool = [...colorPool];

const getColor = () => {
  if (reducedColorPool.length === 0) {
    reducedColorPool = [...colorPool];
  }
  return reducedColorPool.splice(getRandomInt(reducedColorPool.length),1)[0];
};

const render = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, w, h);
  const lineCount = Math.round(w / lineWidth / gap);
  for (let i = 0; i < lineCount; i++) {
    // line
    const c = getColor();
    const curveY = (lineCount - 1 - i) * gap;
    let curveYDistance = 10;
    const lineX = gap + i * lineWidth * gap;
    const lineY = curveY + curveYDistance * 6;
    ctx.fillStyle = c;
    ctx.fillRect(lineX, lineY, lineWidth, h);

    // curve
    let start = { x: 0, y: curveY - i * 2 };
    let cp1 = { x: 0, y: curveY + curveYDistance + 10 };
    let cp2 = { x: lineX + 1, y: curveY + curveYDistance * 2 + 20 };
    let end = { x: lineX + 1, y: curveY + curveYDistance * 3 + 30 };

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.strokeStyle = c;
    ctx.stroke();

    // circles

    const circleCount = circleCountPool[getRandomInt(circleCountPool.length)];

    for (let c = 0; c < circleCount; c++ /* ¯\_(ツ)_/¯ */) {
      const circleY = getRandomInt(h) + c * 10; /*gap between circles*/
      if (circleY < lineY + gap) {
        continue;
      }
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.fillStyle = "#111";
      ctx.lineWidth = circleLineWidth;
      ctx.arc(
        lineX + 1,
        circleY,
        circleSize,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      ctx.fill();
    }
  }
  let gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "transparent");
  gradient.addColorStop(0.4, "transparent");
  gradient.addColorStop(1, "black");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  
  gradient = ctx.createLinearGradient(0, 0, w/2, h/2);
  gradient.addColorStop(0, "black");

  gradient.addColorStop(.42, "transparent");
 
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
};

const update = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  render();
};

window.addEventListener("resize", update);
canvas.addEventListener("pointerdown", render);
(() => {
  requestAnimationFrame(update);
})();
