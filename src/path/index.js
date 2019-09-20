import CSymbol from '../symbol';

class Path {
    constructor(param) {
        this.points = [...param.points];
        this.symbol = param.symbol;
        this.color = param.color || 'yellow';
        this.width = param.width || 2;
        this.animation = param.animation || 'alternate';
        this.speed = Math.abs(param.speed);
        this.delay = param.delay || 0;
        this.context = param.context;
        this.scontext = param.scontext;
        this.svg = window.document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.path = '';
        this.pathLength = 0;
        this.spanLength = 0;
        this.symPathLength = 0;
        this.symSpanLength = 0;
        this.step = 0;
        this.symStep = 0;
        this.animationID;
        this.clip;
        this.symbolInstance;
    }
    getSpeed(speed) {
        return 1000 / Math.sqrt(speed, 2) + 1
    }
    initSvgPath() {
        this.points.forEach((it, index) => {
            index === 0 && (this.path = `M${it.join(' ')}`);
            index !== 0 && (this.path = `${this.path}L${it.join(' ')}`);
        })
    }
    initAnimate() {
        this.svg.setAttributeNS(null, 'd', this.path);
        this.pathLength = this.svg.getTotalLength();
        if (!this.speed === this.speed || !this.speed) {
            this.spanLength = this.pathLength / 100;
        } else {
            this.spanLength = this.pathLength / this.getSpeed(this.speed);
        }
    }
    initSymbolAnimate(symSpeed) {
        const speed = Math.abs(symSpeed);
        this.svg.setAttributeNS(null, 'd', this.path);
        this.symPathLength = this.svg.getTotalLength();
        if (!speed === speed) {
            this.symSpanLength = this.symPathLength / 100;
        } else {
            this.symSpanLength = this.symPathLength / this.getSpeed(speed);
        }
    }
    initStaticPath() {
        this.context.beginPath();
        this.points.forEach((it, index) => {
            index === 0 && (this.context.moveTo(...it));
            index !== 0 && (this.context.lineTo(...it));
        })
    }
    stroke() {
        this.context.save();
        this.context.strokeStyle = this.color;
        this.context.lineCap = 'round';
        this.context.lineJoin = "round";
        this.context.lineWidth = this.width;
        this.context.stroke();
        this.context.restore();
    }
    alternate() {
        this.initSvgPath();
        new Promise(resolve => {
            this.timeoutID = setTimeout(resolve, this.delay);
        }).then(() => {
            this.initAnimate();
            this.animationID = window.requestAnimationFrame(this.alternateA.bind(this));
        });
        this.runSymbol();
    }
    alternateA() {
        if (this.step >= this.pathLength) {
            this.step = 0;
            this.clip = !this.clip;
        }
        this.step += this.spanLength;
        let temp = this.step;
        const x1 = parseFloat(this.svg.getPointAtLength(temp).x);
        const y1 = parseFloat(this.svg.getPointAtLength(temp).y);
        temp -= this.spanLength;
        const x2 = parseFloat(this.svg.getPointAtLength(temp).x);
        const y2 = parseFloat(this.svg.getPointAtLength(temp).y);
        if (this.clip) {
            this.context.beginPath();
            this.context.save()
            this.context.arc(x1, y1, this.spanLength, 0, Math.PI * 2);
            this.context.clip()
            this.context.clearRect(-this.context.canvas.width / 2, -this.context.canvas.height / 2, this.context.canvas.width, this.context.canvas.height)
            this.context.restore();
        } else {
            this.context.beginPath();
            this.context.moveTo(x2, y2);
            this.context.lineTo(x1, y1);
            this.context.save();
            this.context.strokeStyle = this.color;
            this.context.lineWidth = this.width;
            this.context.stroke();
            this.context.restore();
        }
        this.animationPathID = window.requestAnimationFrame(this.alternateA.bind(this));
    }
    symbolA() {
        if (this.symStep >= this.symPathLength) {
            this.symStep = 0;
        }
        this.symStep += this.symSpanLength;
        let temp = this.symStep;
        const x1 = parseFloat(this.svg.getPointAtLength(temp).x);
        const y1 = parseFloat(this.svg.getPointAtLength(temp).y);
        if (this.symbolInstance) {
            this.symbolInstance.clean()
            this.symbolInstance.render({ point: [x1, y1] });
        }
        this.symbolAID = window.requestAnimationFrame(this.symbolA.bind(this));
    }
    normal() {
        this.initStaticPath();
        this.stroke();
        this.initSvgPath();
        this.runSymbol();
    }
    runSymbol() {
        if (this.symbol && typeof this.symbol === 'object' && typeof this.symbol.d === 'string') {
            if (typeof this.symbol.delay === 'number') {
                new Promise(resolve => {
                    this.stimeoutID = setTimeout(resolve, this.symbol.delay);
                }).then(() => {
                    this.symbolStart();
                });
            } else {
                this.symbolStart();
            }
        }
    }
    symbolStart() {
        this.symbolInstance = new CSymbol({ path: this.symbol, context: this.scontext, point: this.points[0], color: this.color, });
        this.symbolInstance.render();
        this.initSymbolAnimate(this.symbol.speed);
        this.symbolAID = window.requestAnimationFrame(this.symbolA.bind(this));
    }
    stop() {
        this.animationPathID && window.cancelAnimationFrame(this.animationPathID);
        this.symbolAID && window.cancelAnimationFrame(this.symbolAID);
        this.timeoutID && window.clearTimeout(this.timeoutID);
        this.stimeoutID && window.clearTimeout(this.stimeoutID)
    }

}

export default Path;