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
    root.require.register('es/src/app.js', function(exports, require, module) {
    
      var App, Label, Notification, Results, Search, State, query, results, search, state;
      
      search = can.compute(null);
      
      query = can.compute('');
      
      query.bind('change', function(ev, q, oldQ) {
        var _base;
        if (!q) {
          return;
        }
        state.initSearch();
        return typeof (_base = search()) === "function" ? _base(q, function(err, hits) {
          var total;
          if (err) {
            return state.badRequest(err);
          }
          if (!(total = hits.total)) {
            return state.noResults();
          }
          return state.hasResults(total, hits.hits);
        }) : void 0;
      });
      
      results = new can.Map({
        'total': 0,
        'docs': []
      });
      
      State = can.Map.extend({
        'alert': {
          'show': false,
          'type': 'default'
        },
        initSearch: function() {
          this.attr({
            'alert': {
              'show': true,
              'text': 'Searching &hellip;',
              'type': 'default'
            }
          });
          return results.attr({
            'total': 0
          });
        },
        badRequest: function(text) {
          if (text == null) {
            text = 'Error';
          }
          this.attr({
            'alert': {
              'show': true,
              'type': 'warning',
              text: text
            }
          });
          return results.attr({
            'total': 0
          });
        },
        noResults: function() {
          this.attr({
            'alert': {
              'show': true,
              'text': 'No results found',
              'type': 'default'
            }
          });
          return results.attr({
            'total': 0
          });
        },
        hasResults: function(total, docs) {
          this.attr({
            'alert': {
              'show': true,
              'text': "Found " + total + " results",
              'type': 'success'
            }
          });
          return results.attr({
            total: total,
            docs: docs
          });
        }
      });
      
      state = new State({
        'alert': {
          'show': true,
          'text': 'Search ready'
        }
      });
      
      Notification = can.Component.extend({
        tag: 'notification',
        template: require('./templates/notification'),
        events: {
          'a.close click': function() {
            return state.attr({
              'alert': {
                'show': false
              }
            });
          }
        }
      });
      
      Search = can.Component.extend({
        tag: 'search',
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
        tag: 'label',
        template: require('./templates/label')
      });
      
      Results = can.Component.extend({
        tag: 'results',
        template: require('./templates/results'),
        scope: {
          more: function(doc, source, evt) {}
        },
        helpers: {
          round: function(score) {
            return Math.round(100 * score());
          },
          type: function(score) {
            if (score() > 0.5) {
              return 'success';
            } else {
              return 'secondary';
            }
          },
          ago: function(published) {
            var day, month, year, _ref;
            _ref = published(), year = _ref.year, month = _ref.month, day = _ref.day;
            return moment([year, month, day].join(' ')).fromNow();
          },
          date: function(published) {
            var day, month, year, _ref;
            _ref = published(), day = _ref.day, month = _ref.month, year = _ref.year;
            return [day, month, year].join(' ');
          }
        }
      });
      
      App = can.Component.extend({
        tag: 'app',
        scope: function() {
          return {
            state: state,
            results: results
          };
        }
      });
      
      module.exports = function(opts) {
        var layout;
        search((function() {
          var client, index, service, type;
          service = opts.service, index = opts.index, type = opts.type;
          client = new $.es.Client({
            'hosts': service
          });
          return function(query, cb) {
            return client.search({
              index: index,
              type: type,
              'body': {
                'query': {
                  'match': {
                    '_all': query
                  }
                }
              }
            }).then(function(res) {
              var body, e;
              if (!/2../.test(res.status.status)) {
                return cb('Error');
              }
              try {
                body = JSON.parse(res.body);
              } catch (_error) {
                e = _error;
                return cb('Malformed response');
              }
              return cb(null, body.hits);
            });
          };
        })());
        layout = require('./templates/layout');
        $(opts.el).html(can.view.mustache(layout));
        return query('vaccine');
      };
      
    });

    
    // breadcrumbs.mustache
    root.require.register('es/src/templates/breadcrumbs.js', function(exports, require, module) {
    
      module.exports = ["<nav class=\"ink-navigation\">","    <ul class=\"breadcrumbs\">","        <li><a>Start</a></li>","        <li><a>Level 1</a></li>","        <li><a>Level 2</a></li>","        <li class=\"current\"><a>Current item</a></li>","    </ul>","</nav>"].join("\n");
    });

    
    // label.mustache
    root.require.register('es/src/templates/label.js', function(exports, require, module) {
    
      module.exports = ["<span class=\"{{ type }} label\">{{ text }}</span>"].join("\n");
    });

    
    // layout.mustache
    root.require.register('es/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = ["<app>","    <div class=\"box\">","        <h2>ElasticSearch</h2>","        <p>An example app searching a backend service.</p>","        <breadcrumbs></breadcrumbs>","        <search></search>","        <notification></notification>","        <results></results>","    </div>","</app>"].join("\n");
    });

    
    // notification.mustache
    root.require.register('es/src/templates/notification.js', function(exports, require, module) {
    
      module.exports = ["{{ #state.alert.show }}","<div class=\"alert-box {{ state.alert.type }}\">","    <p>{{{ state.alert.text }}}</p>","    <a class=\"close\">&times;</a>","</div>","{{ /state.alert.show }}"].join("\n");
    });

    
    // results.mustache
    root.require.register('es/src/templates/results.js', function(exports, require, module) {
    
      module.exports = ["{{ #results.total }}","<h3>Top Results</h3>","","<ul class=\"results\">","    {{ #results.docs }}","    <li class=\"result\">","        <div class=\"body\">","            <span class=\"{{ type _score }} label\">{{ round _score }}</span>","","            <h4>{{ _source.title }}</h4>","            <ul class=\"authors\">","                {{ #_source.authors }}","                <li>{{ forename }} {{ lastname }}</li>","                {{ /_source.authors }}","            </ul>","","            <div class=\"meta hint--top\" data-hint=\"{{ date _source.issue.published }}\">Published: {{ ago _source.issue.published }}</div>","","            {{ #_source.id.pubmed }}","            <div class=\"meta\">","            PubMed: <a target=\"new\" href=\"http://www.ncbi.nlm.nih.gov/pubmed/{{ _source.id.pubmed }}\">{{ _source.id.pubmed }}</a>","            </div>","            {{ /_source.id.pubmed }}","            ","            {{ #_source.id.doi }}","            <div class=\"meta\">","            DOI: <a target=\"new\" href=\"http://dx.doi.org/{{ _source.id.doi }}\">{{ _source.id.doi }}</a>","            </div>","            {{ /_source.id.doi }}","        </div>","","        {{ #_source.abstract }}","        <div class=\"preview\">","            {{ _source.abstract }}","        </div>","        {{ /_source.abstract }}","    </li>","    {{ /results.docs }}","</ul>","{{ /results.total }}"].join("\n");
    });

    
    // search.mustache
    root.require.register('es/src/templates/search.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"row collapse\">","    <div class=\"large-10 columns\">","        <input type=\"text\" placeholder=\"Query...\" value=\"{{ query.value }}\">","    </div>","    <div class=\"large-2 columns\">","        <a class=\"button secondary postfix\">Search</a>","    </div>","</div>"].join("\n");
    });
  })();

  // Return the main app.
  var main = root.require("es/src/app.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("es", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["es"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("es/src/app.js", "es/index.js");
  
})();