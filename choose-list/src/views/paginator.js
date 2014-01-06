var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var d = require("./disposable");
var PaginatorView = (function (_super) {
    __extends(PaginatorView, _super);
    function PaginatorView(opts) {
        this.events = {
            'click li': 'changePage'
        };
        _super.call(this, opts);
        this.template = opts.template;
    }
    PaginatorView.prototype.render = function () {
        var paginator = this.collection.paginator;
        $(this.el).html(this.template(_.extend(paginator.toJSON(), {
            pages: _.range(1, paginator.pages + 1),
            isCurrent: function () {
                return parseInt(this) == paginator.currentPage;
            }
        })));
        return this;
    };
    PaginatorView.prototype.changePage = function (evt) {
        var paginator = this.collection.paginator;
        var page = parseInt($(evt.target).closest('li').data('page'));
        paginator.currentPage = page;
    };
    return PaginatorView;
})(d.DisposableView);
exports.PaginatorView = PaginatorView;