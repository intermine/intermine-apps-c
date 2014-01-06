var m = require("../mediator");
var Colorize = (function () {
    function Colorize() {
        this.scheme = 'Paired';
        this.map = {};
        m.mediator.on('added:tags', this.run, this);
    }
    Colorize.prototype.add = function (key) {
        if (_.isUndefined(this.map[key])) {
            this.map[key] = null;
        }
    };
    Colorize.prototype.get = function (key) {
        var color;
        if (_.isUndefined(color = this.map[key])) {
            return '#FFF';
        } else {
            return color;
        }
    };
    Colorize.prototype.run = function () {
        var _this = this;
        var min = +Infinity, max = -Infinity;
        _.forEach(_.keys(colorbrewer[this.scheme]), function (el) {
            var value = parseInt(el);
            if (value > max)
                max = value;
            if (value < min)
                min = value;
        });
        if (min == +Infinity || max == -Infinity)
            return;
        var keys = _.keys(this.map), size = keys.length, count = max;
        if (size >= min && size < max)
            count = size;
        var vectors = [];
        for (var i = 0; i < size; i++) {
            var vector = [];
            for (var j = 0; j < size; j++) {
                vector.push(distance(keys[i], keys[j]));
            }
            vectors.push(vector);
        }
        var clusters = clusterfck.kmeans(vectors, count);
        clusters.forEach(function (cluster, i) {
            cluster.forEach(function (a) {
                for (var j = 0; j < vectors.length; j++) {
                    var b = vectors[j];
                    if (arraysEqual(a, b))
                        break;
                }
                (_this).map[keys[j]] = colorbrewer[_this.scheme][count][i];
                vectors.splice(j, 1);
                keys.splice(j, 1);
            });
        });
    };
    return Colorize;
})();
exports.Colorize = Colorize;
var distance = _.memoize(function (a, b) {
    return (new Levenshtein(a, b)).distance;
}, function () {
    var a = arguments[0];
    var b = arguments[1];
    if (a.localeCompare(b) === 1) {
        return a + ":" + b;
    } else {
        return b + ":" + a;
    }
});
var arraysEqual = function (a, b) {
    return !(a < b || b < a);
};
exports.colorize = new Colorize();