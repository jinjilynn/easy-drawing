import React from 'react'
import rafSchd from 'raf-schd';
import Canvas from './canvas/index.js'
import { fetchDom, lonlatTomercator, scaleRatio, scaleSize, animstate } from './tool/index.js'
import Area from './area/index.js';
import Scatter from './scatter/index.js';
import CSymbol from './symbol';
import Imgs from './image';
import Path from './path/index.js'
import SCircle from './circle/index.js';
import SText from './text/index.js';

class Map extends React.Component {
    canvas = null
    scatterCanvas = null
    pathsCanvas = null
    pathsymbolCanvas = null
    maxLng = null
    minLng = null
    maxLat = null
    minLat = null
    centerPoint = null
    ratio = null
    areaList = []
    scatterList = []
    pathsList = []
    textList = []
    componentDidMount() {
        fetchDom(this.canvas.canvas &&
            this.scatterCanvas.canvas &&
            this.pathsCanvas.canvas &&
            this.pathsymbolCanvas.canvas &&
            this.textCanvas.canvas,
            this.mapRender.bind(this)
        )
    }
    componentWillReceiveProps() {
        setTimeout(() => {
            this.canvas.initCanvas();
            this.scatterCanvas.initCanvas();
            this.pathsCanvas.initCanvas();
            this.pathsymbolCanvas.initCanvas();
            this.textCanvas.initCanvas();
            this.mapRender();
        }, 0)
    }
    initBounds = () => {
        let areas = this.props.areas;
        if (Array.isArray(areas) && areas.length > 0) {
            this.maxLng = null
            this.minLng = null
            this.maxLat = null
            this.minLat = null
            for (let i = 0; i < areas.length; i += 1) {
                if (Array.isArray(areas[i].polygon)) {
                    areas[i].polygon = areas[i].polygon.map(it => {
                        let geo = (it);
                        const x = geo[0];
                        const y = geo[1];
                        this.maxLng === null ? this.maxLng = x : (this.maxLng = Math.max(this.maxLng, x));
                        this.minLng === null ? this.minLng = x : (this.minLng = Math.min(this.minLng, x));
                        this.maxLat === null ? this.maxLat = y : (this.maxLat = Math.max(this.maxLat, y));
                        this.minLat === null ? this.minLat = y : (this.minLat = Math.min(this.minLat, y));
                        return geo;
                    });
                }
            }
        }
    }
    mapRender = () => {
        this.areaList = [];
        this.scatterList.forEach(it => {
            typeof it.stop === 'function' && it.stop();
        })
        this.pathsList.forEach(it => {
            typeof it.stop === 'function' && it.stop();
        })
        this.textList.forEach(it => {
            typeof it.clearText === 'function' && it.clearText();
        })
        this.scatterList = [];
        this.pathsList = [];
        this.initBounds();
        this.initCenter();
        this.initAreas();
        this.renderAreas();
        this.initScatters();
        this.initPaths();
        this.initTexts();
    }
    initCenter = () => {
        const areas = this.props.areas;
        const size = this.props.size;
        if (Array.isArray(areas) &&
            this.maxLng !== null &&
            this.maxLat !== null &&
            this.minLng !== null &&
            this.minLat !== null) {
            const canvas = this.canvas.canvas;
            let limitMin = lonlatTomercator([this.minLng, this.minLat]);
            let limitMax = lonlatTomercator([this.maxLng, this.maxLat]);
            let centerPoint = [(limitMax[0] + limitMin[0]) / 2, (limitMax[1] + limitMin[1]) / 2];
            let cwidth = Math.min(canvas.width, canvas.height);
            let lwidth = Math[size === 'cover' ? 'min' : 'max'](limitMax[1] - limitMin[1], limitMax[0] - limitMin[0]);
            let ratio = Math.sqrt(Math.pow(cwidth, 2) + Math.pow(cwidth, 2)) / Math.sqrt(Math.pow(lwidth, 2) + Math.pow(lwidth, 2));
            this.ratio = ratio;
            this.centerPoint = centerPoint;
        }
    }
    initAreas = () => {
        const areas = this.props.areas;
        if (!Array.isArray(areas)) return;
        const canvas = this.canvas.canvas;
        const context = canvas.getContext('2d');
        context.translate(context.canvas.width / 2, context.canvas.height / 2);
        for (let i = 0; i < areas.length; i += 1) {
            const area = areas[i];
            if (Array.isArray(area.polygon)) {
                let polygons = [...area.polygon]
                polygons = polygons.map(it => {
                    let point = lonlatTomercator(it);
                    return [(point[0] - this.centerPoint[0]) * this.ratio, (this.centerPoint[1] - point[1]) * this.ratio]
                })
                this.areaList.push(new Area(
                    polygons,
                    context,
                    area.fillStyle,
                    area.strokeStyle,
                    area.name,
                    area.shadowColor,
                    area.mouseClick,
                    area.mouseOver
                )
                )
            }
        }
    }
    renderAreas = () => {
        this.areaList.forEach((it) => {
            it.drawMap();
        });
    }
    initScatters = () => {
        let scatters = this.props.scatters;
        if (Array.isArray(scatters)) {
            const context = this.scatterCanvas.canvas.getContext('2d');
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            scatters.forEach(async it => {
                let point = lonlatTomercator(it.point);
                let x = (point[0] - this.centerPoint[0]) * this.ratio;
                let y = (this.centerPoint[1] - point[1]) * this.ratio;
                if (it.pointAtCanvas) {
                    it.pointAtCanvas({ x: (x + context.canvas.width / 2) / scaleRatio, y: (y + context.canvas.height / 2) / scaleRatio });
                }
                if (!it.hidden) {
                    if (it.path) {
                        const symbol = new CSymbol({ path: it.path, context, center: this.centerPoint, point: it.point, ratio: this.ratio, color: it.color, mouseClick: it.mouseClick, mouseOver: it.mouseOver });
                        symbol.render();
                        this.scatterList.push(symbol);
                    } else if (it.img) {
                        const img = new Imgs(context, x, y, it.img, it.mouseClick, it.mouseOver);
                        await img.render();
                        this.scatterList.push(img);
                    } else {
                        let scatter;
                        const size = typeof it.size === 'number' ? it.size / scaleSize : 10;
                        if (it.mode === 'static') {
                            scatter = new SCircle(context, x, y, size, it.color, it.mouseClick, it.mouseOver);
                            scatter.fill();
                        } else {
                            scatter = new Scatter(context, x, y, size, it.color, it.mouseClick, it.mouseOver);
                            scatter.start();
                        }
                        this.scatterList.push(scatter);
                    }
                }
            })
        }
    }
    initPaths = () => {
        let paths = this.props.paths;
        if (Array.isArray(paths)) {
            const context = this.pathsCanvas.canvas.getContext('2d');
            context.translate(context.canvas.width / 2, context.canvas.height / 2);

            const scontext = this.pathsymbolCanvas.canvas.getContext('2d');
            scontext.translate(scontext.canvas.width / 2, scontext.canvas.height / 2);
            paths.forEach(it => {
                const points = it.points;
                if (!Array.isArray(points) || points.length < 2) {
                    console.error('there should be at least two sets of points in path')
                    return;
                }
                const poinsList = points.map(it => {
                    const point = lonlatTomercator(it);
                    const x = (point[0] - this.centerPoint[0]) * this.ratio;
                    const y = (this.centerPoint[1] - point[1]) * this.ratio;
                    return [x, y];
                });
                const path = new Path({
                    points: poinsList,
                    symbol: it.symbol,
                    width: it.width,
                    animation: it.animation,
                    color: it.color,
                    speed: it.speed,
                    delay: it.delay,
                    context,
                    scontext
                })
                typeof path[it.animation || 'alternate'] === 'function' && path[it.animation || 'alternate']();
                this.pathsList.push(path)
            })
        }
    }
    initTexts = () => {
        let texts = this.props.texts;
        if (Array.isArray(texts)) {
            const context = this.textCanvas.canvas.getContext('2d');
            context.translate(context.canvas.width / 2, context.canvas.height / 2);
            texts.forEach(it => {
                let point = lonlatTomercator(it.point);
                let x = (point[0] - this.centerPoint[0]) * this.ratio;
                let y = (this.centerPoint[1] - point[1]) * this.ratio;
                if (typeof it.text === 'string') {
                    const t = new SText(it.text, context, x, y, it.color, it.size, it.align, it.vertical);
                    t.fillText();
                    this.textList.push(t);
                }
            });
        }
    }
    mapClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const screenX = e.clientX;
        const screenY = e.clientY;
        const x = (screenX - rect.left) * scaleRatio;
        const y = (screenY - rect.top) * scaleRatio;
        const areas = this.areaList;
        for (let i = 0; i < areas.length; i += 1) {
            const item = areas[i];
            item.createMapPath();
            if (item.context.isPointInPath(x, y) && typeof item.click === 'function') {
                item.click({ x: x / scaleRatio, y: y / scaleRatio, screenX, screenY });
            }
        }
        const scatterList = this.scatterList;
        for (let i = 0; i < scatterList.length; i += 1) {
            const scatter = scatterList[i];
            scatter.createPath();
            if (scatter.context.isPointInPath(x, y) && typeof scatter.click === 'function') {
                scatter.click({ x: x / scaleRatio, y: y / scaleRatio, screenX, screenY });
            }
        }
    }
    overFun = (x, y, screenX, screenY) => {
        const areas = this.areaList;
        for (let i = 0; i < areas.length; i += 1) {
            const item = areas[i];
            if (typeof item.over === 'object') {
                item.createMapPath();
                if (item.context.isPointInPath(x, y)) {
                    item.clearMap();
                    item.drawMap(item.over.fillStyle);
                    item.reover = 1;
                    this.runIn(item, { x: x / scaleRatio, y: y / scaleRatio, screenX, screenY })
                } else if (item.reover === 1) {
                    item.clearMap();
                    item.drawMap();
                    this.runOut(item);
                    item.reover = 0;
                }
            }
        }
        const scatterList = this.scatterList;
        for (let i = 0; i < scatterList.length; i += 1) {
            const scatter = scatterList[i];
            if (typeof scatter.over === 'object') {
                scatter.createPath();
                if (scatter.context.isPointInPath(x, y)) {
                    if (scatter.GENAME === 'symbol') {
                        scatter.clean()
                        scatter.render({ color: scatter.over.color })
                    }
                    if (scatter.GENAME === 'scatter') {
                        scatter.stop()
                        scatter.start(scatter.over.color)
                    }
                    if (scatter.GENAME === 'circle') {
                        scatter.clear()
                        scatter.fill(scatter.over.color)
                    }
                    scatter.reover = 1;
                    this.runIn(scatter, { x: x / scaleRatio, y: y / scaleRatio, screenX, screenY })
                } else if (scatter.reover === 1) {
                    if (scatter.GENAME === 'symbol') {
                        scatter.clean()
                        scatter.render()
                    }
                    if (scatter.GENAME === 'scatter') {
                        scatter.stop()
                        scatter.start()
                    }
                    if (scatter.GENAME === 'circle') {
                        scatter.clear()
                        scatter.fill()
                    }
                    scatter.reover = 0;
                    this.runOut(scatter);
                }
            }
        }
    }
    mapOver = () => {
        const _c = rafSchd(this.overFun.bind(this));
        return (e) => {
            const rect = e.target.getBoundingClientRect();
            const screenX = e.clientX;
            const screenY = e.clientY;
            const x = (screenX - rect.left) * scaleRatio;
            const y = (screenY - rect.top) * scaleRatio;
            _c(x, y, screenX, screenY);
        }
    }
    runIn = (item, obj) => {
        typeof item.over.moveIn === 'function' && (item.over.moveIn(obj))
    }
    runOut = (item) => {
        typeof item.over.moveOut === 'function' && (item.over.moveOut())
    }
    componentWillUnmount() {
        this.areaList = [];
        this.scatterList.forEach(it => {
            typeof it.stop === 'function' && it.stop();
        })
        this.pathsList.forEach(it => {
            typeof it.stop === 'function' && it.stop();
        })
        this.scatterList = [];
        this.pathsList = [];
    }
    render() {
        const { zIndex: { scatters = 3, areas = 1, paths = 2 } = {} } = this.props;
        return <div onMouseMove={this.mapOver()} onClick={this.mapClick} id="ge-canvas" style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Canvas ref={r => this.pathsCanvas = r} style={{ position: 'absolute', top: 0, left: 0, zIndex: paths }} />
            <Canvas ref={r => this.canvas = r} style={{ position: 'absolute', top: 0, left: 0, zIndex: areas }} />
            <Canvas ref={r => this.scatterCanvas = r} style={{ position: 'absolute', top: 0, left: 0, zIndex: scatters }} />
            <Canvas ref={r => this.pathsymbolCanvas = r} style={{ position: 'absolute', top: 0, left: 0, zIndex: 4 }} />
            <Canvas ref={r => this.textCanvas = r} style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }} />
        </div>
    }
}

export default Map;