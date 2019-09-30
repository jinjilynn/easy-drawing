<p align="center">
    <img width="100" src="https://jinjilynn.github.io/imgs/easy-drawing.svg">
</p>

<h2 align="center">Easy Drawing</h2>


一个react组件，它可以让你使用经纬度轻松愉悦的绘制任意形状的图形、任意区域的地图和任意的动态路径


[![NPM](https://img.shields.io/badge/npm-v1.1.24-blue)](https://www.npmjs.com/package/easy-drawing)    [![size](https://img.shields.io/badge/size-47KB-green)](https://www.npmjs.com/package/easy-drawing)


[English](https://github.com/jinjilynn/easy-drawing/blob/master/README.en.md) | 简体中文

## 📄 [文档和例子](https://jinjilynn.github.io)

- 坚持一贯的简约原则，不需要花费很多精力

## ✨ 描述

通常情况下，就算你对canvas和svg掌握的已经很好了，但是在绘制图形过程中仍然会面临各种挑战，其中最大的挑战就是坐标，比如说各种形状的轮廓坐标或者图形内部某个点的位置坐标，一般来说这种类型的坐标要经过或复杂或简单的数学算法得到，所以有时候我就寻思着要是可以像临摹图画一样，不用经过计算就能画出来岂不是美滋滋。

基于这种想法，我选择了使用经纬度绘图的思路，这里经度就是x坐标，纬度就是y坐标

这样你就可以借助[百度拾取坐标](http://api.map.baidu.com/lbsapi/getpoint/index.html)系统画出任何在地图上出现的或者你想象的图形。


## 🚇 支持环境

支持canvas的浏览器

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

## 📷 License

MIT © Facebook Inc.