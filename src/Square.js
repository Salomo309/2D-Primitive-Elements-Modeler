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
            new Uniforms(new Point(x,y), color))
        
    }
}