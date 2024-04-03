document.addEventListener("DOMContentLoaded", function () {
  var renderer = new Renderer("#canvas", document);
  console.log("Succedd");

  const squareBtn = document.getElementById("square-btn");
  const lineBtn = document.getElementById("line-btn");
  const rectangleBtn = document.getElementById("rectangle-btn");
  const polygonBtn = document.getElementById("polygon-btn");
  const clearBtn = document.getElementById("clear-btn");

  lineBtn.addEventListener("click", function () {
    renderer.addShape(new Line(0, 0, 0.8, 0.5, "FFFFFF"));
  });

  squareBtn.addEventListener("click", function () {
    renderer.addShape(new Square(1, 0, 0, "0000FF"));
  });

  rectangleBtn.addEventListener("click", function () {
    renderer.addShape(new Rectangle(1.5, 1, 0.1, 0, "00FF00"));
  });

  polygonBtn.addEventListener("click", function () {
    renderer.addShape(new Polygon([0, 1, 0.86, -0.5, -0.86, -0.5], "FF0000"));
  });

  clearBtn.addEventListener("click", function () {
    renderer.clearCanvas();
  });

  // ----- TOOLS ------

  const rotateBtn = document.getElementById("rotate-btn");
  let rotateActive = false;

  rotateBtn.addEventListener("click", function () {
    rotateActive = !rotateActive;
    rotateBtn.classList.toggle("active", rotateActive);
  });

  let mouseDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  renderer.canvas.addEventListener("mousedown", function (event) {
    if (rotateActive) {
      mouseDown = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    }
  });

  renderer.canvas.addEventListener("mousemove", function (event) {
    if (rotateActive && mouseDown) {
      const deltaX = event.clientX - lastMouseX;
      const deltaY = event.clientY - lastMouseY;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      renderer.rotatePolygon(deltaX, deltaY);
    }
  });

  renderer.canvas.addEventListener("mouseup", function () {
    mouseDown = false;
  });
});
