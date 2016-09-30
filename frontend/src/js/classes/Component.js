class Component {
    constructor(width, height, color, x, y) {
        this.color = color;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.x = x;
        this.y = y;
    }


    /**
     * Re-render component
     */
    update() {
        var ctx =blocks.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (!isNaN(parseInt(this.score)))
            this.scoreEl.innerText = this.score;
    }



    /**
     * Set new position to element (according to speed)
     * Calculates with walking through borders
     * @param rand: boolean; If position should be set randomly or not.
     */
    newPos(rand=false) {
        if (rand)
            return this.setPos(
                Math.floor(Math.random() * (blocks.canvas.width - this.width)),
                Math.floor(Math.random() * (blocks.canvas.height - this.height))
            );

        if (this.x < 0-this.width) // component is too left
            this.x = blocks.canvas.width;
        else if (this.x > blocks.canvas.width) // component is too right
            this.x = 0-this.width;
        else // component is fine
            this.x += this.speedX;

        if (this.y < 0-this.height) // component is too top
            this.y = blocks.canvas.height;
        else if (this.y >blocks.canvas.height) // component is too bottom
            this.y = 0-this.height;
        else // component is fine
            this.y += this.speedY;
    }



    /**
     * Return if two components are touching
     * @param obj: instance of second Component
     * @return boolean
     */
    crashWith(obj) {
        var left1 = this.x, right1 = this.x + (this.width), top1 = this.y, bottom1 = this.y + (this.height),
            left2 = obj.x, right2 = obj.x + (obj.width), top2 = obj.y, bottom2 = obj.y + (obj.height),
            crash = true;
        if ((bottom1 < top2) ||
            (top1 > bottom2) ||
            (right1 < left2) ||
            (left1 > right2)) {
            crash = false;
        }
        return crash;
    }



    /**
     * Set X and Y position of element
     * @param x: integer
     * @param y: integer
     */
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
}
