
class Area {
    constructor(points, context, fillStyle, strokeStyle, name, shadowColor, mouseClick, mouseOver) {
        this.points = points;
        this.context = context;
        this.fillStyle = fillStyle || 'rgba(111,149,255,0.4)';
        this.strokeStyle = strokeStyle || 'rgba(111,149,255,0.4';
        this.name = name;
        this.shadowColor = shadowColor;
        this.click = mouseClick;
        this.over = mouseOver;
        this.reover = 0;
    };
    createMapPath() {
        if (Array.isArray(this.points)) {
            this.context.beginPath();
            this.points.forEach((it, index) => {
                index === 0 ? this.context.moveTo(it[0], it[1]) : this.context.lineTo(it[0], it[1]);
            });
            this.context.closePath();
        }
    }
    drawMap(fillStyle,strokeStyle) {
        this.context.save();
        this.createMapPath();
        this.context.fillStyle = fillStyle ? fillStyle : this.fillStyle ;
        this.context.strokeStyle = strokeStyle ? strokeStyle : this.strokeStyle;
        if (this.shadowColor) {
            this.context.shadowColor = this.shadowColor;
            this.context.shadowBlur = 10;
        }
        this.context.fill();
        this.context.stroke();
        this.drawName();
        this.context.restore();
    }
    drawName() {
        if (Array.isArray(this.points) && this.name && this.name.text && this.name.show !== false) {
            let minx = null
            let miny = null;
            let maxx = null;
            let maxy = null;
            let points = this.points.map(it => {
                let x = it[0];
                let y = it[1];
                maxx === null ? maxx = x : (maxx = Math.max(maxx, x));
                minx === null ? minx = x : (minx = Math.min(minx, x));
                maxy === null ? maxy = y : (maxy = Math.max(maxy, y));
                miny === null ? miny = y : (miny = Math.min(miny, y));
                return { x, y }
            })
            let center = { x: (maxx + minx) / 2, y: (maxy + miny) / 2 };
            this.context.font = `${this.name.fontSize || '12px'} 微软雅黑`
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';
            this.context.fillStyle = this.name.color || '#fff';
            this.context.fillText(this.name.text, center.x, center.y);
        }
    }
    clearMap() {
        this.createMapPath();
        this.context.save();
        this.context.clip();
        this.context.clearRect(-this.context.canvas.width / 2, -this.context.canvas.height / 2, this.context.canvas.width, this.context.canvas.height);
        this.context.restore();
    }
}

export default Area;