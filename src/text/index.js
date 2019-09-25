class Text {
    constructor(text, context, x, y, color, size) {
        this.text = text || '';
        this.size = size || '12px';
        this.x = x;
        this.y = y;
        this.color = color || '#fff';
        this.context = context;
        this.reover = 0;
        this.GENAME = 'text'
    }
    fillText() {
        this.context.save();
        this.context.font = `${this.size} 微软雅黑`;
        this.context.fillStyle = this.color;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(this.text, this.x, this.y);
        this.context.restore();
    }
    clearText() {
        this.context.save();
        const length = this.text.length;
        const tWidth = this.context.measureText(this.text).width;
        const perWidth = Math.ceil(tWidth / length);
        this.context.rect(this.x - Math.ceil(tWidth / 2), this.y - perWidth, tWidth * 1.5, perWidth * 1.5);
        this.context.clip();
        this.context.clearRect(-this.context.canvas.width / 2, -this.context.canvas.height / 2, this.context.canvas.width, this.context.canvas.height);
        this.context.restore();
    }
}

export default Text;