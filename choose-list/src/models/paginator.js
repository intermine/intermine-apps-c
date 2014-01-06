var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var m = require("../mediator");
var Paginator = (function (_super) {
    __extends(Paginator, _super);
    function Paginator(opts) {
        _super.call(this, _.extend({
            currentPage: 1,
            perPage: 10
        }, opts));
    }
    Object.defineProperty(Paginator.prototype, "perPage", {
        get: function () {
            return this.get('perPage');
        },
        set: function (value) {
            if (this.get('perPage') !== value) {
                this.reset();
                this.set('perPage', value);
                m.mediator.trigger('change:page', 1);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "currentPage", {
        get: function () {
            return this.get('currentPage');
        },
        set: function (value) {
            if (this.get('currentPage') !== value) {
                this.reset();
                this.set('currentPage', value);
                m.mediator.trigger('change:page', value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "pages", {
        get: function () {
            return Math.ceil(this.size / this.get('perPage'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            this._size = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Paginator.prototype, "returned", {
        get: function () {
            return this._returned;
        },
        set: function (value) {
            this._returned = value;
        },
        enumerable: true,
        configurable: true
    });
    Paginator.prototype.reset = function () {
        this.returned = 0;
        this.size = 0;
    };
    return Paginator;
})(Backbone.Model);
exports.Paginator = Paginator;