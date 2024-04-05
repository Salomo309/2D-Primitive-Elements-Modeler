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

    extendLength(extensionAmount) {
        let rotationAngle = this.uniform.rotation.degree;
        let radians = rotationAngle * Math.PI / 180;
        let cosTheta = Math.cos(radians);
        let sinTheta = Math.sin(radians);
    
        // For each vertex of the rectangle
        this.vertices.vertices.forEach(vertex => {
            let relativeX = vertex.coor[0] - this.uniform.midPoint.coor[0];
            let relativeY = vertex.coor[1] - this.uniform.midPoint.coor[1];
            let rotatedX = relativeX * cosTheta + relativeY * sinTheta;
            let rotatedY = -relativeX * sinTheta + relativeY * cosTheta;
    
            const offsetY = relativeY > 0 ? extensionAmount / 2 : -extensionAmount / 2;
            const offsetX = relativeX>0 ? extensionAmount/2 : -extensionAmount/2;
            const extendedY = rotatedY + offsetY;
            const extendedX = rotatedX+offsetX
            const newX = this.uniform.midPoint.coor[0] + extendedX * cosTheta - extendedY * sinTheta;
            const newY = this.uniform.midPoint.coor[1] + extendedX * sinTheta + extendedY * cosTheta;
    
            vertex.coor[0] = newX;
            vertex.coor[1] = newY;
        });
    }
}