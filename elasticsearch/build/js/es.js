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
    
      var App, Notification, Results, Search, State, query, req, results, state;
      
      req = can.compute(null);
      
      query = can.compute('');
      
      query.bind('change', function(ev, q, oldQ) {
        var _ref;
        if (!q) {
          return;
        }
        state.initSearch();
        return (_ref = req()) != null ? _ref.query(ejs.QueryStringQuery(q)).doSearch(function(res) {
          var docs, total;
          if (!(total = res.hits.total)) {
            return state.noResults();
          }
          docs = _.map(res.hits.hits, '_source');
          return state.hasResults(total, docs);
        }, function(obj, type, text) {
          return state.badRequest(text);
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
      
      Results = can.Component.extend({
        tag: 'results',
        template: require('./templates/results'),
        scope: {
          more: function(doc, source, evt) {
            var key, value;
            key = $(evt.target).data('key');
            value = doc.attr(key);
            return console.log(key, value);
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
        ejs.client = ejs.jQueryClient(opts.service);
        req(ejs.Request({
          'indices': opts.index,
          'types': opts.type
        }));
        layout = require('./templates/layout');
        $(opts.el).html(can.view.mustache(layout));
        return query('new* OR age:>35');
      };
      
    });

    
    // breadcrumbs.mustache
    root.require.register('es/src/templates/breadcrumbs.js', function(exports, require, module) {
    
      module.exports = ["<nav class=\"ink-navigation\">","    <ul class=\"breadcrumbs\">","        <li><a>Start</a></li>","        <li><a>Level 1</a></li>","        <li><a>Level 2</a></li>","        <li class=\"current\"><a>Current item</a></li>","    </ul>","</nav>"].join("\n");
    });

    
    // layout.mustache
    root.require.register('es/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = ["<app>","    <div class=\"box\">","        <h2>ElasticSearch</h2>","        <p>An example app searching a backend service.</p>","        <breadcrumbs></breadcrumbs>","        <search></search>","        <notification></notification>","        <results></results>","    </div>","</app>"].join("\n");
    });

    
    // notification.mustache
    root.require.register('es/src/templates/notification.js', function(exports, require, module) {
    
      module.exports = ["{{ #state.alert.show }}","<div class=\"alert-box {{ state.alert.type }}\">","    {{{ state.alert.text }}}","    <a class=\"close\">&times;</a>","</div>","{{ /state.alert.show }}"].join("\n");
    });

    
    // results.mustache
    root.require.register('es/src/templates/results.js', function(exports, require, module) {
    
      module.exports = ["{{ #results.total }}","<h3>Top Results</h3>","","<table>","    <thead>","        <tr>","            <th>Name</th>","            <th>Age</th>","            <th>Company</th>","            <th>Email</th>","            <th>Address</th>","        </tr>","    </thead>","    <tbody>","        {{ #results.docs }}","        <tr can-click=\"more\">","            <td data-key=\"name\">{{ name }}</td>","            <td data-key=\"age\">{{ age }}</td>","            <td data-key=\"company\">{{ company }}</td>","            <td data-key=\"email\">{{ email }}</td>","            <td data-key=\"address\">{{ address }}</td>","        </tr>","        {{ /results.docs }}","    </tbody>","</table>","{{ /results.total }}"].join("\n");
    });

    
    // search.mustache
    root.require.register('es/src/templates/search.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"row collapse\">","    <div class=\"large-10 columns\">","        <input type=\"text\" placeholder=\"Query...\" value=\"{{ query.value }}\">","    </div>","    <div class=\"large-2 columns\">","        <a class=\"button postfix\">Search</a>","    </div>","</div>"].join("\n");
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