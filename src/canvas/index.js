import React from 'react';
import { fetchDom, scaleRatio } from '../tool/index.js';

class Canvas extends React.Component {
    canvas = null;
    componentDidMount() {
        fetchDom(this.canvas, this.initCanvas.bind(this));
    }

    initCanvas() {
        const styleDom = window.getComputedStyle(this.canvas.parentNode);
        const width = (window.parseFloat(styleDom.getPropertyValue('width')));
        const height = (window.parseFloat(styleDom.getPropertyValue('height')));
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = width * scaleRatio;
        this.canvas.height = height * scaleRatio;
    }
    render() {
        const { style } = this.props;
        let s = style || {}
        return <canvas ref={r => this.canvas = r} style={{ ...s }} />
    }
}

export default Canvas;