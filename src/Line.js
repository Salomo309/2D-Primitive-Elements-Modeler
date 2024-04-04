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
}
