export function lonlatTomercator(lonlats){
    const lonlat = lonlats;
    const mercator = [];
    const x = lonlat[0] * 20037508.34 / 180;
    if (Math.abs(lonlat[1]) > 85.05112877980659) {
        lonlat[1] = 85.05112877980659 * Math.abs(lonlat[1]) / lonlat[1];
    }
    let y = Math.log(Math.tan((90 + lonlat[1]) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    mercator[0] = x;
    mercator[1] = y;
    return mercator;
}

export function lonlatToGauss(lonlats) {
    var a;
    var b;
    var f;
    var e;
    var e1;

    var FE;
    var FN;
    var L0;
    var W0;
    function init(TuoqiuCanshu, CentralMeridian, OriginLatitude, EastOffset, NorthOffset) {
        if (TuoqiuCanshu == 0) {
            a = 6378245;
            b = 6356863.0188;
        }
        if (TuoqiuCanshu == 1) {
            a = 6378140;
            b = 6356755.2882;
        }
        if (TuoqiuCanshu == 2) {
            a = 6378137;
            b = 6356752.3142;
        }
        if (TuoqiuCanshu == 3) {
            a = 6378137;
            b = 6356752.314140356;
        }
        f = (a - b) / a;
        e = Math.sqrt(2 * f - Math.pow(f, 2));
        e1 = e / Math.sqrt(1 - Math.pow(e, 2));
        L0 = CentralMeridian;
        W0 = OriginLatitude;
        FE = EastOffset;
        FN = NorthOffset;
    }
    init(3, 114, 0, 500000, 0);
    var W = lonlats[1];
    var J = lonlats[0];
    var resultP = {};
    var BR = (W - W0) * Math.PI / 180;
    var lo = (J - L0) * Math.PI / 180;
    var N = a / Math.sqrt(1 - Math.pow((e * Math.sin(BR)), 2));
    var B0;
    var B2;
    var B4;
    var B6;
    var B8;
    var C = Math.pow(a, 2) / b;
    B0 = 1 - 3 * Math.pow(e1, 2) / 4 + 45 * Math.pow(e1, 4) / 64 - 175 * Math.pow(e1, 6) / 256 + 11025 * Math.pow(e1, 8) / 16384;
    B2 = B0 - 1
    B4 = 15 / 32 * Math.pow(e1, 4) - 175 / 384 * Math.pow(e1, 6) + 3675 / 8192 * Math.pow(e1, 8);
    B6 = 0 - 35 / 96 * Math.pow(e1, 6) + 735 / 2048 * Math.pow(e1, 8);
    B8 = 315 / 1024 * Math.pow(e1, 8);
    var s = C * (B0 * BR + Math.sin(BR) * (B2 * Math.cos(BR) + B4 * Math.pow((Math.cos(BR)), 3) + B6 * Math.pow((Math.cos(BR)), 5) + B8 * Math.pow((Math.cos(BR)), 7)));

    var t = Math.tan(BR);
    var g = e1 * Math.cos(BR);
    var XR = s + Math.pow(lo, 2) / 2 * N * Math.sin(BR) * Math.cos(BR) + Math.pow(lo, 4) * N * Math.sin(BR) * Math.pow((Math.cos(BR)), 3) / 24 * (5 - Math.pow(t, 2) + 9 * Math.pow(g, 2) + 4 * Math.pow(g, 4)) + Math.pow(lo, 6) * N * Math.sin(BR) * Math.pow((Math.cos(BR)), 5) * (61 - 58 * Math.pow(t, 2) + Math.pow(t, 4)) / 720;
    var YR = lo * N * Math.cos(BR) + Math.pow(lo, 3) * N / 6 * Math.pow((Math.cos(BR)), 3) * (1 - Math.pow(t, 2) + Math.pow(g, 2)) + Math.pow(lo, 5) * N / 120 * Math.pow((Math.cos(BR)), 5) * (5 - 18 * Math.pow(t, 2) + Math.pow(t, 4) + 14 * Math.pow(g, 2) - 58 * Math.pow(g, 2) * Math.pow(t, 2));
    resultP.x = YR + FE;
    resultP.y = XR + FN;
    return [resultP.x, resultP.y];

}

export const scaleRatio = window.devicePixelRatio;


export const scaleSize = scaleRatio === 2 ? 1 : 2;


export function distancePoint(point1, point2) {
    const dx = point1[0] - point2[0];
    const dy = point1[1] - point2[1];
    return Math.sqrt(dx * dx + dy * dy);
};

export function fetchDom(dom, callback) {
    if (dom) {
        callback()
    } else {
        setTimeout(() => {
            fetchDom(dom, callback)
        }, 0)
    }
}




export const animstate = {
    animQueue: {},
    _a: false,
    _id: null
}

function _startA() {
    const queue = Object.values(animstate.animQueue);
    queue.forEach(function (cb) {
        cb();
    });
    animstate._a && (animstate._id = window.requestAnimationFrame(_startA));
}

export function timer(callback) {
    const aid = `animation_${(Math.random() * Math.random()).toString().replace(/\./g, '')}`;
    animstate.animQueue[aid] = callback;
    if (!animstate._a) {
        window.cancelAnimationFrame(animstate._id);
        animstate._id = window.requestAnimationFrame(_startA);
        animstate._a = true;
    }
    return {
        stop() {
            delete animstate.animQueue[aid];
            if (Object.keys(animstate.animQueue).length === 0) {
                animstate._a = false;
            }
        }
    }
}

