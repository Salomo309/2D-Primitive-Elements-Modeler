class Polygon extends Shape2D {
    /**
     * @param {Number[]} vertices - Array of vertex coordinates
     * @param {String} color - Color of the polygon in hexadecimal format
     */
    constructor(vertices, color) {
        // Calculate Indices
        const numVertices = vertices.length / 2;
        const indices = [];
        for (let i = 1; i < numVertices - 1; i++) {
            indices.push(0, i, i + 1);
        }

        // Calculate MidPoint
        let totalX = 0;
        let totalY = 0;
        for (let i = 0; i < vertices.length; i += 2) {
            totalX += vertices[i];
            totalY += vertices[i + 1];
        }
        const midX = totalX / (vertices.length / 2);
        const midY = totalY / (vertices.length / 2);
        const midPoint = new Point(midX, midY);

        super(
            new Vertices(vertices, color),
            vertices.length / 2,
            indices,
            new Uniforms(midPoint, color)
        );
    }

    /**
     * Rotates the polygon around a pivot point by a specified angle.
     * @param {Number} pivotX - X-coordinate of the pivot point
     * @param {Number} pivotY - Y-coordinate of the pivot point
     * @param {Number} angle - Angle of rotation in degrees
     */
    rotate(pivotX, pivotY, angle) {
        const pivot = new Point(pivotX, pivotY);
        const orientation = new Orientation();
        orientation.rotate(angle);

        const rotationMatrix = orientation.createMatrix();

        const vertices = this.vertices.vertices;
        for (let i = 0; i < vertices.length; i++) {
            const x = vertices[i].getVertex()[0];
            const y = vertices[i].getVertex()[1];

            const relativeX = x - pivotX;
            const relativeY = y - pivotY;

            const rotatedX = rotationMatrix[0] * relativeX + rotationMatrix[1] * relativeY;
            const rotatedY = rotationMatrix[2] * relativeX + rotationMatrix[3] * relativeY;

            vertices[i].setCoordinates(rotatedX + pivotX, rotatedY + pivotY);
        }

        this.uniform.rotation = orientation;
        this.uniform.midPoint = pivot;
    }

    /**
     * Translates the polygon by the specified amounts along the x and y axes.
     * @param {Number} deltaX - Amount of translation along the x-axis
     * @param {Number} deltaY - Amount of translation along the y-axis
     */
    translate(deltaX, deltaY) {
        const vertices = this.vertices.vertices;
        vertices.forEach(point => {
            point.setCoordinates(point.coor[0] + deltaX, point.coor[1] + deltaY);
        });
    }

    /**
     * Scales the polygon by the specified factor.
     * @param {Number} scale - Scaling factor
     */
    scale(scale) {
        const scaler = new Scaler();
        scaler.resize(scale, this);
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

    /**
     * @override
     * @param {WebGLRenderingContext} gl
     */
    drawElements(gl) {
        gl.drawElements(gl.TRIANGLES, this.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }
}
