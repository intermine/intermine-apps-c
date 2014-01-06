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
    
    
    // index.js
    root.require.register('choose-list/src/index.js', function(exports, require, module) {
    
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
    });

    
    // mediator.coffee
    root.require.register('choose-list/src/mediator.js', function(exports, require, module) {
    
      exports.mediator = _.extend({}, Backbone.Events);
      
    });

    
    // lists.js
    root.require.register('choose-list/src/models/lists.js', function(exports, require, module) {
    
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
    });

    
    // paginator.js
    root.require.register('choose-list/src/models/paginator.js', function(exports, require, module) {
    
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
    });

    
    // sort.js
    root.require.register('choose-list/src/models/sort.js', function(exports, require, module) {
    
      var __extends = this.__extends || function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
          function __() { this.constructor = d; }
          __.prototype = b.prototype;
          d.prototype = new __();
      };
      var SortedCollection = (function (_super) {
          __extends(SortedCollection, _super);
          function SortedCollection() {
              _super.apply(this, arguments);
          }
          Object.defineProperty(SortedCollection.prototype, "sortOrder", {
              set: function (value) {
                  this._sortOrder = (this._sortOrder) ? this._sortOrder : {};
                  if (!_(this._sortOrder).isEqual(value)) {
                      for (var key in value) {
                          if (typeof (value[key]) == 'object')
                              throw 'Not cool!';
                          this._sortOrder[key] = value[key];
                      }
                      this.eachCache = function () {
                          this.eachCache = (this.models).sort(function (a, b) {
                              var keyA = a[value.key], keyB = b[value.key];
                              if (typeof (keyA) !== typeof (keyB)) {
                                  throw 'Key value types do not match';
                              }
                              switch (typeof (keyA)) {
                                  case 'string':
                                      return value.direction * keyA.localeCompare(keyB);
                                  case 'number':
                                      return value.direction * (keyA - keyB);
                                  case 'object':
                                      if (keyA instanceof Date) {
                                          return value.direction * (+keyA - +keyB);
                                      }
                                  default:
                                      throw 'Do not know how to sort on key `' + value.key + '`';
                              }
                          });
                      };
                  }
              },
              enumerable: true,
              configurable: true
          });
          SortedCollection.prototype.forEach = function (cb) {
              if (typeof (this.eachCache) == 'function')
                  (this.eachCache)();
              (this.eachCache).forEach(function (model, index, array) {
                  cb(model, index, array);
              });
          };
          SortedCollection.prototype.add = function (obj, opts) {
              if (!opts) {
                  opts = { sort: false };
              } else {
                  opts.sort = false;
              }
              Backbone.Collection['prototype'].add.call(this, obj, opts);
          };
          SortedCollection.prototype.toJSON = function () {
              var out = [];
              this.forEach(function (model) {
                  out.push(model.toJSON());
              });
              return out;
          };
          return SortedCollection;
      })(Backbone.Collection);
      exports.SortedCollection = SortedCollection;
    });

    
    // tags.js
    root.require.register('choose-list/src/models/tags.js', function(exports, require, module) {
    
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
    });

    
    // colorize.js
    root.require.register('choose-list/src/utils/colorize.js', function(exports, require, module) {
    
      var m = require("../mediator");
      var Colorize = (function () {
          function Colorize() {
              this.scheme = 'Paired';
              this.map = {};
              m.mediator.on('added:tags', this.run, this);
          }
          Colorize.prototype.add = function (key) {
              if (_.isUndefined(this.map[key])) {
                  this.map[key] = null;
              }
          };
          Colorize.prototype.get = function (key) {
              var color;
              if (_.isUndefined(color = this.map[key])) {
                  return '#FFF';
              } else {
                  return color;
              }
          };
          Colorize.prototype.run = function () {
              var _this = this;
              var min = +Infinity, max = -Infinity;
              _.forEach(_.keys(colorbrewer[this.scheme]), function (el) {
                  var value = parseInt(el);
                  if (value > max)
                      max = value;
                  if (value < min)
                      min = value;
              });
              if (min == +Infinity || max == -Infinity)
                  return;
              var keys = _.keys(this.map), size = keys.length, count = max;
              if (size >= min && size < max)
                  count = size;
              var vectors = [];
              for (var i = 0; i < size; i++) {
                  var vector = [];
                  for (var j = 0; j < size; j++) {
                      vector.push(distance(keys[i], keys[j]));
                  }
                  vectors.push(vector);
              }
              var clusters = clusterfck.kmeans(vectors, count);
              clusters.forEach(function (cluster, i) {
                  cluster.forEach(function (a) {
                      for (var j = 0; j < vectors.length; j++) {
                          var b = vectors[j];
                          if (arraysEqual(a, b))
                              break;
                      }
                      (_this).map[keys[j]] = colorbrewer[_this.scheme][count][i];
                      vectors.splice(j, 1);
                      keys.splice(j, 1);
                  });
              });
          };
          return Colorize;
      })();
      exports.Colorize = Colorize;
      var distance = _.memoize(function (a, b) {
          return (new Levenshtein(a, b)).distance;
      }, function () {
          var a = arguments[0];
          var b = arguments[1];
          if (a.localeCompare(b) === 1) {
              return a + ":" + b;
          } else {
              return b + ":" + a;
          }
      });
      var arraysEqual = function (a, b) {
          return !(a < b || b < a);
      };
      exports.colorize = new Colorize();
    });

    
    // colors.js
    root.require.register('choose-list/src/utils/colors.js', function(exports, require, module) {
    
      var rgbaToHex = function (rgba) {
          var componentToHex = function (c) {
              var hex = c.toString(16);
              return hex.length == 1 ? "0" + hex : hex;
          };
          return "#" + componentToHex(rgba.r) + componentToHex(rgba.g) + componentToHex(rgba.b);
      };
      var hexToRgba = function (hex) {
          if (hex[0] == '#')
              hex = hex.slice(1);
          var bigint = parseInt(hex, 16), r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
          return { r: r, g: g, b: b, a: 1 };
      };
      var hslaToRgba = function (hsla) {
          var hue = function (h) {
              if (h < 0)
                  ++h;
              if (h > 1)
                  --h;
              if (h * 6 < 1)
                  return m1 + (m2 - m1) * h * 6;
              if (h * 2 < 1)
                  return m2;
              if (h * 3 < 2)
                  return m1 + (m2 - m1) * (2 / 3 - h) * 6;
              return m1;
          };
          var h = hsla.h / 360, s = hsla.s / 100, l = hsla.l / 100, a = hsla.a;
          var m2 = l <= .5 ? l * (s + 1) : l + s - l * s, m1 = l * 2 - m2;
          var r = Math.round(hue(h + 1 / 3) * 0xff), g = Math.round(hue(h) * 0xff), b = Math.round(hue(h - 1 / 3) * 0xff);
          return { r: r, g: g, b: b, a: a };
      };
      var rgbaToHsla = function (rgba) {
          var r = rgba.r / 255, g = rgba.g / 255, b = rgba.b / 255, a = rgba.a;
          var min = Math.min(r, g, b), max = Math.max(r, g, b), l = (max + min) / 2, d = max - min, h, s;
          switch (max) {
              case min:
                  h = 0;
                  break;
              case r:
                  h = 60 * (g - b) / d;
                  break;
              case g:
                  h = 60 * (b - r) / d + 120;
                  break;
              case b:
                  h = 60 * (r - g) / d + 240;
                  break;
          }
          if (max == min) {
              s = 0;
          } else if (l < .5) {
              s = d / (2 * l);
          } else {
              s = d / (2 - 2 * l);
          }
          h %= 360;
          s *= 100;
          l *= 100;
          return { h: h, s: s, l: l, a: a };
      };
      exports.darken = function (hex, amount) {
          var hsl = rgbaToHsla(hexToRgba(hex));
          var prop = 'l';
          var val = -amount.val;
          if ('%' == amount.type) {
              val = 'l' == prop && val > 0 ? (100 - hsl[prop]) * val / 100 : hsl[prop] * (val / 100);
          }
          hsl[prop] += val;
          return rgbaToHex(hslaToRgba(hsl));
      };
    });

    
    // slugify.coffee
    root.require.register('choose-list/src/utils/slugify.js', function(exports, require, module) {
    
      module.exports = function(text) {
        return text.toLowerCase().replace(RegExp(" ", "g"), "-").replace(/[^\w-]+/g, "");
      };
      
    });

    
    // disposable.js
    root.require.register('choose-list/src/views/disposable.js', function(exports, require, module) {
    
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
    });

    
    // paginator.js
    root.require.register('choose-list/src/views/paginator.js', function(exports, require, module) {
    
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
    });

    
    // row.js
    root.require.register('choose-list/src/views/row.js', function(exports, require, module) {
    
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
    });

    
    // table.js
    root.require.register('choose-list/src/views/table.js', function(exports, require, module) {
    
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
    });

    
    // tags.js
    root.require.register('choose-list/src/views/tags.js', function(exports, require, module) {
    
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
    });

    
    // templates.js
    root.require.register('choose-list/build/templates.js', function(exports, require, module) {
    
      
      var t = {
        'pagination' : new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<ul class=\"pagination\">");_.b("\n" + i);if(_.s(_.f("pages",c,p,1),c,p,0,38,135,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("        <li");if(_.s(_.f("isCurrent",c,p,1),c,p,0,64,80,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" class=\"current\"");});c.pop();}_.b(" data-page=\"");_.b(_.v(_.d(".",c,p,0)));_.b("\"><a>");_.b(_.v(_.d(".",c,p,0)));_.b("</a></li>");_.b("\n");});c.pop();}_.b("    <!--");_.b("\n" + i);_.b("    <li class=\"arrow unavailable\"><a>&laquo;</a></li>");_.b("\n" + i);_.b("    <li class=\"current\"><a href=\"\">1</a></li>");_.b("\n" + i);_.b("    <li class=\"unavailable\"><a>&hellip;</a></li>");_.b("\n" + i);_.b("    <li class=\"arrow\"><a>&raquo;</a></li>");_.b("\n" + i);_.b("    -->");_.b("\n" + i);_.b("</ul>");return _.fl();;}),
        'row' : new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<td><input type=\"checkbox\" ");if(_.s(_.f("selected",c,p,1),c,p,0,40,57,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("checked=\"checked\"");});c.pop();}_.b("/></td>");_.b("\n" + i);_.b("<td>");_.b("\n" + i);_.b("    <ul class=\"tags\">");_.b("\n" + i);if(_.s(_.f("tags",c,p,1),c,p,0,122,445,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("            <li data-model=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-slug=\"");_.b(_.v(_.f("slug",c,p,0)));_.b("\">");_.b("\n" + i);_.b("                <span class=\"color\" style=\"");_.b("\n" + i);if(_.s(_.f("color",c,p,1),c,p,0,255,382,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("                        background-color:");_.b(_.v(_.f("background",c,p,0)));_.b(";");_.b("\n" + i);_.b("                        border-color:");_.b(_.v(_.f("border",c,p,0)));_.b(";");_.b("\n");});c.pop();}_.b("                \"></span>");_.b("\n" + i);_.b("            </li>");_.b("\n");});c.pop();}_.b("    </ul>");_.b("\n" + i);_.b("    <span class=\"title\">");_.b(_.v(_.f("name",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("    <span class=\"description\">");_.b(_.v(_.f("description",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("</td>");_.b("\n" + i);_.b("<td><span class=\"created\" title=\"");_.b(_.v(_.f("prettyDate",c,p,0)));_.b("\">");_.b(_.v(_.f("timeAgo",c,p,0)));_.b("</span></td>");return _.fl();;}),
        'table' : new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"row\">");_.b("\n" + i);_.b("    <div class=\"large-4 columns\" data-view=\"tags\"></div>");_.b("\n" + i);_.b("    <div class=\"large-8 columns\">");_.b("\n" + i);_.b("        <table>");_.b("\n" + i);_.b("            <thead>");_.b("\n" + i);_.b("                <tr>");_.b("\n" + i);_.b("                    <th class=\"minimal\"></th>");_.b("\n" + i);_.b("                    <th data-sort=\"title\"><a>Title</a></th>");_.b("\n" + i);_.b("                    <th class=\"minimal\" data-sort=\"timestamp\"><a>Created</a></th>");_.b("\n" + i);_.b("                </tr>");_.b("\n" + i);_.b("            </thead>");_.b("\n" + i);_.b("            <tbody data-view=\"rows\"></tbody>");_.b("\n" + i);_.b("        </table>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"pagination-centered\" data-view=\"pagination\"></div>");_.b("\n" + i);_.b("\n" + i);_.b("        <div class=\"row\">");_.b("\n" + i);_.b("            <div class=\"large-12 columns\">");_.b("\n" + i);_.b("                <button id=\"submit\" class=\"disabled\">Submit</button>");_.b("\n" + i);_.b("            </div>");_.b("\n" + i);_.b("        </div>");_.b("\n" + i);_.b("    </div>");_.b("\n" + i);_.b("</div>");return _.fl();;}),
        'tags' : new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<dl class=\"sub-nav\">");_.b("\n" + i);_.b("    <dt>Select tags:</dt>");_.b("\n" + i);_.b("    <dd");if(_.s(_.f("allActive",c,p,1),c,p,0,68,83,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" class=\"active\"");});c.pop();}_.b(" data-filter=\"all\"><a>All</a></dd>");_.b("\n" + i);_.b("    <dd");if(_.s(_.f("allInactive",c,p,1),c,p,0,155,170,"{{ }}")){_.rs(c,p,function(c,p,_){_.b(" class=\"active\"");});c.pop();}_.b(" data-filter=\"none\"><a>None</a></dd>");_.b("\n" + i);_.b("</dl>");_.b("\n" + i);_.b("\n" + i);_.b("<ul class=\"side-nav\">");_.b("\n" + i);if(_.s(_.f("tags",c,p,1),c,p,0,261,573,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("    <li class=\"");if(_.s(_.f("active",c,p,1),c,p,0,288,294,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("active");});c.pop();}_.b("\" data-model=\"");_.b(_.v(_.f("id",c,p,0)));_.b("\" data-slug=\"");_.b(_.v(_.f("slug",c,p,0)));_.b("\">");_.b("\n" + i);_.b("        <span class=\"color\" style=\"");_.b("\n" + i);if(_.s(_.f("color",c,p,1),c,p,0,407,510,"{{ }}")){_.rs(c,p,function(c,p,_){_.b("                background-color:");_.b(_.v(_.f("background",c,p,0)));_.b(";");_.b("\n" + i);_.b("                border-color:");_.b(_.v(_.f("border",c,p,0)));_.b(";");_.b("\n");});c.pop();}_.b("        \"></span>");_.b("\n" + i);_.b("        <a>");_.b(_.v(_.f("name",c,p,0)));_.b("</a>");_.b("\n" + i);_.b("    </li>");_.b("\n");});c.pop();}_.b("</ul>");return _.fl();;}),
        'tooltip' : new Hogan.Template(function(c,p,i){var _=this;_.b(i=i||"");_.b("<div class=\"tooltip\" >");_.b("\n" + i);_.b("    <span class=\"text\">");_.b(_.v(_.f("text",c,p,0)));_.b("</span>");_.b("\n" + i);_.b("    <span class=\"nub\"></span>");_.b("\n" + i);_.b("</div>");return _.fl();;})
      },
      r = function(n) {
        var tn = t[n];
        return function(c, p, i) {
          return tn.render(c, p || t, i);
        };
      };
      module.exports = {
        'pagination' : r('pagination'),
        'row' : r('row'),
        'table' : r('table'),
        'tags' : r('tags'),
        'tooltip' : r('tooltip')
      };
    });
  })();

  // Return the main app.
  var main = root.require("choose-list/src/index.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("choose-list", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["choose-list"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("choose-list/src/index.js", "choose-list/index.js");
  
})();