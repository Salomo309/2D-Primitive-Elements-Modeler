class ConvexHull extends Shape2D {
    /**
     * @param {Number[]} vertices - Array of vertex coordinates
     * @param {String} color - Color of the convex hull in hexadecimal format
     */
    constructor(vertices, color) {
        // Panggil super constructor terlebih dahulu
        super([], 0, [], new Uniforms(new Point([0, 0]), color));

        this.color = color

        // Hitung convex hull menggunakan algoritma Graham's Scan
        const convexHullVertices = this.grahamScan(vertices);

        // Hitung midpoint
        let totalX = 0;
        let totalY = 0;
        for (let i = 0; i < convexHullVertices.length; i += 2) {
            totalX += convexHullVertices[i];
            totalY += convexHullVertices[i + 1];
        }
        const midX = totalX / (convexHullVertices.length / 2);
        const midY = totalY / (convexHullVertices.length / 2);
        const midPoint = new Point([midX, midY], color);

        // Hitung indices
        const numVertices = convexHullVertices.length / 2;
        const indices = [];
        for (let i = 0; i < numVertices; i++) {
            indices.push(i, (i + 1) % numVertices);
        }

        // Atur properti ConvexHull
        this.indices = indices;
        this.vertices = new Vertices(convexHullVertices, color);
        console.log(this.vertices)
        this.numVertices = numVertices;
        this.uniform.midPoint = midPoint;
        this.pivot = new Point([0.0, 0.0], color)
    }

    /**
     * Implement Graham's Scan algorithm to find convex hull
     * @param {Number[]} vertices - Array of vertex coordinates
     * @returns {Number[]} - Array of vertex coordinates representing the convex hull
     */
    grahamScan(vertices) {
        vertices = new Vertices(vertices, this.color);

        // Helper function to calculate orientation
        const orientation = (p, q, r) => {
            const val = (q.coor[1] - p.coor[1]) * (r.coor[0] - q.coor[0]) - (q.coor[0] - p.coor[0]) * (r.coor[1] - q.coor[1]);
            if (val === 0) return 0; // Collinear
            return (val > 0) ? 1 : 2; // Clockwise or Counterclockwise
        };

        // Helper function to compare polar angles of points
        const comparePolarAngles = (p1, p2) => {
            const o = orientation(this.pivot, p1, p2);
            if (o === 0) {
                // If two points make the same angle with the first point,
                // then put the nearest point first
                return (this.distance(this.pivot, p1) < this.distance(this.pivot, p2)) ? -1 : 1;
            }
            return (o === 2) ? -1 : 1;
        };

        const points = vertices.vertices;

        // Find the bottommost point (pivot)
        let minY = Infinity;
        let pivotIndex = -1;
        for (let i = 0; i < points.length; i++) {
            if (points[i].coor[1] < minY) {
                minY = points[i].coor[1];
                pivotIndex = i;
            } else if (points[i].coor[1] === minY && points[i].coor[0] < points[pivotIndex].coor[0]) {
                minY = points[i].coor[0];
                pivotIndex = i;
            }
        }
        this.pivot = points.splice(pivotIndex, 2)[0];

        // Sort the remaining points based on polar angle from pivot
        points.sort(comparePolarAngles);

        // Initialize stack for convex hull
        const stack = [this.pivot];

        // Perform Graham's Scan
        for (let i = 0; i < points.length; i++) {
            while (stack.length > 1 && orientation(stack[stack.length - 2], stack[stack.length - 1], points[i]) !== 2) {
                stack.pop();
            }
            stack.push(points[i]);
        }

        const convexHullVertices = []
        for (let i = 0; i < stack.length; i++) {
            convexHullVertices.push(stack[i].coor[0], stack[i].coor[1])
        }
        return convexHullVertices;
    }

    /**
     * Calculate Euclidean distance between two points
     * @param {Number[]} p1 - Coordinates of point 1 [x1, y1]
     * @param {Number[]} p2 - Coordinates of point 2 [x2, y2]
     * @returns {Number} - Euclidean distance between the points
     */
    distance(p1, p2) {
        const dx = p2.coor[0] - p1.coor[0];
        const dy = p2.coor[1] - p1.coor[1];
        return Math.sqrt(dx * dx + dy * dy);
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
        const vertices = this.vertices.vertices;
        const numVertices = vertices.length / 2;

        // New MidPoint
        const midPoint = this.uniform.midPoint;
        const newMidX = (midPoint.coor[0] * numVertices + x) / (numVertices + 1);
        const newMidY = (midPoint.coor[1] * numVertices + y) / (numVertices + 1);

        // New point
        const newPoint = new Point([x, y], Color.fromHex(this.color));

        // Nearest 2-Point (cari 2 point terdekat)
        let minDistance = Number.POSITIVE_INFINITY;
        let nearestIndex = -1;

        for (let i = 0; i < vertices.length; i += 2) {
            const vertexX = vertices[i].getVertex()[0];
            const vertexY = vertices[i].getVertex()[1];
            const distance = Math.sqrt((x - vertexX) ** 2 + (y - vertexY) ** 2);

            if (distance < minDistance) {
                minDistance = distance;
                nearestIndex = i;
            }
        }

        // Insert New Point
        vertices.splice(nearestIndex, 0, newPoint);

        this.numVertices++;
        this.updateIndices();
        this.uniform.midPoint.setCoordinates(newMidX, newMidY);
        // this.rotate(newMidX, newMidY, 10);
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
        gl.drawElements(gl.TRIANGLE_FAN, this.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }
}
