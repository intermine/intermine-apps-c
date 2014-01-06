var l = require("./models/lists");
var ta = require("./views/table");
var tg = require("./models/tags");
var m = require("./mediator");
var tml = require("../build/templates");
var App = (function () {
    function App(config) {
        this.config = config;
        this.cb = (config.cb == null || typeof (config.cb) !== 'function') ? function (err, working, list) {
            throw 'Provide your own `cb` function';
        } : config.cb;
        if (!config.mine) {
            this.cb('Missing `mine` value in config', null, null);
            return;
        }
        if (!config.token) {
            this.cb('Missing `token` value in config', null, null);
            return;
        }
        this.config = config;
        this.service = new intermine.Service({
            root: config.mine,
            token: config.token,
            errorHandler: this.cb
        });
    }
    App.prototype.render = function (target) {
        var _this = this;
        this.cb(null, true, null);
        m.mediator.on('submit:list', function (list) {
            _this.cb(null, false, list.toJSON());
        }, this);
        if (_.isObject(this.config.provided)) {
            if (_.isArray(this.config.provided.hidden)) {
                tg.tags.hidden = this.config.provided.hidden;
            }
            if (_.isString(this.config.provided.selected)) {
                m.mediator.trigger('select:list', {
                    key: 'name',
                    value: this.config.provided.selected,
                    force: false
                });
            }
        }
        this.service.fetchLists(function (data) {
            var table = new ta.TableView({
                collection: l.lists,
                config: _this.config,
                templates: tml
            });
            data.forEach(function (item) {
                var list = new l.List(item);
                l.lists.add(list);
            });
            m.mediator.trigger('added:tags');
            $(target).html((table.render()).el);
            _this.cb(null, false, null);
        });
    };
    return App;
})();
module.exports = App;