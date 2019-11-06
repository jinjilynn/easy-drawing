export function lonlatTomercator(lonlats) {
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
    animQueue : {},
    _a : false,
    _id: null
}

function _startA() {
    const queue = Object.values(animstate.animQueue);
    console.log(queue.length);
    queue.forEach(function (cb) {
        cb();
    });
    animstate._a && (animstate._id = window.requestAnimationFrame(_startA));
}

export function timer(callback) {
    const aid = `animation_${(Math.random() * Math.random()).toString().replace(/\./g, '')}`;
    animstate.animQueue[aid] = callback;
    if (!animstate._a) {
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

