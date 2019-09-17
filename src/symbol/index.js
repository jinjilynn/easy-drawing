import svgpath from 'svgpath';
import getBounds from 'svg-path-bounds';
import { lonlatTomercator } from '../tool'

class CSymbol {
    constructor({ path, context, center, point, ratio, color, mouseClick, mouseOver }) {
        this.svg = window.document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.context = context;
        this.center = center;
        this.point = [...point];
        this.spoint = [...point];
        this.ratio = ratio;
        this.path = '';
        this.rotate = 0;
        this.scale = 1;
        this.color = color || 'yellow';
        this.draw = 'fill';
        this.realPath = '';
        this.reover = 0;
        typeof path === 'string' && (this.path = path);
        if (typeof path === 'object') {
            path.hasOwnProperty('rotate') && (this.rotate = path.rotate);
            path.hasOwnProperty('d') && (this.path = path.d);
            path.hasOwnProperty('scale') && (this.scale = path.scale);
            path.hasOwnProperty('color') && (this.color = path.color);
            path.hasOwnProperty('draw') && (this.draw = path.draw);
        }
        this.click = mouseClick;
        this.over = mouseOver;
    }
    initPath() {
        const sobj = svgpath(this.path)
        this.realPath = sobj.rotate(this.rotate).scale(this.scale).rel().toString();
    }
    convertPoint(point) {
        const from = lonlatTomercator(point || this.point);
        this.spoint = [(from[0] - this.center[0]) * this.ratio, (this.center[1] - from[1]) * this.ratio];
    }
    reWritePath() {
        let splitIndex = 0;
        for (let i = 0; i < this.realPath.length; i += 1) {
            if (this.realPath[0].toLowerCase() !== 'm') {
                throw new Error('path should begin with M');
            }
            if (i !== 0 && /^[A-Za-z]*$/.test(this.realPath[i])) {
                splitIndex = i;
                break;
            }
        }
        const fromPoint = this.realPath.slice(1, splitIndex);
        const sx = window.parseFloat(fromPoint.split(' ')[0]);
        const sy = window.parseFloat(fromPoint.split(' ')[1]);
        const [left, top, right, bottom] = getBounds(this.realPath);
        const spanX = (right + left) / 2 - sx;
        const spanY = (top + bottom) / 2 - sy;
        const px = this.spoint[0] - spanX;
        const py = this.spoint[1] - spanY;
        this.realPath = this.realPath.replace(fromPoint, `${px} ${py}`);
    }
    createPath(realPath) {
        this.svg.setAttributeNS(null, 'd', realPath || this.realPath);
        const pathLength = this.svg.getTotalLength();
        const interLength = pathLength / 100;
        this.context.beginPath();
        for (let i = 0; i <= pathLength; i += interLength) {
            const x = parseFloat(this.svg.getPointAtLength(i).x);
            const y = parseFloat(this.svg.getPointAtLength(i).y);
            i === 0 && this.context.moveTo(x, y);
            i !== 0 && this.context.lineTo(x, y);
        }
        this.context.closePath();
    }
    fillPath(color) {
        this.context.fillStyle = color || this.color;
        this.context.fill();
    }
    strokePath(color) {
        this.context.strokeStyle = color || this.color;
        this.context.stroke();
    }
    cleanPath() {
        this.context.clip();
        this.context.clearRect(-this.context.canvas.width / 2, -this.context.canvas.height / 2, this.context.canvas.width, this.context.canvas.height);
    }
    prepareAction(point) {
        this.initPath();
        if (Array.isArray(this.center)) {
            point && this.convertPoint(point);
            !point && this.convertPoint();
        } else {
            this.spoint = point ? point : this.spoint;
        }
        this.reWritePath();
        this.createPath();
    }
    fill({ color, point }) {
        this.prepareAction(point);
        this.fillPath(color);
    }
    stroke({ color, point }) {
        this.prepareAction(point);
        this.strokePath(color);
    }
    render({ color, point } = {}) {
        typeof this[this.draw] === 'function' && this[this.draw]({ color, point });
    }
    clean() {
        this.context.save();
        const [left, top, right, bottom] = getBounds(this.realPath);
        const spanX = right - left + 2;
        const spanY = bottom - top + 2;
        this.context.beginPath();
        this.context.rect(left - 2, top - 2, spanX, spanY);
        this.cleanPath();
        this.context.restore();
    }
}

export default CSymbol;