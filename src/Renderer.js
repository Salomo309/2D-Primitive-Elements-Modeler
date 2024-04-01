/**
 * To Do
 * Use ProgramInfo class in Renderer
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
        this.shapes = []
        this.gl = canvas.getContext("webgl");
        if(!this.gl){
            throw "No webgl"
        }
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
        this.program = this.createProgram(this.gl, vert_code, frag_code);
        this.gl.useProgram(this.program);
        
        

        this.positionAttrLoc = this.gl.getAttribLocation(this.program, "position");
        
        this.colorAttrLoc = this.gl.getAttribLocation(this.program, "color")
        
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
     * If want to use different program, seperate renderer and program
     * then, in this function
     * 
     * If you want to animate, seperate bind buffer and draw into 2 different fucntion
     * Kalau memang nggak butuh indices, nanti 
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
            


            this.gl.enableVertexAttribArray(this.positionAttrLoc);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
            this.gl.vertexAttribPointer(this.positionAttrLoc,2,this.gl.FLOAT, false, 0,0);
            

           
            

            // Color
            console.log(shape.getColors())
            this.gl.enableVertexAttribArray(this.colorAttrLoc);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
            this.gl.vertexAttribPointer(this.colorAttrLoc,3, this.gl.FLOAT,false,0,0);
            


            this.gl.drawElements(this.gl.TRIANGLES, shape.getIndices().length,this.gl.UNSIGNED_SHORT,0);

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
     * @param {ProgramInfo} programInfo
     */
    useProgram(program){
        this.gl.useProgram(programInfo.program)
    }

    /**
     * @param {Shape2D} shape
     * @returns {None}
     */
    addShape(shape){
        this.shapes.push(shape)
        this.draw()
    }

    

}



// /**
//  * If needed, we will move program info to be attached with each Shape2D
//  */
// class ProgramInfo{
//     constructor(gl, vertexCode, fragmentCode){
//         try{
//         var vertex = this.createShader(gl,gl.VERTEX_SHADER,vertexCode);
//         var fragment = this.createShader(gl,gl.FRAGMENT_SHADER,fragmentCode);
//         this.program = gl.createProgram();
//         gl.attachShader(program,vertex);
//         gl.attachShader(program, fragment);
//         gl.linkProgram(program);
//         if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
//             throw "Program Failed to initiate"
//         }
//         this.positionAttrLoc = this.gl.getAttribLocation(this.program, "position");
//         this.colorAttrLoc = this.gl.getAttribLocation(this.program, "color")
//         }
//         catch(e){
//             console.log(e);
//             gl.deleteProgram(program);
//             return null
//         }
//     }

//     createShader(gl, type, source){
//         try{
//         var shader = gl.createShader(type)
//         gl.shaderSource(shader, source);
//         gl.compileShader(shader);
//         if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
//             throw "Shader Failed to initiate"
//         }
//         return shader
//         }catch(e){
//             console.log(source)
//             console.log(e);
//             gl.deleteShader(e);
//             return null;
//         }
        
//     }
// }