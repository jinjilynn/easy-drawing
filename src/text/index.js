import { scaleRatio } from '../tool';
class Text {
    constructor(text, context, x, y, color, size, align,vertical) {
        this.text = text || '';
        this.size = size || '12px';
        this.x = x;
        this.y = y;
        this.color = color || '#fff';
        this.context = context;
        this.align = align || 'center';
        this.vertical = vertical || 'middle';
        this.reover = 0;
        this.GENAME = 'text'
    }
    fillText() {
        this.context.save();
        const size = this.size;
        const s = parseFloat(size);
        let splitIndex = 0 ;
        for(let i = 0; i < size.length; i += 1){
            if(i !== 0 && size[i] !== '.' && !/^\d+$/.test(size.length)){
                splitIndex = i;
                break;
            }
        }
        this.context.font = `${s * Math.sqrt(Math.pow(scaleRatio, 2))}${size.slice(splitIndex)} Arial`;
        this.context.fillStyle = this.color;
        this.context.textAlign = this.align;
        this.context.textBaseline = this.vertical;
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