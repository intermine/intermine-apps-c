var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DisposableView = (function (_super) {
    __extends(DisposableView, _super);
    function DisposableView(opts) {
        _super.call(this, opts);
        this.disposed = false;
    }
    DisposableView.prototype.disposeOf = function (obj) {
        if (obj instanceof Array) {
            obj.forEach(this.disposeOf);
        } else {
            if ('dispose' in obj && typeof (obj.dispose) == 'function') {
                obj.dispose();
            } else {
                throw 'Cannot dispose of this object';
            }
        }
    };
    DisposableView.prototype.dispose = function () {
        var _this = this;
        if (this.disposed)
            return;
        this.remove();
        ['el', '$el', 'options', 'opts', 'model', 'collection'].forEach(function (property) {
            delete _this[property];
        });
        this.disposed = true;
        if (Object.freeze && typeof Object.freeze === 'function') {
            Object.freeze(this);
        }
    };
    return DisposableView;
})(Backbone.View);
exports.DisposableView = DisposableView;