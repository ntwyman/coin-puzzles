const math = require("mathjs");
const canvas = document.getElementById("canvas");
const scale = 40;
var circles = math.matrix([[true, true], [true, false]]);
draw();

function relMouseCoords(event) {
  var totalOffsetX = 0;
  var totalOffsetY = 0;
  var canvasX = 0;
  var canvasY = 0;
  var currentElement = canvas;
  do {
    totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
  } while ((currentElement = currentElement.offsetParent));

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  return { x: canvasX, y: canvasY };
}

function draw() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const maxX = canvas.width;
  const maxY = canvas.height;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, maxX, maxY);
  ctx.fillStyle = "rgb(180,180,180)";
  for (x = 0; x < maxX; x += scale) {
    for (y = 0; y < maxY; y += scale) {
      if (((x + y) / scale) & 0x01) {
        ctx.fillRect(x, y, scale, scale);
      }
    }
  }

  ctx.fillStyle = "green";
  circles.forEach(function(isCoin, index, matrix) {
    if (isCoin) {
      ctx.beginPath();
      ctx.arc(
        index[0] * scale + scale / 2,
        index[1] * scale + scale / 2,
        (scale * 3) / 8,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
    }
  });
}

window.addEventListener("resize", () => {
  draw();
});

function getSize() {
  var sz = math.size(circles);
  return [math.subset(sz, math.index(0)), math.subset(sz, math.index(1))];
}

function isSet(x, y) {
  [xSize, ySize] = getSize();
  return x < xSize && y < ySize && math.subset(circles, math.index(x, y));
}

function removeCircle(x, y) {
  // Will only be called when x & y are within the existing matrix
  circles.subset(math.index(x, y), false);
}

function addCircle(x, y) {
  [xSize, ySize] = getSize();
  if (x > xSize || y > ySize) {
    circles.resize([Math.max(x, xSize), Math.max(y, ySize)]);
  }
  circles.subset(math.index(x, y), true);
}

canvas.addEventListener("click", event => {
  coords = relMouseCoords(event);
  x = parseInt(coords.x / scale);
  y = parseInt(coords.y / scale);
  console.log("[ " + x + ", " + y + "]");

  if (isSet(x, y)) {
    // Clicked on a circle
    if (!(isSet(x + 1, y) || isSet(x, y + 1))) {
      removeCircle(x, y);
      addCircle(x + 1, y);
      addCircle(x, y + 1);
      draw();
    }
  }
});
