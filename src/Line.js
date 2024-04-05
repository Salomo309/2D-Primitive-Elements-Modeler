class Line extends Shape2D {
    /**
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {String} color
     */
    constructor(x1, y1, x2, y2, color) {
        const midPoint = new Point([(x1 + x2) / 2, (y1 + y2) / 2], Color.fromHex(color));


        super(
            new Vertices(
                [
                    x1, y1,
                    x2, y2
                ],
                color
            ),
            2,
            [0, 1],
            new Uniforms(midPoint, color)
        );
        this.color = color
    }

    /**
     * Move a single point in the line to a new position.
     * @param {Number} newX - New x-coordinate for the point
     * @param {Number} newY - New y-coordinate for the point
     * @param {Number} pointIndex - Index of the point to move (0 or 1)
     */
    movePoint(newX, newY, pointIndex) {
        if (pointIndex < 0 || pointIndex > 1) {
            console.error("Point index must be 0 or 1.");
            return;
        }
    
        const vertices = this.vertices.vertices;
        vertices[pointIndex].setCoordinates(newX, newY);
        this.updateMidPoint();
    }    

    /**
     * Shears the polygon along the x or y axis by the specified factors.
     * @param {Number} shearX - Shear factor along the x-axis
     * @param {Number} shearY - Shear factor along the y-axis
     */
    shear(shearX, shearY) {
        const vertices = this.vertices.vertices;
        vertices.forEach(point => {
            const x = point.getVertex()[0];
            const y = point.getVertex()[1];
            point.setCoordinates(x + shearX * y, y + shearY * x);
        });
    }

    // ** SPECIAL METHOD ** //
    /**
     * Changes the length of the line by scaling it uniformly.
     * @param {Number} length - New length of the line
     */
    changeLength(length) {
        console.log(this.vertices.vertices)
        const currentLength = Math.sqrt(Math.pow(this.vertices.vertices[1].getVertex()[0] - this.vertices.vertices[0].getVertex()[0], 2) +
            Math.pow(this.vertices.vertices[1].getVertex()[1] - this.vertices.vertices[0].getVertex()[1], 2));
        const scale = length / currentLength;
        this.scale(scale);
    }

    /**
     * @override
     * @param {WebGLRenderingContext} gl
     */
    drawElements(gl) {
        gl.drawArrays(gl.LINES, 0, 2);
    }

    serialize() {
        return {
            type: 'Line',
            points: this.vertices.vertices.map(point => ({
                coor: point.getVertex(),
                color: point.color.toHex().substring(1)
            }))
        };
    }

    static deserialize(data) {
        const points = data.points.map(pointData => new Point(pointData.coor, Color.fromHex(pointData.color)));
        return new Line(points[0].getVertex()[0], points[0].getVertex()[1], points[1].getVertex()[0], points[1].getVertex()[1], data.points[0].color);
    }

    /**
     * @override
     */
    updateMidPoint() {
        const x1 = this.vertices.vertices[0].coor[0]
        const x2 = this.vertices.vertices[1].coor[0]
        const y1 = this.vertices.vertices[0].coor[1]
        const y2 = this.vertices.vertices[1].coor[1]
        this.uniform.midPoint = new Point([(x1 + x2) / 2, (y1 + y2) / 2], Color.fromHex(this.color));
    }
}
