import { timer } from 'd3-timer';

const maxR = 1.7;
const seconR = (maxR - 1) / 2 + 1;
class Scatter {
    constructor(context, x, y, radius, color, mouseClick, mouseOver) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.step = radius / 150;
        this.color = color || 'yellow';
        this.context = context;
        this.tempRadius1 = this.radius;
        this.tempRadius2 = this.radius * seconR;
        this.tempRadius3 = this.radius * maxR;
        this.animationID = null;
        this.click = mouseClick;
        this.over = mouseOver;
        this.reover = 0;
        this.GENAME = 'scatter'
    }
    normalized(x, xmin, xmax, ymin, ymax) {
        let y = (ymax - ymin) * (x - xmin) / (xmax - xmin) + ymin
        return y;
    }
    createPath() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    }
    strokePath(color) {
        this.context.save();
        this.context.strokeStyle = color || this.color;
        this.context.stroke();
        this.context.restore();
    }
    fillPath(color) {
        this.context.save();
        this.context.fillStyle = color || this.color;
        this.context.fill();
        this.context.restore();
    }
    strokeFlashCirclePath(radius, color) {
        this.context.save();
        this.context.beginPath();
        let alpha = 1 - this.normalized(radius, this.radius, this.radius * maxR, 0, 1);
        this.context.globalAlpha = alpha < 0 ? 0.05 : alpha
        this.context.arc(this.x, this.y, radius, 0, Math.PI * 2);
        this.strokePath(color);
        this.context.restore();
    }
    drawAnimate(color) {
        this.context.save();
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
        this.context.clip();
        this.context.clearRect(-this.context.canvas.width / 2, -this.context.canvas.height / 2, this.context.canvas.width, this.context.canvas.height);
        this.context.restore();
        this.createPath();
        this.fillPath(color);
        this.strokeFlashCirclePath(this.tempRadius1, color);
        this.strokeFlashCirclePath(this.tempRadius2, color);
        this.strokeFlashCirclePath(this.tempRadius3, color);
        this.context.restore();
    }
    animate = function (color) {
        if (this.tempRadius1 > this.radius * (maxR)) {
            this.tempRadius1 = this.radius;
        } else {
            this.tempRadius1 += this.step;
        }
        if (this.tempRadius2 > this.radius * (maxR)) {
            this.tempRadius2 = this.radius;
        } else {
            this.tempRadius2 += this.step;
        }
        if (this.tempRadius3 > this.radius * (maxR)) {
            this.tempRadius3 = this.radius;
        } else {
            this.tempRadius3 += this.step;
        }
        this.drawAnimate(color);
    }
    start = function (color) {
        this.timer = timer(this.animate.bind(this, color));
    }
    stop = function () {
        this.timer && this.timer.stop();
    }
}

export default Scatter;