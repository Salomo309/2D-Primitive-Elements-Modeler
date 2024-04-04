
// /**
//  * Custom matmul for coordinate matriks
//  * It also reduce the need to transpose matrix twice
//  * @param {} mat1 size = 2x2
//  * @param {*} mat2 size = 2xn
//  * @param {*} n
//  * @param {*} m
//  * @returns {Number[]} size = 2xn
//  */
// function customMatMul(mat1, mat2, n){
//     let result = Array<Number>(n*2)

//     for(let j=0;j<n;j+=2){
//         result[j*2]=   mat1[0]*mat2[j] + mat1[1]*mat2[j+1]
//         result[j*2+1] =  mat1[2]*mat2[j] + mat1[3]*mat2[j+1]
//     }
//     return result
// }

class Shape2D{


    /**
     * @protected @param {Vertices} vertices
     * @param {Number} numVertices
     * @param {int[]} indices
     * @param {Uniforms} uniform
     * @returns {None}
     */
    constructor(vertices, numVertices,indices, uniform){
        this.numVertices = numVertices
        //Buffer
        this.vertices = vertices
        this.indices = indices
        this.uniform = uniform

    }
    getVertices(){
        return this.vertices.asArray()
    }
    getColors(){
        return this.vertices.asArrayColor();
    }
    getIndices(){
        return this.indices
    }

    /**
     * @deprecated
     * @abstract
     * @param {WebGLRenderingContext} gl
     * @param {ProgramInfo} program
     * @returns {None}
     */
    draw(gl,program){};


    drawElements(gl){
        gl.drawElements(gl.TRIANGLES, this.getIndices().length, gl.UNSIGNED_SHORT,0);
    }

    /**
     * @param {Number} deltaX - Amount of translation along the x-axis
     * @param {Number} deltaY - Amount of translation along the y-axis
     */
    translate(deltaX, deltaY) {
        const vertices = this.vertices.vertices;
        vertices.forEach(point => {
            point.setCoordinates(point.coor[0] + deltaX, point.coor[1] + deltaY);
            this.updateMidPoint()
        });
    }

    rotate(angle){
        const pivot = this.uniform.midPoint;
        console.log(pivot)
        const pivotX = this.uniform.midPoint.coor[0];
        const pivotY = this.uniform.midPoint.coor[1];
        const orientation = new Orientation();
        orientation.rotate(angle);

        const rotationMatrix = orientation.createMatrix();
        console.log(rotationMatrix)

        const vertices = this.vertices.vertices;
        for (let i = 0; i < vertices.length; i++) {
            const x = vertices[i].coor[0];
            const y = vertices[i].coor[1];

            const rotatedX = pivotX + (x - pivotX) * rotationMatrix[0] + (y - pivotY) * rotationMatrix[1];
            const rotatedY = pivotY + (x - pivotX) * rotationMatrix[2] + (y - pivotY) * rotationMatrix[3];

            vertices[i].setCoordinates(rotatedX, rotatedY);
        }

        this.uniform.rotation = orientation;
        this.uniform.midPoint = pivot
    }

    scale(scale) {
        const scaler = new Scaler();
        scaler.resize(scale, this);
        this.updateMidPoint()
    }

    scaleByMouse(deltaX, deltaY, lastMouseX, lastMouseY) {
        const pivotX = this.uniform.midPoint.coor[0];
        const pivotY = this.uniform.midPoint.coor[1];

        const initialDistance = Math.sqrt((lastMouseX - pivotX) ** 2 + (lastMouseY - pivotY) ** 2);
        const currentDistance = Math.sqrt((lastMouseX + deltaX - pivotX) ** 2 + (lastMouseY + deltaY - pivotY) ** 2);
        const scale = currentDistance / initialDistance;
        this.scale(scale);
    }

    changePointColor(pointIndex, newColorHex) {
        const vertices = this.vertices.vertices;

        if (pointIndex >= 0 && pointIndex < vertices.length) {
            vertices[pointIndex].color = Color.fromHex(newColorHex);
        } else {
            console.error("Point index out of range.");
        }
    }

    updateMidPoint() {
        let vertices = this.vertices.vertices;
        let totalX = 0;
        let totalY = 0;
        for (let i = 0; i < vertices.length; i += 2) {
            totalX += vertices[i].coor[0];
            totalY += vertices[i].coor[1];
        }
        const midX = totalX / (vertices.length / 2);
        const midY = totalY / (vertices.length / 2);
        this.uniform.midPoint.setCoordinates(midX, midY);
    }

}

/**
 * Alternatively we dont need to define points for faster transformation
 * just array of number
 */
class Vertices{
    /**
     * @param {Point[]} vertices
     * @param {String} hex
     */
    constructor(vertices, hex){
        this.vertices = []
        var color = Color.fromHex(hex)
        for(let i =0; i<vertices.length; i+=2){
            this.vertices.push(new Point([vertices[i], vertices[i+1]], color));
        }
    }


    /**
     * @returns {number[]}
     */
    asArray(){
        const vertexArray = [];
        this.vertices.forEach(point=>{
            vertexArray.push(...point.getVertex());
        })
        return vertexArray;
    }

    asArrayColor(){
        const colorArray = [];
        this.vertices.forEach(point=>{
            colorArray.push(...point.getColor())
        })
        return colorArray;
    }

    move(x, y){
        this.vertices.forEach(point =>{
            point.move(x,y)
        })
    }

    getPoint(i){
        return this.vertices[i]
    }


}

//Attribute
class Point{

    /**
     *
     * @param {[Number,Number]} coor
     * @param {Color} color
     */
    constructor(coor, color){
        this.coor = coor;
        this.color = color;
    }

    /**
     *
     * @returns {(Number, Number)}
     */
    getVertex(){
        return [this.coor[0], this.coor[1]]
    }

    getColor(){
        return this.color.asArray();
    }

    setCoordinates(x, y) {
        this.coor[0] = x;
        this.coor[1] = y;
    }

    move(x, y){
        this.x += x
        this.y += y
    }

    scale(scale){
        this.x *=scale
        this.y *=scale
    }

}


//Attribute
class Color{
    /**
     * @param {String} hex
     * @returns {Color}
     */
    static fromHex(hex)
    {
        var instance = new Color(0,0,0)
        instance.red = parseInt(hex.slice(0,2), 16)
        instance.green = parseInt(hex.slice(2,4), 16)
        instance.blue = parseInt(hex.slice(4,6), 16)
        instance.normalize()
        return instance
    }

    /**
     * @param {Number} red
     * @param {Number} green
     * @param {Number} blue
     * @returns {None}
     */
    constructor(red, green, blue){
        this.red = (red % 255)
        this.green = (green % 255)
        this.blue = (blue%255)
        this.normalize()
    }

    asArray(){
        return new Float32Array([this.red, this.green, this.blue])
    }

    normalize(){
        this.red/=255
        this.green/=255
        this.blue/=255
    }

    toHex() {
        let redHex = Math.round(this.red * 255).toString(16).padStart(2, '0');
        let greenHex = Math.round(this.green * 255).toString(16).padStart(2, '0');
        let blueHex = Math.round(this.blue * 255).toString(16).padStart(2, '0');
        return '#' + redHex + greenHex + blueHex;
    }

}

// Attribute
class Orientation{
    constructor(){
        this.degree = 0;
    }

    /**
     * @param {Number} degree
     */
    rotate(degree){
        this.degree = (this.degree+degree)%360;
    }

    createMatrix(){
        let angle = this.degree*Math.PI/180;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        return new Float32Array([
            cos, -sin,
            sin, cos
        ]);
    }
    createInverseMatrix(){
        let angle = this.degree*Math.PI/180;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        return new Float32Array([
            cos, sin,
            -sin, cos
        ]);
    }


}

// Transformer
class Scaler{

    constructor(){}

    /**
     * @param {Number} scale
     * @param {Shape2D} shape
     * @returns {None}
     */
    resize(scale, shape) {
        // Ambil semua titik dari objek shape
        const vertices = shape.vertices.vertices;

        // Iterasi melalui setiap titik dan sesuaikan koordinatnya dengan faktor penskalaan
        vertices.forEach(point => {
            const x = point.coor[0];
            const y = point.coor[1];

            // Terapkan faktor penskalaan pada setiap koordinat titik
            point.coor[0] = x * scale;
            point.coor[1] = y * scale;
        });
    }

}

//Attribute
class Shear{
    constructor(){

    }
}


/**
 * Namanya kalau ingin diubah yang lebih sesuai silahkan aja
 * Ini biar mudah dihafal aja.
 * Ini buat nyimpan data rotasi, posisi (midPoint), dan shear
 * Sisanya nggak disimpan
 */
class Uniforms{
    constructor(point){
        this.rotation = new Orientation()
        this.shear = new Shear()
        this.midPoint = point
    }

    rotate(degree){
        this.rotation.rotate(degree);
    }
}
