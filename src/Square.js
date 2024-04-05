class Square extends Shape2D{

    /**
     * @param {Number} size
     * @param {Number} x
     * @param {Number} y
     * @param {String} color
     */
    constructor(size, x, y, color){
        let offset = size/2
        super(
            new Vertices(
                [
                    x-offset, y+offset,
                    x+offset, y+offset,
                    x+offset, y-offset,
                    x-offset, y-offset
                ],
                color
        ), 
            4,
            [0,1,2, 2,3,0],
            new Uniforms(new Point([x,y],color)))
            this.color = color
        
    }
    /**
     * @override
     * @param {WebGLRenderingContext} gl
     * @param {ProgramInfo} program
     * @returns {None} 
     */
    draw(gl,program){
        
    }

    getSize() {
        const vertices = this.vertices.vertices.map(point => point.getVertex()[0]);
        const minX = Math.min(...vertices);
        const maxX = Math.max(...vertices);
        return maxX - minX;
    }

    serialize() {
        return {
            type: 'Square',
            size: this.getSize(),
            x: this.uniform.midPoint.coor[0],
            y: this.uniform.midPoint.coor[1],
            color: this.color,
            points: this.vertices.vertices.map(point => ({
                coor: point.getVertex(),
                color: point.color.toHex().substring(1)
            }))
        };
    }

    static deserialize(data) {
        return new Square(data.size, data.x, data.y, data.color);
    }
    
    /**
     * Method to resize the square to a new size
     * @param {Number} size - The new size of the square
     */
    resize(size) {
        let currentSize = this.getSize();
        let scaleFactor = size / currentSize;
        this.scale(scaleFactor);
    }
    
}