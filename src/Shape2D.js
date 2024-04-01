


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
}

/**
 * Alternatively we dont need to define points for faster transformation
 * just array of number
 */
class Vertices{

    // /**
    //  * @param {Point[]} points
    //  */
    // constructor(points){
    //     this.vertices = points
    // }

    /**
     * @param {Number[]} vertices
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
    move(x, y){
        this.x += x
        this.y += y
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
    resize(scale, shape){

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
}
