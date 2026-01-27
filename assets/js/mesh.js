const canvas = document.getElementById("mesh-bg");
const ctx = canvas.getContext("2d");

let w, h;
let time = 0;
let mouse = { x: -9999, y: -9999 };

const GRID_SIZE = 40;
const LINE_COLOR = "rgba(255,255,255,0.35)";
const SPEED = 0.1;
const SPIRAL_RADIUS = 200;
const SPIRAL_STRENGTH = 0.5;

// Resize
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// // Mouse
// window.addEventListener("mousemove", e => {
//   mouse.x = e.clientX;
//   mouse.y = e.clientY;
// });

// window.addEventListener("mouseleave", () => {
//   mouse.x = -9999;
//   mouse.y = -9999;
// });

// Noise function - random omnidirectional flow
function noise(x, y, t) {
  // Random multidirectional movement
  const randomDir1X = Math.sin(t * 0.5) * 15;
  const randomDir1Y = Math.cos(t * 0.7) * 15;
  const randomDir2X = Math.sin(t * 0.3 + 2) * 15;
  const randomDir2Y = Math.cos(t * 0.6 + 2) * 15;
  
  // Reduced amplitude wave propagation
  const wave1 = Math.sin((x + randomDir1X + t * 30) * 0.01) * Math.cos((y + randomDir1Y + t * 25) * 0.008);
  const wave2 = Math.sin((x - y + t * 35) * 0.02) * 0.3;
  const wave3 = Math.cos((x + y + randomDir2X + t * 28) * 0.012) * Math.sin(t * 0.6 + randomDir2Y * 0.01);
  
  return wave1 + wave2 + wave3;
}

// Distortion function
function distort(x, y) {
  const dx = x - mouse.x;
  const dy = y - mouse.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > SPIRAL_RADIUS) return { x, y };

  const force = (1 - dist / SPIRAL_RADIUS) * SPIRAL_STRENGTH;
  
  // Smooth radial push effect - scalable without rotation
  const pushMagnitude = force * 30;
  const pushX = (dx / dist) * pushMagnitude;
  const pushY = (dy / dist) * pushMagnitude;

  return {
    x: x + pushX,
    y: y + pushY
  };
}

// Draw mesh
function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 1.5;

  for (let y = 0; y < h; y += GRID_SIZE) {
    ctx.beginPath();
    for (let x = 0; x < w; x += GRID_SIZE) {
      const wave = noise(x, y, time) * 20;
      let px = x;
      let py = y + wave;

      const d = distort(px, py);
      if (x === 0) ctx.moveTo(d.x, d.y);
      else ctx.lineTo(d.x, d.y);
    }
    ctx.stroke();
  }

  for (let x = 0; x < w; x += GRID_SIZE) {
    ctx.beginPath();
    for (let y = 0; y < h; y += GRID_SIZE) {
      const wave = noise(x, y, time) * 20;
      let px = x + wave;
      let py = y;

      const d = distort(px, py);
      if (y === 0) ctx.moveTo(d.x, d.y);
      else ctx.lineTo(d.x, d.y);
    }
    ctx.stroke();
  }

  time += SPEED;
  requestAnimationFrame(draw);
}

draw();
