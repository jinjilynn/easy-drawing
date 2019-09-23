class SCircle {
    constructor(context, x, y, radius, color, mouseClick, mouseOver) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color || 'yellow';
        this.context = context;
        this.click = mouseClick;
        this.over = mouseOver;
        this.reover = 0;
        this.GENAME = 'circle'
    }
    createPath() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    }
    createLPath() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius * 1.5, 0, Math.PI * 2);
    }
    createCleanPath(){
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
    }
    fillSPath(color) {
        this.context.save();
        this.context.fillStyle = color || this.color;
        this.context.fill();
        this.context.restore();
    }
    fillLPath(color) {
        this.context.save();
        this.context.globalAlpha = 0.4;
        this.context.fillStyle = color || this.color;
        this.context.fill();
        this.context.restore();
    }
    fill(color){
        this.createLPath();
        this.fillLPath(color);
        this.createPath();
        this.fillSPath(color);
    }
    clear(){
        this.createCleanPath();
        this.context.save();
        this.context.clip();
        this.context.clearRect(-this.context.canvas.width / 2, -this.context.canvas.height / 2, this.context.canvas.width, this.context.canvas.height);
        this.context.restore();
    }
}

export default SCircle;