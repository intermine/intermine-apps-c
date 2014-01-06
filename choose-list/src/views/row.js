var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var t = require("../models/tags");
var m = require("../mediator");
var c = require("../utils/colors");
var RowView = (function (_super) {
    __extends(RowView, _super);
    function RowView(opts) {
        opts.tagName = 'tr';
        this.events = {
            'mouseover ul.tags li': 'showTooltip',
            'mouseout ul.tags li': 'hideTooltip',
            'click input[type="checkbox"]': 'toggleList'
        };
        _super.call(this, opts);
        this.templates = opts.templates;
        this.listenTo(this.model, 'change:selected', this.render);
    }
    RowView.prototype.render = function () {
        var data = this.model.toJSON();
        if (data.tags) {
            (data.tags).sort(function (a, b) {
                return a.slug.localeCompare(b.slug);
            });
            data.tags = _.map(data.tags, function (tag) {
                var before = tag.color;
                tag.color = {
                    background: before,
                    border: c.darken(before, { val: 20, type: '%' })
                };
                return tag;
            });
        }
        var time = moment(data.timestamp);
        _.extend(data, {
            timeAgo: time.fromNow(),
            prettyDate: time.format()
        });
        $(this.el).html(this.templates.row(data));
        $(this.el)[(data.selected) ? 'addClass' : 'removeClass']('selected');
        return this;
    };
    RowView.prototype.showTooltip = function (ev) {
        var target;
        var id = (target = $(ev.target).closest('li')).data('model');
        var tag;
        if (tag = t.tags.get(id)) {
            if (!this.tooltip || this.tooltip.id !== id) {
                if (this.tooltip && this.tooltip.el)
                    this.tooltip.el.remove();
                var tooltip;
                target.append(tooltip = $(this.templates.tooltip({ text: tag.name })));
                this.tooltip = {
                    id: id,
                    el: tooltip
                };
            }
        }
    };
    RowView.prototype.hideTooltip = function () {
        if (this.tooltip && this.tooltip.el) {
            this.tooltip.el.remove();
            delete this.tooltip.id;
        }
    };
    RowView.prototype.toggleList = function (ev) {
        m.mediator.trigger('select:list', {
            key: 'cid',
            value: this.model.cid,
            force: true
        });
    };
    return RowView;
})(Backbone.View);
exports.RowView = RowView;