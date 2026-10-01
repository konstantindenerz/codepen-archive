const ctx = canvas.getContext("2d");
const pointsCount = 5000;
let centerX;
let centerY;
let points = [];
let pos;
const updateSize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  pos = {x: 0, y: centerY};
  
  points = new Array(pointsCount).fill(0).map(() => ({
    x: 0,
    y: centerY,
  }));
};

updateSize();

window.addEventListener("resize", updateSize);

function random(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

const draw = () => {
  ctx.fillStyle = "rgba(10,10,10,.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  points.forEach((point, index) => {
    if(index % pointsCount === 2){
      pos = {x: 0, y: centerY};
      points = new Array(pointsCount).fill(0).map(() => ({
    x: 0,
    y: centerY,
  }));
    }
    // pos.x += random(-1,1);
    pos.x += Math.floor(Math.random() * 2)
    pos.y += random(-1,1);
    ctx.fillStyle = `hsla(${index * .06 + 145}, 100%, 50%, 1)`;
    ctx.fillRect(pos.x, pos.y, 2, 2);
  })
  
  requestAnimationFrame(draw);
};

draw();
