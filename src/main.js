document.addEventListener("DOMContentLoaded", function () {
  var renderer = new Renderer("#canvas", document);
  console.log("Succedd");

  const squareBtn = document.getElementById("square-btn");
  const lineBtn = document.getElementById("line-btn");
  const rectangleBtn = document.getElementById("rectangle-btn");
  const polygonBtn = document.getElementById("polygon-btn");

  squareBtn.addEventListener("click", function () {
    renderer.addShape(new Square(1, 0, 0, "14AAF5"));
    // renderer.addShape(new Square(1, 0.5, 0, "EA7D70"));
  });
});
