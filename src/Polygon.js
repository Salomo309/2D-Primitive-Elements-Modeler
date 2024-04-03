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
        const midPoint = new Point([midX, midY], color);

        super(
            new Vertices(vertices, color),
            vertices.length / 2,
            indices,
            new Uniforms(midPoint)
        );
        this.color = color
    }

    /**
     * Rotates the polygon around a pivot point by a specified angle.
     * @param {Number} pivotX - X-coordinate of the pivot point
     * @param {Number} pivotY - Y-coordinate of the pivot point
     * @param {Number} angle - Angle of rotation in degrees
     */
    rotate(pivotX, pivotY, angle) {
        const pivot = new Point([pivotX, pivotY], this.color);
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


    // ** SPECIAL METHOD ** //
    /**
     * Adds a new vertex to the polygon at the specified position.
     * @param {Number} x - X-coordinate of the new vertex
     * @param {Number} y - Y-coordinate of the new vertex
     */
    addVertex(x, y) {
        const midPoint = this.uniform.midPoint;
        const numVertices = this.vertices.vertices.length / 2;

        // // Coordinat otomatis
        // const lastVertex = this.vertices.vertices[this.vertices.vertices.length - 1].coor;
        // const firstVertex = this.vertices.vertices[0].coor;

        // let newX = (lastVertex[0] + firstVertex[0]) / 2;
        // let newY = (lastVertex[1] + firstVertex[1]) / 2;

        // if (newX < midPoint.coor[0]) {
        //     newX -= 0.1
        // } else {
        //     newX += 0.1
        // }

        // if (newY < midPoint.coor[1]) {
        //     newY -= 0.1
        // } else {
        //     newY += 0.1
        // }

        // const newMidX = (midPoint.coor[0] * numVertices + newX) / (numVertices + 1);
        // const newMidY = (midPoint.coor[1] * numVertices + newY) / (numVertices + 1);

        // Coordinat baru dari User

        const newMidX = (midPoint.coor[0] * numVertices + x) / (numVertices + 1);
        const newMidY = (midPoint.coor[1] * numVertices + y) / (numVertices + 1);

        // Update uniform
        this.uniform.midPoint.setCoordinates(newMidX, newMidY);

        // Add new vertex to vertices array
        const newPoint = new Point([x, y], Color.fromHex(this.color));
        // const newPoint = new Point([newX, newY], Color.fromHex(this.color));
        this.vertices.vertices.push(newPoint);


        console.log(this.vertices.vertices)

        // Update number of vertices
        this.numVertices++;

        // Update indices
        this.updateIndices();
        this.rotate(newMidX, newMidY, 10)
    }

    /**
     * Removes the last vertex from the polygon.
     */
    removeVertex() {
        const vertices = this.vertices;
        const numVertices = vertices.length / 2;
        const midPoint = this.uniform.midPoint;

        if (numVertices <= 3) {
            console.error("Cannot remove vertex. Polygon must have at least 3 vertices.");
            return;
        }

        // Calculate new midpoint
        const newMidX = (midPoint.coor[0] * numVertices - vertices[vertices.length - 2]) / (numVertices - 1);
        const newMidY = (midPoint.coor[1] * numVertices - vertices[vertices.length - 1]) / (numVertices - 1);

        // Update uniform
        this.uniform.midPoint.setCoordinates(newMidX, newMidY);

        // Remove last vertex from vertices array
        this.vertices.vertices.pop();

        // Update number of vertices
        this.numVertices--;

        // Update indices
        this.updateIndices();
    }

    /**
     * Updates the indices array based on the current number of vertices.
     */
    updateIndices() {
        console.log(this.indices)
        const indices = [];
        for (let i = 1; i < this.numVertices - 1; i++) {
            indices.push(0, i, i + 1);
        }
        this.indices = indices;
        console.log(this.indices)
    }

    /**
     * @override
     * @param {WebGLRenderingContext} gl
     */
    drawElements(gl) {
        gl.drawElements(gl.TRIANGLES, this.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }
}
