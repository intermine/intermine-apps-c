var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var c = require("../utils/colorize");
var slugify = require("../utils/slugify");
var Tag = (function (_super) {
    __extends(Tag, _super);
    function Tag(obj) {
        _super.call(this);
        this.name = obj.name;
        this.active = obj.active;
        this.count = 1;
    }
    Object.defineProperty(Tag.prototype, "name", {
        get: function () {
            return this.get('name');
        },
        set: function (value) {
            if (value.match(/^im:/)) {
                value = value.replace(/^im:/, '');
                this.set('im', true);
            }
            this.set({
                slug: slugify(value),
                name: value
            });
            c.colorize.add(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tag.prototype, "slug", {
        get: function () {
            return this.get('slug');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tag.prototype, "im", {
        get: function () {
            return this.get('im') || false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tag.prototype, "count", {
        get: function () {
            return this.get('count');
        },
        set: function (value) {
            this.set('count', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tag.prototype, "active", {
        get: function () {
            return this.get('active');
        },
        set: function (value) {
            this.set('active', value);
        },
        enumerable: true,
        configurable: true
    });
    Tag.prototype.isName = function (name) {
        return name.replace(/^im:/, '') === this.name;
    };
    Tag.prototype.toJSON = function () {
        return _.extend(Backbone.Model['prototype'].toJSON.call(this), {
            id: this.cid,
            color: c.colorize.get(this.name)
        });
    };
    return Tag;
})(Backbone.Model);
exports.Tag = Tag;
var Tags = (function (_super) {
    __extends(Tags, _super);
    function Tags() {
        _super.apply(this, arguments);
    }
    Tags.prototype.initialize = function () {
        this.hidden = [];
    };
    Tags.prototype.comparator = function (tag) {
        return -tag.count;
    };
    Tags.prototype.add = function (obj) {
        var tag;
        if (tag = this.find(function (item) {
            return item.isName(obj.name);
        })) {
            tag.count += 1;
        } else {
            obj.active = this.hidden.indexOf(obj.name) == -1;
            tag = new Tag(obj);
            Backbone.Collection['prototype'].add.call(this, tag);
        }
        return tag;
    };
    Tags.prototype.getActive = function () {
        return _(this.filter(function (tag) {
            return tag.active;
        }));
    };
    Tags.prototype.every = function (property, all) {
        return _(this.models).every(function (tag) {
            return tag[property] === all;
        });
    };
    Tags.prototype.setAll = function (property, value) {
        var obj = {};
        obj[property] = value;
        var changed = false;
        this.forEach(function (tag) {
            if (changed || tag[property] !== value) {
                changed = true;
                tag.set(obj, { silent: true });
            }
        });
        if (changed)
            this.trigger('change');
    };
    return Tags;
})(Backbone.Collection);
exports.Tags = Tags;
exports.tags = new Tags();