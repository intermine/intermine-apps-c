var rgbaToHex = function (rgba) {
    var componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(rgba.r) + componentToHex(rgba.g) + componentToHex(rgba.b);
};
var hexToRgba = function (hex) {
    if (hex[0] == '#')
        hex = hex.slice(1);
    var bigint = parseInt(hex, 16), r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
    return { r: r, g: g, b: b, a: 1 };
};
var hslaToRgba = function (hsla) {
    var hue = function (h) {
        if (h < 0)
            ++h;
        if (h > 1)
            --h;
        if (h * 6 < 1)
            return m1 + (m2 - m1) * h * 6;
        if (h * 2 < 1)
            return m2;
        if (h * 3 < 2)
            return m1 + (m2 - m1) * (2 / 3 - h) * 6;
        return m1;
    };
    var h = hsla.h / 360, s = hsla.s / 100, l = hsla.l / 100, a = hsla.a;
    var m2 = l <= .5 ? l * (s + 1) : l + s - l * s, m1 = l * 2 - m2;
    var r = Math.round(hue(h + 1 / 3) * 0xff), g = Math.round(hue(h) * 0xff), b = Math.round(hue(h - 1 / 3) * 0xff);
    return { r: r, g: g, b: b, a: a };
};
var rgbaToHsla = function (rgba) {
    var r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255, a = rgba.a;
    var min = Math.min(r, g, b), max = Math.max(r, g, b), l = (max + min) / 2, d = max - min, h, s;
    switch (max) {
        case min:
            h = 0;
            break;
        case r:
            h = 60 * (g - b) / d;
            break;
        case g:
            h = 60 * (b - r) / d + 120;
            break;
        case b:
            h = 60 * (r - g) / d + 240;
            break;
    }
    if (max == min) {
        s = 0;
    } else if (l < .5) {
        s = d / (2 * l);
    } else {
        s = d / (2 - 2 * l);
    }
    h %= 360;
    s *= 100;
    l *= 100;
    return { h: h, s: s, l: l, a: a };
};
exports.darken = function (hex, amount) {
    var hsl = rgbaToHsla(hexToRgba(hex));
    var prop = 'l';
    var val = -amount.val;
    if ('%' == amount.type) {
        val = 'l' == prop && val > 0 ? (100 - hsl[prop]) * val / 100 : hsl[prop] * (val / 100);
    }
    hsl[prop] += val;
    return rgbaToHex(hslaToRgba(hsl));
};