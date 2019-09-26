<p align="center">
    <img width="100" src="https://jinjilynn.github.io/imgs/easy-drawing.svg">
</p>

<h2 align="center">Easy Drawing</h2>


一个react组件，它可以使用经纬度轻松愉悦的绘制任意形状和动态路径


[![NPM](https://img.shields.io/badge/npm-v1.1.17-blue)](https://www.npmjs.com/package/easy-drawing)    [![size](https://img.shields.io/badge/size-45KB-green)]()


[English](https://github.com/jinjilynn/easy-drawing/blob/master/README.md) | 简体中文

## ✨ 描述

一般来说，即使你很好地掌握了canvas和svg，你仍然会在绘图过程中遇到很多挑战。 最大的挑战就是如何轻地松获取坐标，包括各种形状的顶点坐标，以及您想要知道相对于某个参照物的任何坐标。 因此，如果您可以像在临摹图形一样轻松地在canvas中绘制，那将是多么轻松。

鉴于此，我选择使用纬度和经度绘制。 这里，经度是X坐标，纬度是y坐标。

因此，您可以在百度拾取坐标系统中 http://api.map.baidu.com/lbsapi/getpoint/index.html 上拾取您在地图上看到的或想象到到的一组坐标点。 有了这些点，您可以绘制相应的图形。

## 🚇 支持环境

Modern browsers and Internet Explorer support canvas

| <img src="https://jinjilynn.github.io/imgs/edge.png" alt="IE / Edge" width="24px" height="24px" />| <img src="https://jinjilynn.github.io/imgs/firefox.png" alt="IE / Edge" width="24px" height="24px" /> | <img src="https://jinjilynn.github.io/imgs/chrome.png" alt="IE / Edge" width="24px" height="24px" /> | <img src="https://jinjilynn.github.io/imgs/safari.png" alt="IE / Edge" width="24px" height="24px" /> | <img src="https://jinjilynn.github.io/imgs/opera.png" alt="IE / Edge" width="24px" height="24px" /> |
| --- |  --- | --- | --- | --- |
| 9+  | 3.6+ | 4+  | 4+  | 4+  |


## ⏬ 安装

```bash
npm install easy-drawing
```

```bash
yarn add easy-drawing
```


## 🖱️ 使用

```jsx
import  EasyDrawing from 'easy-drawing';
```

## 📄 文档

坚持一贯的至简原则，不需要花费很多精力

- [`文档`](https://jinjilynn.github.io)


## 📷 License

MIT © Facebook Inc.