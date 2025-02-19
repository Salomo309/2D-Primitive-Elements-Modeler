document.addEventListener("DOMContentLoaded", function () {
  var renderer = new Renderer("#canvas", document);
  hideAllSliders();

  const squareBtn = document.getElementById("square-btn");
  const lineBtn = document.getElementById("line-btn");
  const rectangleBtn = document.getElementById("rectangle-btn");
  const polygonBtn = document.getElementById("polygon-btn");
  const convexhullBtn = document.getElementById("convexhull-btn");
  const clearBtn = document.getElementById("clear-btn");
  const exportBtn = document.getElementById("export-btn");
  const importForm = document.getElementById("import-form");
  const fileInput = document.getElementById("file-input");

  exportBtn.addEventListener("click", function () {
    const modelData = gatherModelData();
    const jsonData = JSON.stringify(modelData, null, 2);
    const blob = new Blob([jsonData], { type: "text/plain" });

    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "draw.txt";
    document.body.appendChild(a);

    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  importForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileContent = e.target.result;
        try {
          const jsonData = JSON.parse(fileContent);
          recreateModel(jsonData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
    }
  });

  function gatherModelData() {
    const modelData = {
      shapes: [],
    };

    renderer.shapes.forEach((shape) => {
      const shapeData = {
        type: shape.constructor.name,
        id: shape.id,
        data: shape.serialize(),
      };
      modelData.shapes.push(shapeData);
    });

    return modelData;
  }

  function recreateModel(modelData) {
    renderer.clearCanvas();

    modelData.shapes.forEach((shapeData) => {
      let shape;
      switch (shapeData.type) {
        case "Line":
          shape = Line.deserialize(shapeData.data);
          break;
        case "Square":
          shape = Square.deserialize(shapeData.data);
          break;
        case "Rectangle":
          shape = Rectangle.deserialize(shapeData.data);
          break;
        case "Polygon":
          shape = Polygon.deserialize(shapeData.data);
          break;
      }

      renderer.addShape(shape);
      updateObjectDropdown(shape.id);

      shapeData.data.points.forEach((point, index) => {
        renderer.changePointColorShape(index, point.color, shape.id);
      });
    });
  }

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

  convexhullBtn.addEventListener("click", function () {
    const convexhull = new ConvexHull([-0.6, 0.8, 0.86, -0.5, -0.86, -0.5], "FFF000");
    renderer.addShape(convexhull);
    updateObjectDropdown(convexhull.id);
  });

  clearBtn.addEventListener("click", function () {
    renderer.clearCanvas();
    clearObjectDropdown();
    clearPointsDropdown();
  });

  function showSlider(sliderId) {
    document.getElementById(sliderId).classList.remove("hidden");
  }

  function hideAllSliders() {
    const sliderContainers = document.querySelectorAll(".slider-container");
    sliderContainers.forEach((container) => {
      if (!container.classList.contains("hidden")) {
        container.classList.add("hidden");
      }
    });
  }

  const lengthSlider = document.getElementById("length-slider");
  const sizeSlider = document.getElementById("size-slider");
  const widthSlider = document.getElementById("width-slider");
  const heightSlider = document.getElementById("height-slider");

  lengthSlider.addEventListener("input", function (event) {
    const length = parseFloat(event.target.value);
    console.log(length);
    const selectedObjectId = document.getElementById("objects-dropdown").value;
    const selectedShape = renderer.getShapeById(selectedObjectId);

    if (selectedShape instanceof Line) {
      selectedShape.changeLength(length);
      renderer.draw();
    }
  });

  sizeSlider.addEventListener("input", function (event) {
    const length = parseFloat(event.target.value);
    console.log(length);
    const selectedObjectId = document.getElementById("objects-dropdown").value;
    const selectedShape = renderer.getShapeById(selectedObjectId);

    if (selectedShape instanceof Square) {
      selectedShape.resize(length);
      renderer.draw();
    }
  });

  widthSlider.addEventListener("input", function (event) {
    const length = parseFloat(event.target.value);
    console.log(length);
    const selectedObjectId = document.getElementById("objects-dropdown").value;
    const selectedShape = renderer.getShapeById(selectedObjectId);

    if (selectedShape instanceof Rectangle) {
      selectedShape.changeWidth(length);
      renderer.draw();
    }
  });

  heightSlider.addEventListener("input", function (event) {
    const length = parseFloat(event.target.value);
    console.log(length);
    const selectedObjectId = document.getElementById("objects-dropdown").value;
    const selectedShape = renderer.getShapeById(selectedObjectId);

    if (selectedShape instanceof Rectangle) {
      selectedShape.changeHeight(length);
      renderer.draw();
    }
  });

  function updateObjectDropdown(id) {
    hideAllSliders();
    clearPointsDropdown();
    const dropdown = document.getElementById("objects-dropdown");
    const option = document.createElement("option");
    option.text = id;
    dropdown.insertBefore(option, dropdown.firstChild);
    dropdown.selectedIndex = 0;
    populatePointsDropdown(id);
    populateDeletePointsDropdown(id);

    const selectedShape = renderer.getShapeById(id);

    if (selectedShape instanceof Line) {
      showSlider("length-slider-container");
    } else if (selectedShape instanceof Square) {
      showSlider("size-slider-container");
    } else if (selectedShape instanceof Rectangle) {
      showSlider("width-height-slider-container");
    }
  }

  function clearObjectDropdown() {
    const dropdown = document.getElementById("objects-dropdown");
    dropdown.innerHTML = "";
  }

  function populatePointsDropdown(selectedObjectId) {
    const dropdown = document.getElementById("points-dropdown");
    dropdown.innerHTML = "";

    const selectedShape = renderer.getShapeById(selectedObjectId);
    if (selectedShape) {
      const vertices = selectedShape.getVertices().length / 2;
      for (let i = 0; i < vertices; i++) {
        const option = document.createElement("option");
        option.text = `Point ${i + 1}`;
        option.id = i;
        dropdown.appendChild(option);
      }
    }
    updateColorPicker();
  }

  function populateDeletePointsDropdown(selectedObjectId) {
    const dropdown = document.getElementById("delete-points-dropdown");
    dropdown.innerHTML = "";

    const selectedShape = renderer.getShapeById(selectedObjectId);
    if (selectedShape) {
      const vertices = selectedShape.getVertices().length / 2;
      for (let i = 0; i < vertices; i++) {
        const option = document.createElement("option");
        option.text = `Point ${i + 1}`;
        option.id = i;
        dropdown.appendChild(option);
      }
    }
  }

  function clearPointsDropdown() {
    const dropdown = document.getElementById("points-dropdown");
    dropdown.innerHTML = "";
  }

  // ----- TOOLS ------

  const objectDropdown = document.getElementById("objects-dropdown");
  const rotateBtn = document.getElementById("rotate-btn");
  const moveBtn = document.getElementById("move-btn");
  const scaleBtn = document.getElementById("scale-btn");
  const movePointBtn = document.getElementById("movepoint-btn");
  const colorPicker = document.getElementById("color-picker");
  const addPointBtn = document.getElementById("addpoint-btn");
  const delPointBtn = document.getElementById("deletepoint-btn");
  const pointsDropdown = document.getElementById("points-dropdown");

  objectDropdown.addEventListener("change", function (event) {
    hideAllSliders();

    const selectedShape = renderer.getShapeById(
      document.getElementById("objects-dropdown").value
    );

    if (selectedShape instanceof Line) {
      showSlider("length-slider-container");
    } else if (selectedShape instanceof Square) {
      showSlider("size-slider-container");
    } else if (selectedShape instanceof Rectangle) {
      showSlider("width-height-slider-container");
    }
    populatePointsDropdown(document.getElementById("objects-dropdown").value);
    populateDeletePointsDropdown(
      document.getElementById("objects-dropdown").value
    );
  });

  function updateColorPicker() {
    const dropdown = document.getElementById("points-dropdown");
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    const selectedPointIndex = selectedOption.id;
    const selectedObjectId = document.getElementById("objects-dropdown").value;
    const color = renderer.getPointColorShape(
      selectedObjectId,
      selectedPointIndex
    );
    const colorPicker = document.getElementById("color-picker");
    colorPicker.value = color;
  }

  pointsDropdown.addEventListener("change", function (event) {
    updateColorPicker();
  });

  colorPicker.addEventListener("input", function (event) {
    const selectedColor = event.target.value;
    console.log("Selected Color:", selectedColor);
    const selectedObjectId = document.getElementById("objects-dropdown").value;
    const selectedPointIndex =
      document.getElementById("points-dropdown").selectedIndex;

    if (selectedObjectId && selectedPointIndex >= 0) {
      renderer.changePointColorShape(
        selectedPointIndex,
        selectedColor.substring(1),
        selectedObjectId
      );
    }
  });

  delPointBtn.addEventListener("click", function () {
    deactivateAllButtons();
    delPointActive = true;

    const selectedObjectId = document.getElementById("objects-dropdown").value;
    const selectedPointIndex =
      document.getElementById("points-dropdown").selectedIndex;

    const selectedShape = renderer.getShapeById(selectedObjectId);
    const vertices = selectedShape.getVertices().length / 2;

    if (selectedObjectId && selectedPointIndex >= 0 && vertices > 3) {
      renderer.deletePoint(selectedPointIndex, selectedObjectId);
      populateDeletePointsDropdown(
        document.getElementById("objects-dropdown").value
      );
    } else {
      if (vertices <= 3) {
        alert("The number of points is less than or equal to 3.");
      } else {
        alert("Failed to Delete Point");
      }
    }
  });

  function deactivateAllButtons() {
    rotateActive = false;
    moveActive = false;
    scaleActive = false;
    movePointActive = false;
    addPointActive = false;
    delPointActive = false;
    rotateBtn.classList.remove("bg-green-700", "text-white");
    moveBtn.classList.remove("bg-green-700", "text-white");
    scaleBtn.classList.remove("bg-green-700", "text-white");
    movePointBtn.classList.remove("bg-green-700", "text-white");
    addPointBtn.classList.remove("bg-green-700", "text-white");
    delPointBtn.classList.remove("bg-green-700", "text-white");
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
    if (selectedShape) {
      renderer.scaleShape(
        deltaX,
        deltaY,
        lastMouseX,
        lastMouseY,
        selectedObjectId
      );
    } else {
      return;
    }
  }

  function callAddPointOperation(lastMouseX, lastMouseY, selectedObjectId) {
    const selectedShape = renderer.getShapeById(selectedObjectId);
    if (selectedShape) {
      renderer.addPoint(lastMouseX, lastMouseY, selectedObjectId);
    } else {
      return;
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

  movePointBtn.addEventListener("click", function () {
    deactivateAllButtons();
    movePointActive = true;
    movePointBtn.classList.add("bg-green-700", "text-white");
  });

  addPointBtn.addEventListener("click", function () {
    deactivateAllButtons();
    addPointActive = true;
    addPointBtn.classList.add("bg-green-700", "text-white");
  });

  let mouseDown = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  const rotateSpeed = 0.0005;
  const moveSpeed = 0.005;
  const scaleSpeed = 5;

  let rotateActive = false;
  let moveActive = false;
  let scaleActive = false;
  let addPointActive = false;
  let delPointActive = false;
  let movePointActive = false;

  renderer.canvas.addEventListener("mousedown", function (event) {
    if (
      rotateActive ||
      moveActive ||
      scaleActive ||
      addPointActive ||
      delPointActive ||
      movePointActive
    ) {
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
      console.log(event.clientX);
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

  renderer.canvas.addEventListener("click", function (event) {
    if (addPointActive) {
      const rect = renderer.canvas.getBoundingClientRect();
      const canvasWidth = renderer.canvas.width;
      const canvasHeight = renderer.canvas.height;

      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const clipX = (mouseX / canvasWidth) * 2 - 1;
      const clipY = ((canvasHeight - mouseY) / canvasHeight) * 2 - 1;

      console.log("Clip X:", clipX);
      console.log("Clip Y:", clipY);

      callAddPointOperation(clipX, clipY, objectDropdown.value);
      populateDeletePointsDropdown(
        document.getElementById("objects-dropdown").value
      );
      populatePointsDropdown(
        document.getElementById("objects-dropdown").value
      );
    }
  });

  renderer.canvas.addEventListener("mouseup", function () {
    mouseDown = false;
  });
});
