var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var m = require("../mediator");
var c = require("../utils/colors");
var TagsView = (function (_super) {
    __extends(TagsView, _super);
    function TagsView(opts) {
        this.events = {
            'click ul.side-nav li': 'toggleTag',
            'click dl.sub-nav dd': 'toggleFilter'
        };
        _super.call(this, opts);
        this.template = opts.template;
        m.mediator.on('change:tags', this.render, this);
    }
    TagsView.prototype.render = function () {
        var _this = this;
        $(this.el).html(this.template({
            tags: _.map((this.collection).toJSON(), function (tag) {
                var before = tag.color;
                tag.color = {
                    background: before,
                    border: c.darken(before, { val: 20, type: '%' })
                };
                return tag;
            }),
            allActive: function () {
                return _this.collection.every('active', true);
            },
            allInactive: function () {
                return _this.collection.every('active', false);
            }
        }));
        return this;
    };
    TagsView.prototype.toggleTag = function (evt) {
        var cid = $(evt.target).closest('li').data('model');
        (this.collection).find(function (tag) {
            if (tag.cid == cid) {
                tag.active = !tag.active;
                return true;
            }
            return false;
        });
        m.mediator.trigger('change:tags');
    };
    TagsView.prototype.toggleFilter = function (evt) {
        switch ($(evt.target).closest('dd').data('filter')) {
            case 'all':
                this.collection.setAll('active', true);
                break;
            case 'none':
                this.collection.setAll('active', false);
                break;
            default:
                throw 'Unknown filter';
        }
        m.mediator.trigger('change:tags');
    };
    return TagsView;
})(Backbone.View);
exports.TagsView = TagsView;