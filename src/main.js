document.addEventListener("DOMContentLoaded", function () {
  var renderer = new Renderer("#canvas", document);
  console.log("Succedd");

  const squareBtn = document.getElementById("square-btn");
  const lineBtn = document.getElementById("line-btn");
  const rectangleBtn = document.getElementById("rectangle-btn");
  const polygonBtn = document.getElementById("polygon-btn");
  const clearBtn = document.getElementById("clear-btn");

  lineBtn.addEventListener("click", function () {
    const line = new Line(0, 0, 0.8, 0.5, "FFFFFF");
    renderer.addShape(line);
    updateObjectDropdown(line.id);
  });

  squareBtn.addEventListener("click", function () {
    const square = new Square(1, 0, 0, "0000FF");
    renderer.addShape(square);
    updateObjectDropdown(square.id);
  });

  rectangleBtn.addEventListener("click", function () {
    const rectangle = new Rectangle(1.5, 1, 0, 0, "00FF00");
    renderer.addShape(rectangle);
    updateObjectDropdown(rectangle.id);
  });

  polygonBtn.addEventListener("click", function () {
    const polygon = new Polygon([0, 1, 0.86, -0.5, -0.86, -0.5], "FF0000");
    renderer.addShape(polygon);
    updateObjectDropdown(polygon.id);
  });

  clearBtn.addEventListener("click", function () {
    renderer.clearCanvas();
    clearObjectDropdown();
  });

  function updateObjectDropdown(id) {
    const dropdown = document.getElementById("objects-dropdown");
    const option = document.createElement("option");
    option.text = id;
    dropdown.insertBefore(option, dropdown.firstChild);
    dropdown.selectedIndex = 0;
  }

  function clearObjectDropdown() {
    const dropdown = document.getElementById("objects-dropdown");
    dropdown.innerHTML = "";
  }

  // ----- TOOLS ------

  const objectDropdown = document.getElementById("objects-dropdown");
  const rotateBtn = document.getElementById("rotate-btn");
  const moveBtn = document.getElementById("move-btn");
  const scaleBtn = document.getElementById("scale-btn");

  function deactivateAllButtons() {
    rotateActive = false;
    moveActive = false;
    scaleActive = false;
    rotateBtn.classList.remove("bg-green-700", "text-white");
    moveBtn.classList.remove("bg-green-700", "text-white");
    scaleBtn.classList.remove("bg-green-700", "text-white");
  }

  function callRotateOperation(deltaX, deltaY, selectedObjectId) {
    const selectedShape = renderer.getShapeById(selectedObjectId);
    if (selectedShape) {
      const angle = Math.atan2(deltaY, deltaX);
      const angleDegrees = angle * (180 / Math.PI) * rotateSpeed;
      renderer.rotateShape(angleDegrees, selectedObjectId);
    } else {
      return;
    }
  }

  function callTranslateOperation(deltaX, deltaY, selectedObjectId) {
    const selectedShape = renderer.getShapeById(selectedObjectId);
    if (selectedShape) {
      renderer.translateShape(deltaX, deltaY, selectedObjectId);
    } else {
      return;
    }
  }

  function callScaleOperation(
    deltaX,
    deltaY,
    lastMouseX,
    lastMouseY,
    selectedObjectId
  ) {
    const selectedShape = renderer.getShapeById(selectedObjectId);
    if (selectedShape instanceof Rectangle) {

      renderer.scaleRectangle(deltaX,deltaY,lastMouseX,lastMouseY,selectedObjectId)
    } else {
      if(selectedShape){
        renderer.scaleShape(
          deltaX,
          deltaY,
          lastMouseX,
          lastMouseY,
          selectedObjectId
        );
      }else{
        return
      }
    }
  }

  rotateBtn.addEventListener("click", function () {
    deactivateAllButtons();
    rotateActive = true;
    rotateBtn.classList.add("bg-green-700", "text-white");
  });

  moveBtn.addEventListener("click", function () {
    deactivateAllButtons();
    moveActive = true;
    moveBtn.classList.add("bg-green-700", "text-white");
  });

  scaleBtn.addEventListener("click", function () {
    deactivateAllButtons();
    scaleActive = true;
    scaleBtn.classList.add("bg-green-700", "text-white");
  });

  let mouseDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  const rotateSpeed = 0.05;
  const moveSpeed = 0.005;
  const scaleSpeed = 5;

  let rotateActive = false;
  let moveActive = false;
  let scaleActive = false;

  renderer.canvas.addEventListener("mousedown", function (event) {
    if (rotateActive || moveActive || scaleActive) {
      mouseDown = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    }
  });

  renderer.canvas.addEventListener("mousemove", function (event) {
    if (rotateActive && mouseDown) {
      const deltaX = (event.clientX - lastMouseX) * -1;
      const deltaY = (event.clientY - lastMouseY) * -1;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      callRotateOperation(deltaX, deltaY, objectDropdown.value);
    } else if (moveActive && mouseDown) {
      const deltaX = (event.clientX - lastMouseX) * moveSpeed;
      const deltaY = (event.clientY - lastMouseY) * moveSpeed * -1;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      callTranslateOperation(deltaX, deltaY, objectDropdown.value);
    } else if (scaleActive && mouseDown) {
      const deltaX = (event.clientX - lastMouseX) * scaleSpeed;
      const deltaY = (event.clientY - lastMouseY) * scaleSpeed;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      callScaleOperation(
        deltaX,
        deltaY,
        lastMouseX,
        lastMouseY,
        objectDropdown.value
      );
    }
  });

  renderer.canvas.addEventListener("mouseup", function () {
    mouseDown = false;
  });
});
