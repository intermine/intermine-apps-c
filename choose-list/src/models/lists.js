var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var s = require("./sort");
var p = require("./paginator");
var t = require("./tags");
var m = require("../mediator");
var Lists = (function (_super) {
    __extends(Lists, _super);
    function Lists() {
        _super.apply(this, arguments);
    }
    Lists.prototype.initialize = function () {
        var _this = this;
        this.sortOrder = { key: 'timestamp', direction: -1 };
        this.paginator = new p.Paginator({ perPage: 10 });
        this.paginator.bind('change', function () {
            _this.trigger('change');
        }, this);
        m.mediator.on('select:list', function (obj) {
            if (obj.force) {
                _this.filter(function (list) {
                    if (list[obj.key] !== obj.value && list.selected)
                        list.selected = false;
                    return false;
                });
            }
            var flipper = function (list) {
                if (list[obj.key] === obj.value) {
                    list.selected = !list.selected;
                    m.mediator.trigger('selected:lists', +list.selected);
                    return true;
                }
                return false;
            };
            if (!_this.find(flipper)) {
                _this.bind('add', function (list) {
                    if (flipper(list))
                        this.off('add');
                }, _this);
            }
        }, this);
    };
    Lists.prototype.forEach = function (cb) {
        var _this = this;
        var skipped = 0;
        this.paginator.reset();
        var start = this.paginator.perPage * (this.paginator.currentPage - 1);
        s.SortedCollection['prototype'].forEach.call(this, function (list, i) {
            if (!list.isActive()) {
                skipped += 1;
            } else {
                _this.paginator.size += 1;
                i -= skipped;
                if (i >= start && _this.paginator.returned != _this.paginator.perPage) {
                    cb(list, _this.paginator.returned, _this);
                    _this.paginator.returned += 1;
                }
            }
        });
    };
    return Lists;
})(s.SortedCollection);
exports.Lists = Lists;
var List = (function (_super) {
    __extends(List, _super);
    function List(list) {
        _super.call(this);
        for (var key in list) {
            switch (key) {
                case 'tags':
                    this.tags = _.map(list.tags, function (name) {
                        return t.tags.add({ name: name });
                    });
                    break;
                default:
                    this[key] = list[key];
            }
        }
    }
    Object.defineProperty(List.prototype, "timestamp", {
        get: function () {
            return this.get('timestamp');
        },
        set: function (value) {
            this.set('timestamp', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "description", {
        get: function () {
            return this.get('description');
        },
        set: function (value) {
            this.set('description', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "name", {
        get: function () {
            return this.get('name');
        },
        set: function (value) {
            this.set('name', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "size", {
        get: function () {
            return this.get('size');
        },
        set: function (value) {
            this.set('size', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "status", {
        get: function () {
            return this.get('status');
        },
        set: function (value) {
            this.set('status', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "type", {
        get: function () {
            return this.get('type');
        },
        set: function (value) {
            this.set('type', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "selected", {
        get: function () {
            return this.get('selected');
        },
        set: function (value) {
            this.set('selected', value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(List.prototype, "tags", {
        get: function () {
            return _.map(this.get('tags'), function (cid) {
                return (t.tags).get(cid);
            });
        },
        set: function (value) {
            this.set('tags', _.map(value, function (tag) {
                return tag.cid;
            }));
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.toJSON = function () {
        var _this = this;
        return _.extend(Backbone.Model['prototype'].toJSON.call(this), (function () {
            return { tags: new Backbone.Collection(_this.tags).toJSON() };
        })());
    };
    List.prototype.isActive = function () {
        if (!this.tags.length)
            return true;
        for (var i = 0; i < this.tags.length; i++) {
            if (this.tags[i].active)
                return true;
        }
        return false;
    };
    return List;
})(Backbone.Model);
exports.List = List;
exports.lists = new Lists();