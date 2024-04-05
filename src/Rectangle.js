
class Rectangle extends Shape2D{

    /**
     * @param {Number} width
     * @param {Number} height
     * @param {Number} x
     * @param {Number} y
     * @param {String} color
     */
    constructor(width, height, x, y, color){
        let offsetX = width/2
        let offsetY = height/2
        super(
            new Vertices(
                [
                    x-offsetX, y+offsetY,
                    x+offsetX, y+offsetY,
                    x+offsetX, y-offsetY,
                    x-offsetX, y-offsetY
                ],
                color
        ), 
            4,
            [0,1,2, 2,3,0],
            new Uniforms(new Point([x,y],color)))
            this.color = color
        
    }

    getWidth() {
        const vertices = this.vertices.vertices.map(point => point.getVertex()[0]);
        const minX = Math.min(...vertices);
        const maxX = Math.max(...vertices);
        return maxX - minX;
    }

    getHeight() {
        const vertices = this.vertices.vertices.map(point => point.getVertex()[1]);
        const minY = Math.min(...vertices);
        const maxY = Math.max(...vertices);
        return maxY - minY;
    }


    serialize() {
        return {
            type: 'Rectangle',
            width: this.getWidth(),
            height: this.getHeight(),
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
        return new Rectangle(data.width, data.height, data.x, data.y, data.color);
    }

}
