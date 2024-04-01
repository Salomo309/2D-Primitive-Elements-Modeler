document.addEventListener("DOMContentLoaded", function(){
    var renderer = new Renderer("#canvas",document)

    console.log("Succedd")
    renderer.addShape(new Square(   1, 0,0, "14AAF5"))
    renderer.addShape(new Square(1, 0.5, 0, "EA7D70"))

})

