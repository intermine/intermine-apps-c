(function() {
  /**
   * Require the given path.
   *
   * @param {String} path
   * @return {Object} exports
   * @api public
   */
  var require = function(path, parent, orig) {
    var resolved = require.resolve(path);

    // lookup failed
    if (null === resolved) {
      orig = orig || path;
      parent = parent || 'root';
      var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
      err.path = orig;
      err.parent = parent;
      err.require = true;
      throw err;
    }

    var module = require.modules[resolved];

    // perform real require()
    // by invoking the module's
    // registered function
    if (!module._resolving && !module.exports) {
      var mod = {};
      mod.exports = {};
      mod.client = mod.component = true;
      module._resolving = true;
      module.call(this, mod.exports, require.relative(resolved), mod);
      delete module._resolving;
      module.exports = mod.exports;
    }

    return module.exports;
  };

  /**
   * Registered modules.
   */

  require.modules = {};

  /**
   * Registered aliases.
   */

  require.aliases = {};

  /**
   * Resolve `path`.
   *
   * Lookup:
   *
   *   - PATH/index.js
   *   - PATH.js
   *   - PATH
   *
   * @param {String} path
   * @return {String} path or null
   * @api private
   */

  require.resolve = function(path) {
    if (path.charAt(0) === '/') path = path.slice(1);

    var paths = [
      path,
      path + '.js',
      path + '.json',
      path + '/index.js',
      path + '/index.json'
    ];

    for (var i = 0; i < paths.length; i++) {
      path = paths[i];
      if (require.modules.hasOwnProperty(path)) return path;
      if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
    }
  };

  /**
   * Normalize `path` relative to the current path.
   *
   * @param {String} curr
   * @param {String} path
   * @return {String}
   * @api private
   */

  require.normalize = function(curr, path) {
    var segs = [];

    if ('.' != path.charAt(0)) return path;

    curr = curr.split('/');
    path = path.split('/');

    for (var i = 0; i < path.length; ++i) {
      if ('..' == path[i]) {
        curr.pop();
      } else if ('.' !== path[i] && '' !== path[i]) {
        segs.push(path[i]);
      }
    }

    return curr.concat(segs).join('/');
  };

  /**
   * Register module at `path` with callback `definition`.
   *
   * @param {String} path
   * @param {Function} definition
   * @api private
   */

  require.register = function(path, definition) {
    require.modules[path] = definition;
  };

  /**
   * Alias a module definition.
   *
   * @param {String} from
   * @param {String} to
   * @api private
   */

  require.alias = function(from, to) {
    if (!require.modules.hasOwnProperty(from)) {
      throw new Error('Failed to alias "' + from + '", it does not exist');
    }
    require.aliases[to] = from;
  };

  /**
   * Return a require function relative to the `parent` path.
   *
   * @param {String} parent
   * @return {Function}
   * @api private
   */

  require.relative = function(parent) {
    var p = require.normalize(parent, '..');

    /**
     * lastIndexOf helper.
     */

    function lastIndexOf(arr, obj) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === obj) return i;
      }
      return -1;
    }

    /**
     * The relative require() itself.
     */

    var localRequire = function(path) {
      var resolved = localRequire.resolve(path);
      return require(resolved, parent, path);
    };

    /**
     * Resolve relative to the parent.
     */

    localRequire.resolve = function(path) {
      var c = path.charAt(0);
      if ('/' == c) return path.slice(1);
      if ('.' == c) return require.normalize(p, path);

      // resolve deps by returning
      // the dep in the nearest "deps"
      // directory
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    };

    /**
     * Check if module is defined at `path`.
     */
    localRequire.exists = function(path) {
      return require.modules.hasOwnProperty(localRequire.resolve(path));
    };

    return localRequire;
  };

  // Global on server, window in browser.
  var root = this;

  // Do we already have require loader?
  root.require = (typeof root.require !== 'undefined') ? root.require : require;

  // All our modules will use global require.
  (function() {
    
    
    // app.coffee
    root.require.register('em/src/app.js', function(exports, require, module) {
    
      var Routing, components, ejs, helpers, query, render, results, state;
      
      results = require('./modules/results');
      
      state = require('./modules/state');
      
      ejs = require('./modules/ejs');
      
      query = require('./modules/query');
      
      render = require('./modules/render');
      
      helpers = require('./modules/helpers');
      
      components = ['document', 'label', 'results', 'search', 'state', 'more'];
      
      Routing = can.Control({
        init: function() {
          var layout, name, _i, _len;
          for (_i = 0, _len = components.length; _i < _len; _i++) {
            name = components[_i];
            require("./components/" + name);
          }
          layout = require('./templates/layout');
          return this.element.html(render(layout, helpers));
        },
        route: function() {
          var template;
          template = require('./templates/page/index');
          return this.render(template, {}, 'ElasticMed');
        },
        'doc/:oid route': function(_arg) {
          var doc, docs, fin, oid,
            _this = this;
          oid = _arg.oid;
          fin = function(doc) {
            var template, title;
            template = require('./templates/page/detail');
            if (!doc) {
              return _this.render(template, {}, 'ElasticMed');
            }
            if (_.isObject(title = doc.attr('title'))) {
              title = title.value;
            }
            return _this.render(template, doc, "" + title + " - ElasticMed");
          };
          doc = null;
          if ((docs = results.attr('docs')).length) {
            docs.each(function(obj) {
              if (doc) {
                return;
              }
              if (obj.attr('oid') === oid) {
                return doc = obj;
              }
            });
          }
          if (doc) {
            return fin(doc);
          }
          return ejs.get(oid, function(err, doc) {
            if (err) {
              state.error(err.message);
            }
            return fin(doc);
          });
        },
        render: function(template, ctx, title) {
          this.element.find('.content').html(render(template, ctx));
          return document.title = title;
        }
      });
      
      module.exports = function(opts) {
        var index, service, type;
        service = opts.service, index = opts.index, type = opts.type;
        ejs.attr({
          index: index,
          type: type,
          'client': new $.es.Client({
            'hosts': service
          })
        });
        new Routing(opts.el);
        can.route.ready();
        if (can.route.current('')) {
          return query.attr('current', opts.query || '');
        }
      };
      
    });

    
    // document.coffee
    root.require.register('em/src/components/document.js', function(exports, require, module) {
    
      var query;
      
      query = require('../modules/query');
      
      module.exports = can.Component.extend({
        tag: 'app-document',
        template: require('../templates/document'),
        scope: {
          linkToDetail: '@',
          showKeywords: '@'
        },
        events: {
          '.keywords li a click': function(el, evt) {
            query.attr('current', el.text());
            return location.hash = can.route.url('');
          }
        },
        helpers: {
          ago: function(published) {
            var day, month, year, _ref;
            _ref = published(), year = _ref.year, month = _ref.month, day = _ref.day;
            return moment([year, month, day].join(' ')).fromNow();
          },
          date: function(published) {
            var day, month, year, _ref;
            _ref = published(), day = _ref.day, month = _ref.month, year = _ref.year;
            return [day, month, year].join(' ');
          },
          isPublished: function(published, opts) {
            var day, month, stamp, year, _ref;
            _ref = published(), day = _ref.day, month = _ref.month, year = _ref.year;
            stamp = +moment([day, month, year].join(' '));
            if ((stamp || Infinity) > +(new Date)) {
              return opts.inverse(this);
            }
            return opts.fn(this);
          },
          author: function(ctx) {
            var collective;
            if (collective = ctx.collectivename) {
              return collective;
            }
            return ctx.forename + ' ' + ctx.lastname;
          },
          highlight: function(field) {
            var highlighted, snip, text, _i, _len, _ref;
            field = field();
            if (!_.isObject(field)) {
              return field;
            }
            if (!field.highlights.length) {
              return field.value;
            }
            _ref = field.highlights;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              snip = _ref[_i];
              text = snip.replace(/<\/?em>/g, '');
              highlighted = field.value.replace(text, snip);
            }
            return highlighted;
          },
          hint: function(text, length) {
            var i, word, words, _i, _len, _ref;
            if ((text = text()) < length) {
              return text;
            }
            _ref = (words = text.split(' '));
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
              word = _ref[i];
              length -= word.length;
              if (!(length > 0)) {
                return words.slice(0, +i + 1 || 9e9).join(' ') + ' ...';
              }
            }
          }
        }
      });
      
    });

    
    // label.coffee
    root.require.register('em/src/components/label.js', function(exports, require, module) {
    
      var colorize;
      
      colorize = require('../modules/colorize');
      
      module.exports = can.Component.extend({
        tag: 'app-label',
        template: require('../templates/label'),
        helpers: {
          bg: function(score) {
            return colorize(score());
          },
          fg: function(score) {
            var bg, l;
            bg = colorize(score());
            l = d3.hsl(bg).l;
            if (l < 0.5) {
              return 'light';
            } else {
              return 'dark';
            }
          },
          round: function(score) {
            return Math.round(100 * score());
          }
        }
      });
      
    });

    
    // more.coffee
    root.require.register('em/src/components/more.js', function(exports, require, module) {
    
      var docs, ejs, working;
      
      ejs = require('../modules/ejs');
      
      docs = new can.List([]);
      
      working = can.compute(false);
      
      module.exports = can.Component.extend({
        tag: 'app-more',
        template: require('../templates/more'),
        scope: function(obj, parent, element) {
          working(true);
          docs.replace([]);
          ejs.more(parent.attr('oid'), function(err, list) {
            working(false);
            if (err) {
              return;
            }
            return docs.replace(list);
          });
          return {
            docs: docs
          };
        },
        helpers: {
          isWorking: function(opts) {
            if (working()) {
              return opts.fn(this);
            } else {
              return opts.inverse(this);
            }
          }
        }
      });
      
    });

    
    // results.coffee
    root.require.register('em/src/components/results.js', function(exports, require, module) {
    
      var results;
      
      results = require('../modules/results');
      
      module.exports = can.Component.extend({
        tag: 'app-results',
        template: require('../templates/results'),
        scope: function(obj, parent, element) {
          var docs;
          if ((docs = parent.attr('docs'))) {
            return {
              docs: docs
            };
          } else {
            return results;
          }
        }
      });
      
    });

    
    // search.coffee
    root.require.register('em/src/components/search.js', function(exports, require, module) {
    
      var autocomplete, ejs, findActive, query, suggest, suggestions;
      
      query = require('../modules/query');
      
      ejs = require('../modules/ejs');
      
      suggestions = new can.Map({
        'px': 0,
        'list': [],
        setList: function(words) {
          return _.map(words, function(_arg, i) {
            var text;
            text = _arg.text;
            return {
              text: text,
              'active': !i
            };
          });
        }
      });
      
      findActive = function(s, i) {
        var active;
        if (!(active = s.active)) {
          return;
        }
        s.attr('active', false);
        return true;
      };
      
      autocomplete = function(word, el) {
        var caret, value;
        value = el.val();
        caret = parseInt(el.prop('selectionStart'));
        value.slice(0, caret).replace(/([^\s]+)$/, function(match, p, offset, string) {
          return caret -= match.length;
        });
        value = value.slice(0, caret) + value.slice(caret).replace(/(^[^\s]+)/, word);
        caret += word.length;
        el.val(value);
        return el[0].setSelectionRange(caret, caret);
      };
      
      suggest = function(el, evt) {
        var caret, key, value, word;
        if (!(value = el.val()).length) {
          return;
        }
        if ((key = evt.keyCode || evt.which) === 13) {
          return query.attr('current', value);
        }
        if (key === 9 || key === 38 || key === 40) {
          return;
        }
        caret = el.prop('selectionStart');
        if (value.slice(Math.max(caret - 1, 0), +caret + 1 || 9e9).match(/^\s+$/)) {
          return suggestions.attr('list', []);
        }
        word = '';
        try {
          word += value.slice(0, caret).match(/([^\s]+)$/)[1];
        } catch (_error) {}
        try {
          word += value.slice(caret).match(/(^[^\s]+)/)[1];
        } catch (_error) {}
        suggestions.attr('px', this.element.find('.faux').text(value.slice(0, caret).replace(/\s/g, "\u00a0")).outerWidth());
        return ejs.suggest(word, function(err, res) {
          var words;
          if (err) {
            return;
          }
          if (!(words = res[word])) {
            return;
          }
          return suggestions.attr('list', words);
        });
      };
      
      module.exports = can.Component.extend({
        tag: 'app-search',
        template: require('../templates/search'),
        scope: function() {
          return {
            query: query,
            suggestions: suggestions
          };
        },
        events: {
          'a.button click': function() {
            return query.attr('current', this.element.find('input').val());
          },
          '.suggestions li mouseover': function(el, evt) {
            var list, text;
            if (!(list = suggestions.list).length) {
              return;
            }
            _.find(list, findActive);
            text = el.find('a').text();
            return _.find(list, function(s, i) {
              if (s.text !== text) {
                return;
              }
              return s.attr('active', true);
            });
          },
          '.suggestions li click': function(el, evt) {
            var input;
            input = this.element.find('input.text');
            autocomplete(el.find('a').text(), input);
            suggestions.attr('list', []);
            return input.focus();
          },
          'input.text keydown': function(el, evt) {
            var arrow, item, key, list, word;
            arrow = function(key) {
              var current, list;
              if (!(list = suggestions.list).length) {
                return;
              }
              switch (key) {
                case 38:
                  current = _.findIndex(list, findActive) || 0;
                  if ((current -= 1) < 0) {
                    current = list.length - 1;
                  }
                  break;
                case 40:
                  current = _.findIndex(list, findActive);
                  if (_.isUndefined(current)) {
                    current = list.length - 1;
                  }
                  if ((current += 1) === list.length) {
                    current = 0;
                  }
              }
              list[current].attr('active', true);
              return evt.preventDefault();
            };
            switch (key = evt.keyCode || evt.which) {
              case 9:
                if (!(list = suggestions.list).length) {
                  return;
                }
                if (!(item = _.find(list, findActive))) {
                  return;
                }
                word = item.text;
                autocomplete(word, el);
                suggestions.attr('list', []);
                return evt.preventDefault();
              case 38:
              case 40:
                return arrow(key);
              case 27:
                suggestions.attr('list', []);
                return el.blur();
            }
          },
          'input.text keyup': suggest,
          'input.text click': suggest,
          '.breadcrumbs a click': function(el) {
            return query.attr('current', el.text());
          }
        }
      });
      
    });

    
    // state.coffee
    root.require.register('em/src/components/state.js', function(exports, require, module) {
    
      var state;
      
      state = require('../modules/state');
      
      module.exports = can.Component.extend({
        tag: 'app-state',
        template: require('../templates/state'),
        scope: function() {
          return state;
        },
        helpers: {
          isLoading: function(opts) {
            if (state.attr('type') === 'load') {
              return opts.fn(this);
            } else {
              return opts.inverse(this);
            }
          }
        }
      });
      
    });

    
    // document.coffee
    root.require.register('em/src/models/document.js', function(exports, require, module) {
    
      var Document, db,
        __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
      
      db = window.localStorage;
      
      module.exports = Document = can.Model.extend({});
      
      Document.List = Document.List.extend({
        dbName: 'elastic-med',
        keys: null,
        init: function(docs, load) {
          var doc, item, key, _i, _j, _len, _len1, _ref, _ref1,
            _this = this;
          if (load == null) {
            load = false;
          }
          item = db.getItem(this.dbName);
          this.keys = (item && item.split(',')) || [];
          if (load && this.keys.length) {
            _ref = this.keys;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              key = _ref[_i];
              this.push(JSON.parse(db.getItem("" + this.dbName + "-" + key)));
            }
          } else {
            for (_j = 0, _len1 = docs.length; _j < _len1; _j++) {
              doc = docs[_j];
              db.setItem("" + this.dbName + "-" + doc.oid, JSON.stringify(doc));
              if (_ref1 = doc.oid, __indexOf.call(this.keys, _ref1) < 0) {
                this.keys.push(doc.oid);
              }
            }
            db.setItem(this.dbName, this.keys.join(','));
          }
          return window.onbeforeunload = function() {
            _this.destroy();
            return null;
          };
        },
        destroy: function() {
          var key, _i, _len, _ref;
          _ref = this.keys;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            db.removeItem("" + this.dbName + "-" + key);
          }
          db.removeItem(this.dbName);
          this.keys = [];
          return this;
        }
      });
      
    });

    
    // colorize.coffee
    root.require.register('em/src/modules/colorize.js', function(exports, require, module) {
    
      var colors, max, min;
      
      colors = colorbrewer.YlOrRd[9];
      
      min = 0.2;
      
      max = 2.5;
      
      module.exports = (function() {
        var fn;
        fn = d3.scale.linear().domain(d3.range(min, max, (max - min) / (colors.length - 1))).range(colors);
        return _.memoize(function(score) {
          return fn(Math.max(min, Math.min(max, score)));
        });
      })();
      
    });

    
    // ejs.coffee
    root.require.register('em/src/modules/ejs.js', function(exports, require, module) {
    
      var cache;
      
      cache = new SimpleLRU(50);
      
      module.exports = new can.Map({
        client: null,
        index: null,
        type: null,
        size: 10,
        search: function(query, cb) {
          if (!this.client) {
            return cb('Client is not setup');
          }
          return this.client.search({
            index: this.index,
            type: this.type,
            'body': {
              size: this.size,
              'query': {
                'multi_match': {
                  query: query,
                  'fields': ['title^2', 'keywords^2', 'abstract']
                }
              },
              'highlight': {
                'fields': {
                  'title': {},
                  'abstract': {}
                }
              }
            }
          }).then(function(res) {
            var body, docs, e;
            try {
              body = JSON.parse(res.body);
            } catch (_error) {
              e = _error;
              return cb('Malformed response');
            }
            docs = _.map(body.hits.hits, function(_arg) {
              var highlight, key, value, _id, _score, _source;
              _score = _arg._score, _id = _arg._id, _source = _arg._source, highlight = _arg.highlight;
              _source.score = _score;
              _source.oid = _id;
              for (key in _source) {
                value = _source[key];
                if (key === 'title' || key === 'abstract') {
                  _source[key] = {
                    value: value,
                    'highlights': (highlight != null ? highlight[key] : void 0) || []
                  };
                }
              }
              return _source;
            });
            return cb(null, {
              docs: docs,
              'total': body.hits.total
            });
          }, cb);
        },
        get: function(id, cb) {
          if (!this.client) {
            return cb('Client is not setup');
          }
          return this.client.get({
            index: this.index,
            type: this.type,
            id: id
          }).then(function(res) {
            var body, e;
            try {
              body = JSON.parse(res.body);
            } catch (_error) {
              e = _error;
              return cb('Malformed response');
            }
            return cb(null, new can.Map(_.extend(body._source, {
              'oid': body._id
            })));
          }, cb);
        },
        suggest: function(text, cb) {
          var body, value;
          if (!this.client) {
            return cb('Client is not setup');
          }
          if (value = cache.get(text)) {
            return cb(null, value);
          }
          body = {
            'completion': {
              text: text,
              'term': {
                'field': 'title'
              }
            }
          };
          return this.client.suggest({
            index: this.index,
            body: body
          }).then(function(res) {
            var e, map, options, _i, _len, _ref, _ref1;
            try {
              body = JSON.parse(res.body);
            } catch (_error) {
              e = _error;
              return cb('Malformed response');
            }
            map = {};
            _ref = body.completion;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _ref1 = _ref[_i], text = _ref1.text, options = _ref1.options;
              map[text] = options;
            }
            cache.set(text, map);
            return cb(null, map);
          }, cb);
        },
        more: function(id, cb) {
          if (!this.client) {
            return cb('Client is not setup');
          }
          return this.client.mlt({
            index: this.index,
            type: this.type,
            id: id,
            'mlt_fields': 'title',
            'percentTermsToMatch': 0.1
          }).then(function(res) {
            var body, e;
            try {
              body = JSON.parse(res.body);
            } catch (_error) {
              e = _error;
              return cb('Malformed response');
            }
            return cb(null, _.map(body.hits.hits, function(_arg) {
              var _id, _score, _source;
              _id = _arg._id, _score = _arg._score, _source = _arg._source;
              _source.oid = _id;
              _source.score = _score;
              return _source;
            }));
          }, cb);
        }
      });
      
    });

    
    // helpers.coffee
    root.require.register('em/src/modules/helpers.js', function(exports, require, module) {
    
      var ifs, link;
      
      exports.link = link = function(oid) {
        if (!oid) {
          return '#!';
        }
        return can.route.url({
          'oid': oid()
        });
      };
      
      exports.ifs = ifs = function(value, opts) {
        if (_.isFunction(value)) {
          value = value();
        }
        if (value === 'true') {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      };
      
      Mustache.registerHelper('link', link);
      
      Mustache.registerHelper('ifs', ifs);
      
    });

    
    // query.coffee
    root.require.register('em/src/modules/query.js', function(exports, require, module) {
    
      var ejs, query, state;
      
      ejs = require('./ejs');
      
      state = require('./state');
      
      query = new can.Map({
        'current': '',
        'history': []
      });
      
      query.bind('current', function(ev, q) {
        var history;
        (history = this.history.slice(0, 2)).splice(0, 0, q);
        this.attr('history', history);
        state.loading();
        return ejs.search(q, function(err, _arg) {
          var docs, total;
          total = _arg.total, docs = _arg.docs;
          if (err) {
            return state.error(err);
          }
          if (!total) {
            return state.noResults();
          }
          return state.hasResults(total, docs);
        });
      });
      
      module.exports = query;
      
    });

    
    // render.coffee
    root.require.register('em/src/modules/render.js', function(exports, require, module) {
    
      module.exports = function(template, ctx) {
        if (ctx == null) {
          ctx = {};
        }
        return can.view.mustache(template)(ctx);
      };
      
    });

    
    // results.coffee
    root.require.register('em/src/modules/results.js', function(exports, require, module) {
    
      var Document;
      
      Document = require('../models/document');
      
      module.exports = new can.Map({
        'total': 0,
        'docs': new Document.List([], true),
        clear: function() {
          var _ref;
          if ((_ref = this.docs) != null) {
            _ref.destroy();
          }
          this.attr({
            'total': 0,
            'docs': null
          });
          return this;
        }
      });
      
    });

    
    // state.coffee
    root.require.register('em/src/modules/state.js', function(exports, require, module) {
    
      var Document, State, ejs, init, results, state;
      
      results = require('./results');
      
      ejs = require('./ejs');
      
      Document = require('../models/document');
      
      init = {
        'text': 'Search ready',
        'type': 'info'
      };
      
      State = can.Map.extend({
        loading: function() {
          state.attr({
            'text': 'Searching',
            'type': 'load'
          });
          return results.clear();
        },
        hasResults: function(total, docs) {
          state.attr({
            'type': 'info',
            'text': (function() {
              if (total > ejs.size) {
                return "Top results out of " + total + " matches";
              } else {
                if (total === 1) {
                  return '1 Result';
                } else {
                  return "" + total + " Results";
                }
              }
            })()
          });
          return results.attr({
            total: total,
            'docs': new Document.List(docs)
          });
        },
        noResults: function() {
          state.attr({
            'text': 'No results found',
            'type': 'info'
          });
          return results.clear();
        },
        error: function(err) {
          var text;
          text = 'Error';
          switch (false) {
            case !_.isString(err):
              text = err;
              break;
            case !(_.isObject(err) && err.message):
              text = err.message;
          }
          state.attr({
            text: text,
            'type': 'error'
          });
          return results.clear();
        }
      });
      
      module.exports = state = new State(init);
      
      can.route.bind('route', function() {
        if (state.type === 'error') {
          return state.attr(init);
        }
      });
      
    });

    
    // document.mustache
    root.require.register('em/src/templates/document.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"body\">","    <div class=\"title\">","        <app-label></app-label>","        <h4 class=\"highlight\">{{{ highlight title }}}</h4>","    </div>","","    <ul class=\"authors\">","        {{ #authors }}","        {{ #if affiliation }}","        <li><span class=\"hint--top\" data-hint=\"{{ hint affiliation 30 }}\">{{ author this }}</span></li>","        {{ else }}","        <li>{{ author this }}</li>","        {{ /if }}","        {{ /authors }}","    </ul>","","    <em class=\"journal\">in {{ journal }}</em>","","    {{ #isPublished issue.published }}","    <div class=\"meta hint--top\" data-hint=\"{{ date issue.published }}\">Published {{ ago issue.published }}</div>","    {{ else }}","    <div class=\"meta\">In print</div>","    {{ /isPublished }}","","    {{ #id.pubmed }}","    <div class=\"meta\">","    PubMed: <a target=\"{{ id.pubmed }}\" href=\"http://www.ncbi.nlm.nih.gov/pubmed/{{ id.pubmed }}\">{{ id.pubmed }}</a>","    </div>","    {{ /id.pubmed }}","    ","    {{ #id.doi }}","    <div class=\"meta\">","    DOI: <a target=\"{{ id.doi }}\" href=\"http://dx.doi.org/{{ id.doi }}\">{{ id.doi }}</a>","    </div>","    {{ /id.doi }}","","    {{ #ifs showKeywords }}","    <ul class=\"keywords\">","    {{ #keywords }}","        <li><a><span class=\"secondary label\">{{ . }}</span></a></li>","    {{ /keywords }}","    </ul>","    {{ /ifs }}","</div>","","{{ #ifs linkToDetail }}","<a class=\"preview\" href=\"{{ link oid }}\">","    <div class=\"abstract highlight\">","        {{{ highlight abstract }}}","        <div class=\"fa fa-eye\"></div>","    </div>","</a>","{{ else }}","<div class=\"abstract highlight\">","    {{{ highlight abstract }}}","</div>","{{ /ifs }}"].join("\n");
    });

    
    // label.mustache
    root.require.register('em/src/templates/label.js', function(exports, require, module) {
    
      module.exports = ["{{ #score }}","<span class=\"score {{ fg score }}\" style=\"background-color:{{ bg score }}\">{{ round score }}</span>","{{ /score }}"].join("\n");
    });

    
    // layout.mustache
    root.require.register('em/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"box\">","    <h2><a href=\"{{ link null }}\">ElasticMed</a></h2>","    <div class=\"content\"></div>","</div>"].join("\n");
    });

    
    // more.mustache
    root.require.register('em/src/templates/more.js', function(exports, require, module) {
    
      module.exports = ["{{ #isWorking }}","<h5>Looking for similar documents <span class=\"fa fa-spinner\"></span></h5>","{{ /isWorking }}","","{{ #if docs.length }}","<h4>Similar documents</h4>","<app-results></app-results>","{{ /if }}"].join("\n");
    });

    
    // detail.mustache
    root.require.register('em/src/templates/page/detail.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"page detail\">","    <app-state></app-state>","    {{ #oid }}","    <div class=\"document detail\">","        <app-document link-to-detail=\"false\" show-keywords=\"true\"></app-document>","    </div>","    <app-more></app-more>","    {{ /oid }}","<div>"].join("\n");
    });

    
    // index.mustache
    root.require.register('em/src/templates/page/index.js', function(exports, require, module) {
    
      module.exports = ["<p>ElasticSearch through a collection of cancer related publications from PubMed. Use <kbd>Tab</kbd> to autocomplete or <kbd>Enter</kbd> to search.</p>","<div class=\"page index\">","    <app-search></app-search>","    <app-state></app-state>","    <app-results></app-results>","</div>"].join("\n");
    });

    
    // results.mustache
    root.require.register('em/src/templates/results.js', function(exports, require, module) {
    
      module.exports = ["{{ #if docs.length }}","<ul class=\"results\">","    {{ #docs }}","    <li class=\"document result\">","        <app-document link-to-detail=\"true\" show-keywords=\"false\"></app-document>","    </li>","    {{ /docs }}","</ul>","{{ /if }}"].join("\n");
    });

    
    // search.mustache
    root.require.register('em/src/templates/search.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"row collapse\">","    <div class=\"large-10 columns search\">","        <div class=\"faux\"></div>","        <input class=\"text\" type=\"text\" maxlength=\"100\" placeholder=\"Query...\" value=\"{{ query.current }}\" autofocus>","        {{ #if suggestions.list.length }}","        <ul class=\"f-dropdown suggestions\" style=\"left:{{ suggestions.px }}px\">","        {{ #suggestions.list }}","            <li {{ #active }}class=\"active\"{{ /active }}>","                <a>{{ text }}</a>","            </li>","        {{ /suggestions.list }}","        </ul>","        {{ /if }}","    </div>","    <div class=\"large-2 columns\">","        <a class=\"button secondary postfix\">","            <span class=\"fa fa-search\"></span> Search","        </a>","    </div>","</div>","{{ #if query.history.length }}","<div class=\"row collapse\">","    <h4>History</h4>","    <ul class=\"breadcrumbs\">","    {{ #query.history }}","        <li><a>{{ . }}</a></li>","    {{ /query.history }}","</div>","{{ /if }}"].join("\n");
    });

    
    // state.mustache
    root.require.register('em/src/templates/state.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"state\">","    <h3 class=\"{{ type }}\">{{ text }}</h3>","    {{ #isLoading }}","    <span class=\"fa fa-spinner spinner\"></span>","    {{ /isLoading }}","</div>"].join("\n");
    });
  })();

  // Return the main app.
  var main = root.require("em/src/app.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("em", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["em"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("em/src/app.js", "em/index.js");
  
})();