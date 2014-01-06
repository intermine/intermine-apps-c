var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var r = require("./row");
var tv = require("./tags");
var tm = require("../models/tags");
var p = require("./paginator");
var m = require("../mediator");
var TableView = (function (_super) {
    __extends(TableView, _super);
    function TableView(opts) {
        var _this = this;
        this.events = {
            'click thead th[data-sort]': 'sortTable',
            'click #submit': 'submitList'
        };
        _super.call(this, opts);
        this.opts = opts;
        this.rows = [];
        this.tags = new tv.TagsView({
            collection: tm.tags,
            template: this.opts.templates.tags
        });
        m.mediator.on('change:page change:sort change:tags', this.renderTable, this);
        m.mediator.on('selected:lists', function (count) {
            var flipper = function (el) {
                if (typeof el === "undefined") { el = $(_this.el).find('#submit'); }
                el[!count ? 'addClass' : 'removeClass']('disabled');
            };
            var submit;
            if (!!(submit = $(_this.el).find('#submit')).length) {
                flipper(submit);
            } else {
                m.mediator.on('rendered:table', flipper, _this);
            }
        }, this);
    }
    TableView.prototype.render = function () {
        $(this.el).html(this.opts.templates.table({}));
        $(this.el).find('div[data-view="tags"]').html(this.tags.render().el);
        this.renderTable();
        m.mediator.trigger('rendered:table');
        return this;
    };
    TableView.prototype.renderTable = function (page) {
        var _this = this;
        page = page || 1;
        this.collection.paginator.currentPage = page;
        var fragment = document.createDocumentFragment();
        this.rows.forEach(function (view) {
            view.remove();
        });
        (this.collection).forEach(function (list) {
            var row = new r.RowView({
                model: list,
                templates: {
                    row: _this.opts.templates.row,
                    tooltip: _this.opts.templates.tooltip
                }
            });
            _this.rows.push(row);
            fragment.appendChild(row.render().el);
        });
        $(this.el).find('tbody[data-view="rows"]').html(fragment);
        if (this.paginator)
            this.paginator.dispose();
        this.paginator = new p.PaginatorView({
            collection: this.collection,
            template: this.opts.templates.pagination
        });
        $(this.el).find('div[data-view="pagination"]').html(this.paginator.render().el);
    };
    TableView.prototype.sortTable = function (ev) {
        var key = $(ev.target).closest('th').data('sort');
        if (this.sortOrder && this.sortOrder.key == key) {
            this.sortOrder.direction *= -1;
        } else {
            this.sortOrder = {
                key: key,
                direction: 1
            };
        }
        (this.collection).sortOrder = this.sortOrder;
        m.mediator.trigger('change:sort');
    };
    TableView.prototype.submitList = function () {
        var selected;
        if (selected = this.collection.find(function (list) {
            return list.selected;
        })) {
            m.mediator.trigger('submit:list', selected);
        }
    };
    return TableView;
})(Backbone.View);
exports.TableView = TableView;