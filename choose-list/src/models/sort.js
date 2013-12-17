var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SortedCollection = (function (_super) {
    __extends(SortedCollection, _super);
    function SortedCollection() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(SortedCollection.prototype, "sortOrder", {
        set: function (value) {
            this._sortOrder = (this._sortOrder) ? this._sortOrder : {};
            if (!_(this._sortOrder).isEqual(value)) {
                for (var key in value) {
                    if (typeof (value[key]) == 'object')
                        throw 'Not cool!';
                    this._sortOrder[key] = value[key];
                }
                this.eachCache = function () {
                    this.eachCache = (this.models).sort(function (a, b) {
                        var keyA = a[value.key], keyB = b[value.key];
                        if (typeof (keyA) !== typeof (keyB)) {
                            throw 'Key value types do not match';
                        }
                        switch (typeof (keyA)) {
                            case 'string':
                                return value.direction * keyA.localeCompare(keyB);
                            case 'number':
                                return value.direction * (keyA - keyB);
                            case 'object':
                                if (keyA instanceof Date) {
                                    return value.direction * (+keyA - +keyB);
                                }
                            default:
                                throw 'Do not know how to sort on key `' + value.key + '`';
                        }
                    });
                };
            }
        },
        enumerable: true,
        configurable: true
    });
    SortedCollection.prototype.forEach = function (cb) {
        if (typeof (this.eachCache) == 'function')
            (this.eachCache)();
        (this.eachCache).forEach(function (model, index, array) {
            cb(model, index, array);
        });
    };
    SortedCollection.prototype.add = function (obj, opts) {
        if (!opts) {
            opts = { sort: false };
        } else {
            opts.sort = false;
        }
        Backbone.Collection['prototype'].add.call(this, obj, opts);
    };
    SortedCollection.prototype.toJSON = function () {
        var out = [];
        this.forEach(function (model) {
            out.push(model.toJSON());
        });
        return out;
    };
    return SortedCollection;
})(Backbone.Collection);
exports.SortedCollection = SortedCollection;