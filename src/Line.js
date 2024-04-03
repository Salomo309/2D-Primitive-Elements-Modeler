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
     * Rotasi garis berdasarkan titik pivot dan sudut rotasi (dalam derajat).
     * @param {Number} pivotX - Koordinat x titik pivot.
     * @param {Number} pivotY - Koordinat y titik pivot.
     * @param {Number} angle - Sudut rotasi (dalam derajat).
     */
    rotate(pivotX, pivotY, angle) {
        // Pivot Point
        const pivot = new Point([pivotX, pivotY], Color.fromHex(this.color));

        // Orientation, then Rotate
        const orientation = new Orientation();
        orientation.rotate(angle);

        // Matrix Rotation
        const rotationMatrix = orientation.createMatrix();

        // Rotate every point
        const vertices = this.vertices.vertices;
        for (let i = 0; i < vertices.length; i++) {
            const x = vertices[i].getVertex()[0];
            const y = vertices[i].getVertex()[1];


            // Koordinat Relatif terhadap Pivot
            const relativeX = x - pivotX;
            const relativeY = y - pivotY;

            // Matriks rotasi dikalikan ke relatif
            const rotatedX = rotationMatrix[0] * relativeX + rotationMatrix[1] * relativeY;
            const rotatedY = rotationMatrix[2] * relativeX + rotationMatrix[3] * relativeY;

            vertices[i].setCoordinates(rotatedX + pivotX, rotatedY + pivotY)
        }

        this.uniform.rotation = orientation;
        this.uniform.midPoint = pivot;
    }

    /**
     * Penskalaan garis berdasarkan faktor penskalaan untuk sumbu x dan y.
     * @param {Number} scaleX - Faktor penskalaan untuk sumbu x.
     * @param {Number} scaleY - Faktor penskalaan untuk sumbu y.
     */
    scale(scale) {
        const scaler = new Scaler();
        scaler.resize(scale, this);
    }

    /**
     * Translasi garis berdasarkan pergeseran pada sumbu x dan y.
     * @param {Number} deltaX - Pergeseran (translasi) pada sumbu x.
     * @param {Number} deltaY - Pergeseran (translasi) pada sumbu y.
     */
    translate(deltaX, deltaY) {
        const vertices = this.vertices.vertices;

        vertices.forEach(point => {
            point.setCoordinates(point.coor[0] + deltaX, point.coor[1] + deltaY);
        });
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
