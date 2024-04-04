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

    rotateByMouse(deltaX, deltaY) {
        const pivotX = this.uniform.midPoint.coor[0];
        const pivotY = this.uniform.midPoint.coor[1];
        
        // Calculate initial mouse position relative to pivot
        const initialMouseX = lastMouseX - pivotX;
        const initialMouseY = lastMouseY - pivotY;
        
        // Calculate current mouse position relative to pivot
        const currentMouseX = lastMouseX + deltaX - pivotX;
        const currentMouseY = lastMouseY + deltaY - pivotY;
        
        // Calculate initial angle
        const initialAngle = Math.atan2(initialMouseY, initialMouseX);
        
        // Calculate current angle
        const currentAngle = Math.atan2(currentMouseY, currentMouseX);
        
        // Calculate the angle of rotation
        let angle = currentAngle - initialAngle;
        
        // Normalize the angle to be between -π and π
        if (angle > Math.PI) {
            angle -= 2 * Math.PI;
        } else if (angle < -Math.PI) {
            angle += 2 * Math.PI;
        }
        
        this.rotate(pivotX, pivotY, angle);
        
        lastMouseX += deltaX;
        lastMouseY += deltaY;
    }

    /**
     * Scales the polygon by the specified factor.
     * @param {Number} scale - Scaling factor
     */
    scale(scale) {
        const scaler = new Scaler();
        scaler.resize(scale, this);
    }

    scaleByMouse(deltaX, deltaY, lastMouseX, lastMouseY) {
        const pivotX = this.uniform.midPoint.coor[0];
        const pivotY = this.uniform.midPoint.coor[1];
    
        const initialDistance = Math.sqrt((lastMouseX - pivotX) ** 2 + (lastMouseY - pivotY) ** 2);
        const currentDistance = Math.sqrt((lastMouseX + deltaX - pivotX) ** 2 + (lastMouseY + deltaY - pivotY) ** 2);
        const scale = currentDistance / initialDistance;
        this.scale(scale);
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
        gl.drawElements(gl.TRIANGLES, this.getIndices().length, gl.UNSIGNED_SHORT, 0);
    }
}
