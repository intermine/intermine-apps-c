// A standalone CommonJS loader.
(function(root) {
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
    if (!resolved) {
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

  // Do we already have require loader?
  root.require = (typeof root.require !== 'undefined') ? root.require : require;

})(this);
// Concat modules and export them as an app.
(function(root) {

  // All our modules will use global require.
  (function() {
    
    // app.coffee
    root.require.register('ps/src/app.js', function(exports, require, module) {
    
      var components, imjs, layout, query, render;
      
      render = require('./modules/render');
      
      query = require('./modules/query');
      
      imjs = require('./modules/imjs');
      
      layout = require('./templates/layout');
      
      components = ['search', 'table'];
      
      module.exports = function(opts) {
        var name, q, _i, _len;
        for (_i = 0, _len = components.length; _i < _len; _i++) {
          name = components[_i];
          require("./components/" + name);
        }
        imjs.attr({
          'client': new intermine.Service({
            'root': opts.mine
          })
        });
        $(opts.el).html(render(layout));
        if (q = opts.symbol) {
          return query(q);
        }
      };
      
    });

    // search.coffee
    root.require.register('ps/src/components/search.js', function(exports, require, module) {
    
      var query;
      
      query = require('../modules/query');
      
      module.exports = can.Component.extend({
        tag: 'app-search',
        template: require('../templates/search'),
        scope: function() {
          return {
            'query': {
              'value': query
            }
          };
        }
      });
      
    });

    // table.coffee
    root.require.register('ps/src/components/table.js', function(exports, require, module) {
    
      var pubs;
      
      pubs = require('../modules/pubs');
      
      module.exports = can.Component.extend({
        tag: 'app-table',
        template: require('../templates/table'),
        scope: function() {
          return {
            pubs: pubs
          };
        }
      });
      
    });

    // imjs.coffee
    root.require.register('ps/src/modules/imjs.js', function(exports, require, module) {
    
      var query;
      
      query = {
        'select': ['Gene.publications.title', 'Gene.publications.year', 'Gene.publications.journal', 'Gene.publications.pubMedId', 'Gene.publications.authors.name'],
        'orderBy': [
          {
            'Gene.publications.firstAuthor': 'ASC'
          }
        ],
        'joins': ['Gene.publications.authors']
      };
      
      module.exports = new can.Map({
        client: null,
        search: function(symbol, cb) {
          if (!this.client) {
            return cb('Client is not setup');
          }
          return this.client.query(_.extend({}, query, {
            'where': [
              {
                'path': 'Gene.symbol',
                'op': 'CONTAINS',
                'code': 'A',
                'value': symbol
              }
            ]
          }), function(err, q) {
            if (err) {
              return cb(err);
            }
            return q.tableRows(function(err, res) {
              if (err) {
                return cb(err);
              }
              return console.log(res);
            });
          });
        }
      });
      
    });

    // pubs.coffee
    root.require.register('ps/src/modules/pubs.js', function(exports, require, module) {
    
      module.exports = new can.List([]);
      
    });

    // query.coffee
    root.require.register('ps/src/modules/query.js', function(exports, require, module) {
    
      var imjs, pubs, query;
      
      pubs = require('./pubs');
      
      imjs = require('./imjs');
      
      query = can.compute('');
      
      query.bind('change', function(ev, q) {
        return imjs.search('brca', function(err, res) {
          if (err) {
      
          }
        });
      });
      
      module.exports = query;
      
    });

    // render.coffee
    root.require.register('ps/src/modules/render.js', function(exports, require, module) {
    
      module.exports = function(template, ctx) {
        if (ctx == null) {
          ctx = {};
        }
        return can.view.mustache(template)(ctx);
      };
      
    });

    // layout.mustache
    root.require.register('ps/src/templates/layout.js', function(exports, require, module) {
    
      module.exports = ["<div class=\"row collapse\">","    <div class=\"small-2 columns\">","        <span class=\"prefix\">Search:</span>","    </div>","    <div class=\"small-10 columns\">","        <app-search></app-search>","    </div>","</div>","","<div class=\"row collapse\">","    <div class=\"small-12 columns\">","        <app-table></app-table>","    </div>","</div>"].join("\n");
    });

    // search.mustache
    root.require.register('ps/src/templates/search.js', function(exports, require, module) {
    
      module.exports = ["<input type=\"text\" placeholder=\"Brca\" value=\"{{ query.value }}\" autofocus>"].join("\n");
    });

    // table.mustache
    root.require.register('ps/src/templates/table.js', function(exports, require, module) {
    
      module.exports = ["{{ #if pubs.length }}","<table>","    <thead>","        <tr>","            <th>Title</th>","            <th>Author(s)</th>","            <th>Journal</th>","            <th>Year</th>","        </tr>","    </thead>","    <tbody>","    {{ #pubs }}","        <tr>","            <td>{{ title }}</td>","            <td>","            {{ #authors }}","                <span class=\"author\">{{ . }}</span>","            {{ /authors }}","            </td>","            <td>{{ journal }}</td>","            <td>{{ year }}</td>","        </tr>","    {{ /pubs }}","    </tbody>","</table>","{{ /if }}"].join("\n");
    });
  })();

  // Return the main app.
  var main = root.require("ps/src/app.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("ps", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["ps"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("ps/src/app.js", "ps/index.js");
  

})(this);