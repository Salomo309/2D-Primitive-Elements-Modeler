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
        this.vertices.vertices = this.sortVertexes()
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

    sortVertexes() {
        const vertices = this.vertices.vertices;
        const midPoint = this.uniform.midPoint;

        // Calculate angles between each vertex and the midpoint
        const angles = [];
        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            const dx = vertex.coor[0] - midPoint.coor[0];
            const dy = vertex.coor[1] - midPoint.coor[1];
            angles.push({ index: i, angle: Math.atan2(dy, dx) });
        }

        // Sort vertices based on angles
        angles.sort((a, b) => a.angle - b.angle);

        // Rearrange vertices based on sorted indices
        const sortedVertices = [];
        angles.forEach(angle => {
            sortedVertices.push(vertices[angle.index]);
        });

        // Update vertices with sorted order
        for (let i = 0; i < vertices.length; i++) {
            vertices[i] = sortedVertices[i];
        }

        return vertices;
    }


    // ** SPECIAL METHOD ** //
    /**
     * Adds a new vertex to the polygon at the specified position.
     * @param {Number} x - X-coordinate of the new vertex
     * @param {Number} y - Y-coordinate of the new vertex
     */
    addVertex(x, y) {
        const vertices = this.vertices.vertices;
        console.log(vertices)
        const numVertices = vertices.length / 2;

        // New MidPoint
        const midPoint = this.uniform.midPoint;
        const newMidX = (midPoint.coor[0] * numVertices + x) / (numVertices + 1);
        const newMidY = (midPoint.coor[1] * numVertices + y) / (numVertices + 1);

        // New point
        const newPoint = new Point([x, y], Color.fromHex(this.color));

        let minDistance = Number.POSITIVE_INFINITY;
        let nearestIndex = -1;

        for (let i = 0; i < vertices.length; i++) {
            const vertexX = vertices[i].coor[0];
            const vertexY = vertices[i].coor[1];
            const distance = Math.sqrt((x - vertexX) ** 2 + (y - vertexY) ** 2);

            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = i;
            }
        }

        let insertIndex = nearestIndex;
        if (nearestIndex === vertices.length - 2) {
            insertIndex += 2;
        } else {
            insertIndex += 2;
        }
        this.vertices.vertices.splice(insertIndex, 0, newPoint);
        console.log(this.vertices.vertices)

        this.numVertices++;
        this.updateIndices();
        this.uniform.midPoint.setCoordinates(newMidX, newMidY);
    }

    /**
     * Removes the last vertex from the polygon.
     */
    removeVertex(index) {
        const vertices = this.vertices.vertices;
        const numVertices = vertices.length;
        const midPoint = this.uniform.midPoint;

        if (numVertices <= 3) {
            console.error("Cannot remove vertex. Polygon must have at least 3 vertices.");
            return;
        }

        // Delete chosen vertex
        vertices.splice(index, 1);

        // Calculate new midpoint
        this.updateMidPoint()

        // Update number of vertices
        this.numVertices--;

        // Update indices
        this.updateIndices();
        console.log(this.vertices.vertices)
    }

    /**
     * Updates the indices array based on the current number of vertices.
     */
    updateIndices() {
        const indices = [];
        for (let i = 0; i < this.numVertices - 2; i++) {
            if (i === 0) {
                indices.push(0,i+1,i+2);
            } else if (i === 1) {
                indices.push(i, i+2, i+1);
            } else {
                indices.push(i, i+2, i+1);
            }
        }
        this.indices = indices;
    }

    /**
     * @override
     * @param {WebGLRenderingContext} gl
     */
    drawElements(gl) {
        gl.drawElements(gl.TRIANGLE_FAN, this.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }

    /**
     * Serialize the Polygon object.
     * @returns {Object} Serialized Polygon object.
     */
    serialize() {
        return {
            type: 'Polygon',
            vertices: this.vertices.vertices,
            color: this.color,
            points: this.vertices.vertices.map(point => ({
                coor: point.getVertex(),
                color: point.color.toHex().substring(1)
            }))
        };
    }

    static deserialize(data) {
        const vertices = data.points.map(pointData => pointData.coor).flat();
        return new Polygon(vertices, data.color);
    }
}
