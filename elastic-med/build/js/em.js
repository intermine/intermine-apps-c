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
    
      var App, Document, Label, Results, Routing, Search, State, Title, colorize, colors, ejs, link, max, min, query, results, state;
      
      colors = colorbrewer.YlOrRd[9];
      
      min = 0.2;
      
      max = 2.5;
      
      colorize = (function() {
        var fn;
        fn = d3.scale.linear().domain(d3.range(min, max, (max - min) / (colors.length - 1))).range(colors);
        return _.memoize(function(score) {
          return fn(Math.max(min, Math.min(max, score)));
        });
      })();
      
      ejs = new can.Map({
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
        }
      });
      
      query = can.compute('');
      
      query.bind('change', function(ev, q) {
        if (!q) {
          return;
        }
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
      
      results = new can.Map({
        'total': 0,
        'docs': []
      });
      
      State = can.Map.extend({
        loading: function() {
          state.attr('text', 'Loading results &hellip;');
          return results.attr('total', 0);
        },
        hasResults: function(total, docs) {
          if (total > ejs.attr('size')) {
            state.attr('text', "Top results out of " + total + " matches");
          } else {
            if (total === 1) {
              state.attr('text', '1 Result');
            } else {
              state.attr('text', "" + total + " Results");
            }
          }
          return results.attr('total', total).attr('docs', docs);
        },
        noResults: function() {
          state.attr('text', 'No results found');
          return results.attr('total', 0);
        },
        error: function(err) {
          var text;
          text = 'Error';
          switch (false) {
            case !_.isString(err):
              text = err;
              break;
            case !_.isObject(err && err.message):
              text = err.message;
          }
          state.attr('text', text);
          return results.attr('total', 0);
        }
      });
      
      state = new State({
        'text': 'Search ready'
      });
      
      link = function(oid) {
        if (!oid) {
          return '#!';
        }
        return can.route.url({
          'oid': oid()
        });
      };
      
      Search = can.Component.extend({
        tag: 'app-search',
        template: require('./templates/search'),
        scope: function() {
          return {
            'query': {
              'value': query
            }
          };
        },
        events: {
          'a.button click': function() {
            return query(this.element.find('input').val());
          },
          'input keyup': function(el, evt) {
            if ((evt.keyCode || evt.which) === 13) {
              return query(el.val());
            }
          }
        }
      });
      
      Label = can.Component.extend({
        tag: 'app-label',
        template: require('./templates/label'),
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
      
      Document = can.Component.extend({
        tag: 'app-document',
        template: require('./templates/document'),
        scope: {
          showAbstract: '@',
          showKeywords: false
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
            var snip, text, _i, _len, _ref;
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
              field.value = field.value.replace(text, snip);
            }
            return field.value;
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
          },
          link: link
        }
      });
      
      Title = can.Component.extend({
        tag: 'app-title',
        template: require('./templates/title'),
        scope: function() {
          return state;
        }
      });
      
      Results = can.Component.extend({
        tag: 'app-results',
        template: require('./templates/results'),
        scope: function() {
          return results;
        }
      });
      
      App = can.Component.extend({
        tag: 'app',
        helpers: {
          link: link
        }
      });
      
      Routing = can.Control({
        route: function() {
          var template;
          template = require('./templates/page-index');
          return this.element.html(can.view.mustache(template));
        },
        'doc/:oid route': function(_arg) {
          var doc, docs, oid, template,
            _this = this;
          oid = _arg.oid;
          template = require('./templates/page-doc');
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
            return this.element.html(can.view.mustache(template)(doc));
          }
          state.loading();
          return ejs.get(oid, function(err, doc) {
            if (err) {
              return state.error(err);
            }
            return _this.element.html(can.view.mustache(template)(doc));
          });
        }
      });
      
      module.exports = function(opts) {
        var el, index, layout, service, type;
        service = opts.service, index = opts.index, type = opts.type;
        ejs.attr({
          index: index,
          type: type,
          'client': new $.es.Client({
            'hosts': service
          })
        });
        layout = require('./templates/layout');
        (el = $(opts.el)).html(can.view.mustache(layout));
        new Routing(el.find('.page-content'));
        can.route.ready();
        if (can.route.current('')) {
          return query(opts.query || '');
        }
      };
      
    });

    
    // breadcrumbs.mustache
    root.require.register('em/src/templates/breadcrumbs.js', function(exports, require, module) {
    
      module.exports = ["<nav class=\"ink-navigation\">","    <ul class=\"breadcrumbs\">","        <li><a>Start</a></li>","        <li><a>Level 1</a></li>","        <li><a>Level 2</a></li>","        <li class=\"current\"><a>Current item</a></li>","    </ul>","</nav>"].join("\n");
    });

    
    // document.mustache
    root.require.register('em/src/templates/document.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"body\">","    <div class=\"title\">","        <app-label></app-label>","        <h4 class=\"highlight\">{{{ highlight title }}}</h4>","    </div>","","    <ul class=\"authors\">","        {{ #authors }}","        {{ #if affiliation }}","        <li><span class=\"hint--top\" data-hint=\"{{ hint affiliation 30 }}\">{{ author this }}</span></li>","        {{ else }}","        <li>{{ author this }}</li>","        {{ /if }}","        {{ /authors }}","    </ul>","","    <em class=\"journal\">in {{ journal }}</em>","","    {{ #isPublished issue.published }}","    <div class=\"meta hint--top\" data-hint=\"{{ date issue.published }}\">Published {{ ago issue.published }}</div>","    {{ else }}","    <div class=\"meta\">In print</div>","    {{ /isPublished }}","","    {{ #id.pubmed }}","    <div class=\"meta\">","    PubMed: <a target=\"new\" href=\"http://www.ncbi.nlm.nih.gov/pubmed/{{ id.pubmed }}\">{{ id.pubmed }}</a>","    </div>","    {{ /id.pubmed }}","    ","    {{ #id.doi }}","    <div class=\"meta\">","    DOI: <a target=\"new\" href=\"http://dx.doi.org/{{ id.doi }}\">{{ id.doi }}</a>","    </div>","    {{ /id.doi }}","</div>","","<code>\"{{ showAbstract }}\"</code>","","{{ #abstract }}","<a class=\"preview\" href=\"{{ link oid }}\">","    <div class=\"abstract highlight\">","        {{{ highlight abstract }}}","        <div class=\"fa fa-eye\"></div>","    </div>","</a>","{{ /abstract }}"].join("\n");
    });

    
    // label.mustache
    root.require.register('em/src/templates/label.js', function(exports, require, module) {
    
      module.exports = ["{{ #score }}","<span class=\"score {{ fg score }}\" style=\"background-color:{{ bg score }}\">{{ round score }}</span>","{{ /score }}"].join("\n");
    });

    
    // layout.mustache
    root.require.register('em/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = ["<app>","    <div class=\"box\">","        <h2><a href=\"{{ link null }}\">ElasticMed</a></h2>","        <p>An example app searching through an example collection of cancer related publications.</p>","        <div class=\"page-content\"></div>","    </div>","</app>"].join("\n");
    });

    
    // notification.mustache
    root.require.register('em/src/templates/notification.js', function(exports, require, module) {
    
      module.exports = ["{{ #state.alert.show }}","<div class=\"alert-box {{ state.alert.type }}\">","    <p>{{{ state.alert.text }}}</p>","    <a class=\"close\">&times;</a>","</div>","{{ /state.alert.show }}"].join("\n");
    });

    
    // page-doc.mustache
    root.require.register('em/src/templates/page-doc.js', function(exports, require, module) {
    
      module.exports = ["<app-title></app-title>","<div class=\"document detail\">","    <app-document></app-document>","</div>"].join("\n");
    });

    
    // page-index.mustache
    root.require.register('em/src/templates/page-index.js', function(exports, require, module) {
    
      module.exports = ["<app-search></app-search>","<app-title></app-title>","<app-results></app-results>"].join("\n");
    });

    
    // results.mustache
    root.require.register('em/src/templates/results.js', function(exports, require, module) {
    
      module.exports = ["{{ #total }}","<ul class=\"results\">","    {{ #docs }}","    <li class=\"document result\">","        <app-document showAbstract=\"test\"></app-document>","    </li>","    {{ /docs }}","</ul>","{{ /total }}"].join("\n");
    });

    
    // search.mustache
    root.require.register('em/src/templates/search.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"row collapse\">","    <div class=\"large-10 columns\">","        <input type=\"text\" placeholder=\"Query...\" value=\"{{ query.value }}\">","    </div>","    <div class=\"large-2 columns\">","        <a class=\"button secondary postfix\">","            <span class=\"fa fa-search\"></span> Search","        </a>","    </div>","</div>"].join("\n");
    });

    
    // title.mustache
    root.require.register('em/src/templates/title.js', function(exports, require, module) {
    
      module.exports = ["<h3>{{{ text }}}</h3>"].join("\n");
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