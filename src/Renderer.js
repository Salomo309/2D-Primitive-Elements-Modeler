/**
 * @ppro
 */
class Renderer{

    /**
     *
     * @param {String} canvasId
     * @param {Document} document
     */
    constructor(canvasId, document){
        try{
        this.canvas = document.querySelector(canvasId)
        this.shapeCounter = 1;


        /**
         * Dari yang saya baca-baca sih, best practice nya ngelompokin
         * menjadi triplet
         * i. ShapeInfo
         * ii. BufferInfo
         * iii. ProgramInfo
         */
        this.shapes = []

        /**
         * @type {WebGLRenderingContext}
         */
        this.gl = canvas.getContext("webgl");
        if(!this.gl){
            throw "No webgl"
        }

        /*New*/
        /**
         * @type {ProgramInfo}
         */
        this.program = new ProgramInfo(this.gl)
        this.useProgram(this.program)



        this.positionBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        this.indexBuffer = this.gl.createBuffer();
        this.draw()
        }catch(e){
            console.log(e)
        }
    }

    /**
     * @function
     * Draw Array with only one program
     * If want to use different program, create buffer-program map
     * then, in this function
     *
     * If you want to animate, seperate bind buffer and draw into 2 different fucntion
     *
     */
    draw(){
        //reset
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.clearColor(0.5, 0.5, 0.5, 0.9);
        this.gl.clearDepth(1.0);
        this.gl.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        //Iterate all shape
        this.shapes.forEach(shape => {
            // Color
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(shape.getColors()), this.gl.STATIC_DRAW);

            //Vertex
            console.log(shape.getVertices())
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(shape.getVertices()), this.gl.STATIC_DRAW);


            //Indices
            console.log(shape.getIndices())
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.getIndices()), this.gl.STATIC_DRAW)



            this.gl.enableVertexAttribArray(this.program.positionAttrLoc);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.vertexAttribPointer(this.program.positionAttrLoc,2,this.gl.FLOAT, false, 0,0);





            // Color
            console.log(shape.getColors())
            this.gl.enableVertexAttribArray(this.program.colorAttrLoc);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.vertexAttribPointer(this.program.colorAttrLoc,3, this.gl.FLOAT,false,0,0);


            shape.drawElements(this.gl);


            // this.gl.drawArrays(this.gl.TRIANGLES, 0, shape.getVertices().length/2);
        });
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null);
    }

    createShader(gl, type, source){
        try{
        var shader = gl.createShader(type)
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            throw "Shader Failed to initiate"
        }
        return shader
        }catch(e){
            console.log(source)
            console.log(e);
            gl.deleteShader(e);
            return null;
        }

    }

    createProgram(gl, vertexCode, fragmentCode){
        try{
        var vertex = this.createShader(gl,gl.VERTEX_SHADER,vertexCode);
        var fragment = this.createShader(gl,gl.FRAGMENT_SHADER,fragmentCode);
        var program = gl.createProgram();
        gl.attachShader(program,vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            throw "Program Failed to initiate"
        }
        return program
        }
        catch(e){
            console.log(e);
            gl.deleteProgram(program);
            return null
        }
    }

    /**
     * @param {ProgramInfo} program
     */
    useProgram(program){
        this.gl.useProgram(program.program)
    }

    /**
     * @param {Shape2D} shape
     * @returns {None}
     */
    addShape(shape){
        shape.id = `${shape.constructor.name.toLowerCase()}${this.shapeCounter}`;
        this.shapeCounter++;
        this.shapes.push(shape)
        this.draw()
    }

    clearCanvas() {
        this.shapes = [];
        this.draw();
    }

    getShapeById(id) {
        return this.shapes.find(shape => shape.id === id);
    }

    rotateShape(angle, selectedObjectId) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape) {
            const midPoint = shape.uniform.midPoint;
            shape.rotate(angle);
            this.draw();
        }
    }

    translateShape(deltaX, deltaY, selectedObjectId) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape) {
            shape.translate(deltaX, deltaY);
            this.draw();
        }
    }

    scaleShape(deltaX, deltaY, lastMouseX, lastMouseY, selectedObjectId) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape) {
            shape.scaleByMouse(deltaX, deltaY, lastMouseX, lastMouseY);
            this.draw();
        }
    }

    changePointColorShape(pointIndex, newColorHex, selectedObjectId) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape) {
            shape.changePointColor(pointIndex, newColorHex);
            this.draw();
        }
    }

    getPointColorShape(selectedObjectId, selectedPointIndex) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape) {
            return shape.vertices.vertices[selectedPointIndex].color.toHex();
        }
    }

    addPoint(newPointX, newPointY, selectedObjectId) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape instanceof Polygon || shape instanceof ConvexHull) {
            shape.addVertex(newPointX, newPointY);
            this.draw();
        }
    }

    deletePoint(pointIndex, selectedObjectId) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape instanceof Polygon || shape instanceof ConvexHull) {
            shape.removeVertex(pointIndex)
            this.draw();
        }
    }

    movePoint(newX, newY, pointIndex, selectedObjectId) {
        const shape = this.shapes.find(shape => shape.id === selectedObjectId);
        if (shape instanceof Line) {
            shape.movePoint(newX, newY, pointIndex);
            this.draw();
        }
    }    
}



/**
 * If needed, we will move program info to be attached with each Shape2D
 */
class ProgramInfo{

    /**
     *
     * @param {WebGLRenderingContext} gl
     * @returns
     */
    constructor(gl){
        const vert_code =
        `
        attribute vec2 position;
        attribute vec3 color;
        varying vec3 vColor;

        void main() {
            gl_Position = vec4(position,1,1);
            vColor = color;
        }
        `
        const frag_code =
        `
        precision mediump float;
        varying vec3 vColor;

        void main() {
            gl_FragColor = vec4(vColor,1.0);
        }
        `
        try{
        var vertex = this.createShader(gl,gl.VERTEX_SHADER,vert_code);
        var fragment = this.createShader(gl,gl.FRAGMENT_SHADER,frag_code);

        /**
         * @type {WebGLProgram}
         */
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertex);
        gl.attachShader(this.program, fragment);
        gl.linkProgram(this.program);
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
            throw "Program Failed to initiate"
        }
        this.positionAttrLoc = gl.getAttribLocation(this.program, "position");
        this.colorAttrLoc = gl.getAttribLocation(this.program, "color")
        }
        catch(e){
            console.log(e);
            gl.deleteProgram(this.program);
            return null
        }
    }

    createShader(gl, type, source){
        try{
        var shader = gl.createShader(type)
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            throw "Shader Failed to initiate"
        }
        return shader
        }catch(e){
            console.log(source)
            console.log(e);
            gl.deleteShader(e);
            return null;
        }

    }
}
