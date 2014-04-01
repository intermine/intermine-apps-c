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
    
    
    // main.js
    root.require.register('MultiMine/src/main.js', function(exports, require, module) {
    
      var AppView = require('./views/appview');
      
      var $ = require('./modules/dependencies').$;
      
      module.exports = function(params) {
      
      	var view = new AppView(params);
      	//if ($(params.target).length != 1) throw "Not found";
      	// console.log(params.input);
      	view.setElement($(params.target));
      	view.render();
      
      
      
      }
    });

    
    // FilterListCollection.coffee
    root.require.register('MultiMine/src/models/FilterListCollection.js', function(exports, require, module) {
    
      var FilterListCollection, FilterListItem, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      FilterListItem = require('./FilterListItem');
      
      FilterListCollection = (function(_super) {
        __extends(FilterListCollection, _super);
      
        function FilterListCollection() {
          _ref = FilterListCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListCollection.prototype.model = FilterListItem;
      
        FilterListCollection.prototype.initialize = function() {};
      
        FilterListCollection.prototype.comparator = function(item) {
          return -item.get("count");
        };
      
        FilterListCollection.prototype.toggleAll = function(value) {
          return _.each(this.models, function(model) {
            return model.set({
              enabled: value
            });
          });
        };
      
        return FilterListCollection;
      
      })(Backbone.Collection);
      
      module.exports = FilterListCollection;
      
    });

    
    // FilterListItem.coffee
    root.require.register('MultiMine/src/models/FilterListItem.js', function(exports, require, module) {
    
      var FilterListItem, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterListItem = (function(_super) {
        var unCamelCase;
      
        __extends(FilterListItem, _super);
      
        function FilterListItem() {
          _ref = FilterListItem.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListItem.prototype.defaults = {
          name: "generic",
          type: "not specified",
          enabled: true,
          count: 0,
          displayName: "tbd"
        };
      
        FilterListItem.prototype.initialize = function() {
          mediator.on('filter:togglecategory', this.get("enabled"));
          return this.set({
            displayName: unCamelCase(this.get("name"))
          });
        };
      
        unCamelCase = function(str) {
          return str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3").replace(/^./, function(str) {
            return str.toUpperCase();
          });
        };
      
        FilterListItem.prototype.toggle = function() {
          if (this.get("enabled") === false) {
            this.set({
              enabled: true
            });
          } else {
            this.set({
              enabled: false
            });
          }
          return this.get("enabled");
        };
      
        return FilterListItem;
      
      })(Backbone.Model);
      
      module.exports = FilterListItem;
      
    });

    
    // OrganismCollection.coffee
    root.require.register('MultiMine/src/models/OrganismCollection.js', function(exports, require, module) {
    
      var OrganismCollection, OrganismItem, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      OrganismItem = require('./OrganismItem');
      
      OrganismCollection = (function(_super) {
        __extends(OrganismCollection, _super);
      
        function OrganismCollection() {
          _ref = OrganismCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        OrganismCollection.prototype.model = OrganismItem;
      
        OrganismCollection.prototype.initialize = function() {};
      
        OrganismCollection.prototype.comparator = function(item) {
          return item.get("genus");
        };
      
        OrganismCollection.prototype.toggleAll = function(value) {
          return _.each(this.models, function(model) {
            return model.set({
              enabled: value
            });
          });
        };
      
        return OrganismCollection;
      
      })(Backbone.Collection);
      
      module.exports = OrganismCollection;
      
    });

    
    // OrganismItem.coffee
    root.require.register('MultiMine/src/models/OrganismItem.js', function(exports, require, module) {
    
      var OrganismItem, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      OrganismItem = (function(_super) {
        __extends(OrganismItem, _super);
      
        function OrganismItem() {
          _ref = OrganismItem.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        OrganismItem.prototype.defaults = {
          type: "not specified",
          enabled: true,
          count: 0,
          "class": "not specified",
          genus: "not specified",
          name: "not specified",
          species: "not specified",
          taxonId: "not specified"
        };
      
        OrganismItem.prototype.initialize = function() {
          return mediator.on('filter:togglecategory', this.get("enabled"));
        };
      
        OrganismItem.prototype.toggle = function() {
          if (this.get("enabled") === false) {
            this.set({
              enabled: true
            });
          } else {
            this.set({
              enabled: false
            });
          }
          return this.get("enabled");
        };
      
        return OrganismItem;
      
      })(Backbone.Model);
      
      module.exports = OrganismItem;
      
    });

    
    // ResultModel.coffee
    root.require.register('MultiMine/src/models/ResultModel.js', function(exports, require, module) {
    
      var ResultModel, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      ResultModel = (function(_super) {
        __extends(ResultModel, _super);
      
        function ResultModel() {
          this.toggleVisible = __bind(this.toggleVisible, this);
          this.filter = __bind(this.filter, this);
          _ref = ResultModel.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultModel.prototype.defaults = {
          id: 0,
          mineUrl: "",
          relevance: 0,
          type: "Generic",
          show: true
        };
      
        ResultModel.prototype.initialize = function() {
          var fields;
          fields = this.get("fields");
          if (this.get("relevance") > 1.0) {
            this.set({
              relevance: 1
            });
          }
          return mediator.on('filter:show', this.filter);
        };
      
        ResultModel.prototype.filter = function() {
          return this.toggleVisible();
        };
      
        ResultModel.prototype.toggleVisible = function() {
          return this.set({
            show: !this.get("show")
          });
        };
      
        return ResultModel;
      
      })(Backbone.Model);
      
      module.exports = ResultModel;
      
    });

    
    // ResultTypeCategory.coffee
    root.require.register('MultiMine/src/models/ResultTypeCategory.js', function(exports, require, module) {
    
      var ResultTypeCategory, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      ResultTypeCategory = (function(_super) {
        __extends(ResultTypeCategory, _super);
      
        function ResultTypeCategory() {
          _ref = ResultTypeCategory.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultTypeCategory.prototype.defaults = {
          name: "generic",
          type: "not specified",
          enabled: true,
          count: 0
        };
      
        ResultTypeCategory.prototype.initialize = function() {
          return mediator.on('filter:togglecategory', this.get("enabled"));
        };
      
        ResultTypeCategory.prototype.toggle = function() {
          if (this.get("enabled") === false) {
            this.set({
              enabled: true
            });
          } else {
            this.set({
              enabled: false
            });
          }
          return this.get("enabled");
        };
      
        return ResultTypeCategory;
      
      })(Backbone.Model);
      
      module.exports = ResultTypeCategory;
      
    });

    
    // ResultTypeCollection.coffee
    root.require.register('MultiMine/src/models/ResultTypeCollection.js', function(exports, require, module) {
    
      var ResultTypeCategory, ResultTypeCollection, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      ResultTypeCategory = require('./ResultTypeCategory');
      
      ResultTypeCollection = (function(_super) {
        __extends(ResultTypeCollection, _super);
      
        function ResultTypeCollection() {
          _ref = ResultTypeCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultTypeCollection.prototype.model = ResultTypeCategory;
      
        ResultTypeCollection.prototype.initialize = function() {
          return this.collection.on("add", this.render, this);
        };
      
        ResultTypeCollection.prototype.render = function() {
          var $el, self;
          $el = $(this.el);
          self = this;
          return this.collection.each(function(item) {
            var filter;
            filter = new ResultTypeCategoryView({
              model: item
            });
            return $el.append(filter.render().el);
          });
        };
      
        return ResultTypeCollection;
      
      })(Backbone.Collection);
      
      module.exports = ResultTypeCollection;
      
    });

    
    // ResultsCollection.coffee
    root.require.register('MultiMine/src/models/ResultsCollection.js', function(exports, require, module) {
    
      var ResultModel, ResultsCollection, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
      
      mediator = require("../modules/mediator");
      
      ResultModel = require('./ResultModel');
      
      ResultsCollection = (function(_super) {
        __extends(ResultsCollection, _super);
      
        function ResultsCollection() {
          _ref = ResultsCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultsCollection.prototype.model = ResultModel;
      
        ResultsCollection.prototype.globalFilter = {};
      
        ResultsCollection.prototype.initialize = function() {
          mediator.on("filter:removeGenus", this.filterRemoveGenus, this);
          mediator.on("filter:removeAllGenus", this.filterRemoveAllGenus, this);
          mediator.on("filter:addGenus", this.filterAddGenus, this);
          mediator.on("filter:removeType", this.filterRemoveType, this);
          mediator.on("filter:removeAllTypes", this.filterRemoveAllTypes, this);
          mediator.on("filter:addType", this.filterAddType, this);
          mediator.on("filter:addAllTypes", this.filterAddAllTypes, this);
          return mediator.on("filter:addAllGenus", this.filterAddAllGenus, this);
        };
      
        ResultsCollection.prototype.comparator = function(mod) {
          return -mod.get("relevance");
        };
      
        ResultsCollection.prototype.filterRemoveGenus = function(keypair) {
          delete this.globalFilter.genus[keypair.genus];
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterRemoveAllGenus = function() {
          var prop;
          for (prop in this.globalFilter.genus) {
            delete this.globalFilter.genus[prop];
          }
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddAllTypes = function(value) {
          var key, typeModels;
          typeModels = _.groupBy(this.models, function(item) {
            return item.get("type");
          });
          for (key in typeModels) {
            this.globalFilter.type.push(key);
          }
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterRemoveAllTypes = function(value) {
          this.globalFilter.type = [];
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddType = function(value) {
          this.globalFilter.type.push(value);
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterRemoveType = function(value) {
          this.globalFilter.type = _.without(this.globalFilter.type, value);
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddGenus = function(keypair) {
          var genusModels, model, taxonids, _i, _len, _ref1;
          console.log("filterAddGenus called", keypair.genus);
          taxonids = [];
          genusModels = _.groupBy(this.models, function(item) {
            return item.get("genus");
          });
          _ref1 = genusModels[keypair.genus];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            model = _ref1[_i];
            taxonids.push(model.get("taxonId"));
          }
          this.globalFilter.genus[keypair.genus] = _.uniq(taxonids);
          return this.filterTest();
        };
      
        ResultsCollection.prototype.filterAddAllGenus = function(keypair) {
          var eachGenus, genusModels, model, taxonids, _i, _len, _ref1;
          genusModels = _.groupBy(this.models, function(item) {
            return item.get("genus");
          });
          console.log("genusModels", genusModels);
          for (eachGenus in genusModels) {
            taxonids = [];
            _ref1 = genusModels[eachGenus];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              model = _ref1[_i];
              taxonids.push(model.get("taxonId"));
            }
            this.globalFilter.genus[eachGenus] = _.uniq(taxonids);
          }
          return this.filterTest();
        };
      
        ResultsCollection.prototype.buildFilter = function(filterObj) {
          var genusGroups, genusObj, nextgenus, obj, prop, taxonids, types;
          obj = {};
          types = _.countBy(this.models, function(model) {
            return model.get("type");
          });
          genusGroups = _.groupBy(this.models, function(item) {
            return item.get("genus");
          });
          this.globalFilter.genus = {};
          for (nextgenus in genusGroups) {
            if (nextgenus !== "undefined") {
              taxonids = _.map(genusGroups[nextgenus], function(model) {
                return model.get("taxonId");
              });
              genusObj = {};
              genusObj[nextgenus] = taxonids;
              this.globalFilter.genus[nextgenus] = _.uniq(taxonids);
            }
          }
          return this.globalFilter.type = (function() {
            var _results;
            _results = [];
            for (prop in types) {
              _results.push(prop);
            }
            return _results;
          })();
        };
      
        ResultsCollection.prototype.filterTest = function() {
          var filtered,
            _this = this;
          console.log("filterTest called with object: ", this.globalFilter);
          filtered = this.models.filter(function(model) {
            var _ref1;
            if (_ref1 = model.get("type"), __indexOf.call(_this.globalFilter.type, _ref1) < 0) {
              model.set({
                enabled: false
              });
              return false;
            }
            if ((model.get("genus")) === void 0) {
              model.set({
                enabled: true
              });
              return true;
            }
            if ((model.get("genus")) in _this.globalFilter.genus) {
              model.set({
                enabled: true
              });
              return true;
            } else {
              model.set({
                enabled: false
              });
              return false;
            }
          });
          console.log("filtered", filtered);
          return filtered;
        };
      
        ResultsCollection.prototype.filter = function(filterObj) {
          var filtered;
          console.log("filter called with object: ", filterObj);
          filtered = this.models.filter(function(model) {
            var key, value, _ref1;
            console.log("filtering using", filterObj);
            for (key in filterObj) {
              value = filterObj[key];
              if (_ref1 = model.get(key), __indexOf.call(value, _ref1) < 0) {
                return false;
              }
            }
            return true;
          });
          return filtered;
        };
      
        ResultsCollection.prototype.byType = function(name) {
          var filtered;
          filtered = this.filter(function(model) {
            return model.get("type") !== name;
          });
          return _.each(filtered, function(model) {});
        };
      
        ResultsCollection.prototype.filterType = function(typevalues, organismvalues) {
          var results, that;
          that = this;
          results = this.models.filter(function(model) {
            var fields, org, _ref1, _ref2, _ref3;
            fields = model.get("fields");
            org = model.get("taxonId");
            if (organismvalues.length > 0 && typevalues.length < 1) {
      
            } else if (organismvalues.length < 1 && typevalues.length > 0) {
              return _ref1 = model.get("type"), __indexOf.call(typevalues, _ref1) >= 0;
            } else if (organismvalues.length > 0 && typevalues.length > 0) {
              if (org === void 0) {
                return _ref2 = model.get("type"), __indexOf.call(typevalues, _ref2) >= 0;
              } else {
                return __indexOf.call(organismvalues, org) >= 0 && (_ref3 = model.get("type"), __indexOf.call(typevalues, _ref3) >= 0);
              }
            }
          });
          return results;
        };
      
        return ResultsCollection;
      
      })(Backbone.Collection);
      
      module.exports = ResultsCollection;
      
    });

    
    // MyHelper.coffee
    root.require.register('MultiMine/src/modules/MyHelper.js', function(exports, require, module) {
    
      var MyHelper, mediator,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
      
      mediator = require("./mediator");
      
      MyHelper = (function() {
        function MyHelper() {
          this.quickSearchEverything = __bind(this.quickSearchEverything, this);
          this.totalResults = {
            facets: {
              Category: {},
              organisms: {}
            },
            results: []
          };
          this.globalFilter = [];
          this.organismMap = {};
        }
      
        MyHelper.prototype.calcStats = function(responseArray) {
          var key, response, value,
            _this = this;
          return Q((function() {
            var _base, _base1, _i, _len, _ref, _ref1, _results;
            _results = [];
            for (_i = 0, _len = responseArray.length; _i < _len; _i++) {
              response = responseArray[_i];
              _ref = response.facets["organism.shortName"];
              for (key in _ref) {
                value = _ref[key];
                if ((_base = this.totalResults.facets.organisms)[key] == null) {
                  _base[key] = 0;
                }
                this.totalResults.facets.organisms[key] += value;
              }
              _ref1 = response.facets.Category;
              for (key in _ref1) {
                value = _ref1[key];
                if ((_base1 = this.totalResults.facets.Category)[key] == null) {
                  _base1[key] = 0;
                }
                this.totalResults.facets.Category[key] += value;
              }
              _results.push(this.totalResults.results = this.totalResults.results.concat(response.results));
            }
            return _results;
          }).call(this)).then(function(test) {});
        };
      
        MyHelper.prototype.quickSearchEverything = function(term) {
          var friendlyMines, listedMines, mine,
            _this = this;
          listedMines = {
            MouseMine: "www.mousemine.org/mousemine",
            ModMine: "http://intermine.modencode.org/query"
          };
          friendlyMines = [
            {
              name: "MouseMine",
              queryUrl: "www.mousemine.org/mousemine",
              baseUrl: "http://www.mousemine.org/mousemine/"
            }, {
              name: "ModMine",
              queryUrl: "http://intermine.modencode.org/query",
              baseUrl: "http://intermine.modencode.org/release-32/"
            }, {
              name: "FlyMine",
              queryUrl: "http://www.flymine.org/query",
              baseUrl: "http://www.flymine.org/release-38.0/"
            }, {
              name: "ZebraFishMine",
              queryUrl: "http://www.zebrafishmine.org",
              baseUrl: "http://www.zebrafishmine.org/"
            }, {
              name: "YeastMine",
              queryUrl: "http://yeastmine.yeastgenome.org/yeastmine",
              baseUrl: "http://yeastmine.yeastgenome.org/yeastmine/"
            }, {
              name: "WormMine",
              queryUrl: "http://www.wormbase.org/tools/wormmine",
              baseUrl: "http://www.wormbase.org/tools/wormmine/"
            }
          ];
          return Q.all((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = friendlyMines.length; _i < _len; _i++) {
              mine = friendlyMines[_i];
              _results.push(this.runOne(mine.queryUrl, term, mine.name, mine.baseUrl));
            }
            return _results;
          }).call(this)).then(function(finished) {
            return _this.calcStats(finished);
          }).then(function(test) {
            var fields, found, obj, parsedSpecies, res, result, _i, _len, _ref;
            _ref = _this.totalResults.results;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              obj = _ref[_i];
              fields = obj.fields;
              if (fields["organism.name"] !== void 0) {
                found = _.findWhere(_this.organismMap, {
                  name: fields["organism.name"]
                });
                if (found) {
                  obj.taxonId = found.taxonId;
                  obj.genus = found.genus;
                  obj.species = found.species;
                  obj.organismName = found.name;
                  obj.shortName = found.genus.charAt(0) + ". " + found.species;
                }
              } else if (fields["organism.shortName"] !== void 0) {
                res = fields["organism.shortName"].split(" ");
                parsedSpecies = res[1];
                found = _.findWhere(_this.organismMap, {
                  species: parsedSpecies
                });
                if (found) {
                  obj.taxonId = found.taxonId;
                  obj.genus = found.genus;
                  obj.species = found.species;
                  obj.organismName = found.name;
                  obj.shortName = found.genus.charAt(0) + ". " + found.species;
                }
              } else {
      
              }
            }
            return result = {
              results: _this.totalResults,
              organisms: _this.organismMap
            };
          });
        };
      
        MyHelper.prototype.runOne = function(mineUrl, term, mineName, mineBase) {
          var def, service,
            _this = this;
          def = Q.defer();
          service = new intermine.Service({
            root: mineUrl
          });
          service.search(term).then(function(results) {
            _.map(results.results, function(res) {
              res.mineUrl = mineUrl;
              res.mineName = mineName;
              return res.mineBase = mineBase;
            });
            return def.resolve(results);
          });
          return def.promise.then(function(results) {
            var key, organismQuery, orgresults, queryOrganismArray, value, _ref;
            queryOrganismArray = [];
            _ref = results.facets["organism.shortName"];
            for (key in _ref) {
              value = _ref[key];
              queryOrganismArray.push(key);
            }
            if (queryOrganismArray.length > 0) {
              organismQuery = {
                select: ["Organism.name", "Organism.taxonId", "Organism.genus", "Organism.species"],
                where: {
                  "Organism.shortName": queryOrganismArray
                }
              };
              return orgresults = service.records(organismQuery);
            } else {
              return [];
            }
          }).then(function(results) {
            var organism, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              organism = results[_i];
              if (organism.taxonId in _this.organismMap) {
      
              } else {
                _results.push(_this.organismMap[organism.taxonId] = organism);
              }
            }
            return _results;
          }).then(function() {
            return def.promise;
          });
        };
      
        MyHelper.prototype.sortData = function(response) {
          var arr, justGenes, totalResults, _i, _len;
          totalResults = [];
          for (_i = 0, _len = response.length; _i < _len; _i++) {
            arr = response[_i];
            totalResults = totalResults.concat(arr.results);
          }
          return justGenes = _.where(totalResults, {
            type: "Gene"
          });
        };
      
        MyHelper.prototype.logFailure = function(message) {};
      
        MyHelper.prototype.calcCategories = function(json) {
          var map, someData;
          map = {};
          someData = [];
          _.each(json.facets.Category, function(values, key, list) {
            var aMap;
            aMap = {};
            aMap.legendLabel = key;
            aMap.magnitude = values;
            return someData.push(aMap);
          });
          return someData;
        };
      
        MyHelper.prototype.calcOrganisms = function(json) {
          var map, someData;
          map = {};
          someData = [];
          _.each(json.facets["organism.shortName"], function(values, key, list) {
            var aMap;
            aMap = {};
            aMap.legendLabel = key;
            aMap.magnitude = values;
            return someData.push(aMap);
          });
          return someData;
        };
      
        MyHelper.prototype.buildChart = function(myvalues) {
          var angle, arc, arcs, canvasHeight, canvasWidth, color, dataSet, h, innerRadius, labelr, outerRadius, pie, r, vis, w;
          angle = function(d) {
            var a;
            a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            if (a > 90) {
              return a - 180;
            } else {
              return a;
            }
          };
          canvasWidth = 600;
          canvasHeight = 300;
          outerRadius = 150;
          innerRadius = 75;
          w = 300;
          h = 300;
          r = Math.min(w, h) / 2;
          labelr = r;
          color = d3.scale.category20();
          dataSet = myvalues;
          vis = d3.select("body").append("svg:svg").data([dataSet]).attr("width", canvasWidth).attr("height", canvasHeight).append("svg:g").attr("transform", "translate(" + 1.5 * outerRadius + "," + 1.5 * outerRadius + ")");
          arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
          pie = d3.layout.pie().value(function(d) {
            return d.magnitude;
          }).sort(function(d) {
            return null;
          });
          arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
          arcs.append("svg:path").attr("fill", function(d, i) {
            return color(i);
          }).attr("d", arc);
          arcs.append("svg:text").attr("transform", function(d) {
            var c, x, y;
            c = arc.centroid(d);
            x = c[0];
            y = c[1];
            h = Math.sqrt(x * x + y * y);
            return "translate(" + (x / h * labelr) + "," + (y / h * labelr) + ")";
          }).attr("dy", ".35em").attr("text-anchor", function(d) {
            if ((d.endAngle + d.startAngle) / 2 > Math.PI) {
              return "end";
            } else {
              return "start";
            }
          }).text(function(d, i) {
            return dataSet[i].legendLabel;
          });
          return arcs.filter(function(d) {
            return d.endAngle - d.startAngle > .2;
          }).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", function(d) {
            d.outerRadius = outerRadius;
            d.innerRadius = outerRadius / 2;
            return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
          }).style("fill", "White").style("font", "bold 12px Arial").text(function(d) {
            return d.data.magnitude;
          });
        };
      
        MyHelper.prototype.callThisFunction = function(d, filter) {
          if (d.toggled === false || d.toggled === void 0) {
            d.toggled = true;
            mediator.trigger("filter:apply", [d.data[0], filter]);
          } else if (d.toggled === true) {
            d.toggled = false;
            mediator.trigger("filter:remove", [d.data[0], filter]);
          }
          return console.log("d.toggled has been set to ", d.toggled);
        };
      
        MyHelper.prototype.buildChartOrganisms = function(myvalues, filter) {
          var angle, arc, arcOver, arcs, canvasHeight, canvasWidth, color, dataSet, h, innerRadius, labelr, outerRadius, pie, r, that, vis, w;
          that = this;
          console.log("that", that);
          angle = function(d) {
            var a;
            a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            if (a > 90) {
              return a - 180;
            } else {
              return a;
            }
          };
          canvasWidth = 100;
          canvasHeight = 100;
          outerRadius = 50;
          innerRadius = 25;
          w = 75;
          h = 75;
          r = Math.min(w, h) / 2;
          labelr = r;
          color = d3.scale.category20();
          dataSet = myvalues;
          arcOver = d3.svg.arc().innerRadius(innerRadius + 30).outerRadius(r + 30);
          arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(r);
          vis = d3.select("#filter").append("svg:svg").data([dataSet]).attr("width", canvasWidth).attr("height", canvasHeight).append("svg:g").attr("transform", "translate(" + 1.5 * outerRadius + "," + 1.5 * outerRadius + ")");
          arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
          pie = d3.layout.pie().value(function(d) {
            return d[1];
          });
          arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice").on("click", function(d) {
            if (d.toggled === false || d.toggled === void 0) {
              d3.select(this).classed("SOMETHING", true);
              d3.select(this).select("path").transition().duration(200).attr("d", arcOver);
              return that.callThisFunction(d, filter);
            } else if (d.toggled === true) {
              console.log("SHRINKING");
              d3.select(this).select("path").transition().duration(100).attr("d", arc);
              return that.callThisFunction(d, filter);
            }
          }).on("testing", function(d) {
            return d3.select(this).select("path").transition().duration(100).attr("d", arc);
          });
          arcs.append("svg:path").attr("fill", function(d, i) {
            return color(i);
          }).attr("d", arc);
          arcs.append("svg:text").attr("transform", function(d) {
            var c, x, y;
            c = arc.centroid(d);
            x = c[0];
            y = c[1];
            h = Math.sqrt(x * x + y * y);
            return "translate(" + (x / h * labelr) + "," + (y / h * labelr) + ")";
          }).attr("dy", ".35em").attr("text-anchor", function(d) {
            if ((d.endAngle + d.startAngle) / 2 > Math.PI) {
              return "end";
            } else {
              return "start";
            }
          }).style("fill", "White").style("font", "12px Arial").text(function(d, i) {
            return dataSet[i][0];
          });
          return arcs.filter(function(d) {
            return d.endAngle - d.startAngle > .2;
          }).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", function(d) {
            d.outerRadius = outerRadius;
            d.innerRadius = outerRadius / 2;
            return "translate(" + arc.centroid(d) + ")rotate(" + 0 + ")";
          }).style("fill", "White").style("font", "bold 12px Arial").text(function(d) {
            return d.data[1];
          });
        };
      
        MyHelper.prototype.buildBarChartNew = function(dataset) {
          var dataset2, h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          dataset2 = dataset;
          xScale = d3.scale.ordinal().domain(d3.range(dataset2.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset2, function(d) {
              return d[1];
            })
          ]).range([0, h]);
          key = function(d) {
            return d[0];
          };
          svg = d3.select("#datatypechart").append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset2).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d[1]);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d[1]);
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d[1]);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        MyHelper.prototype.buildBarChart = function(dataset, location) {
          var h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset, function(d) {
              return d.value;
            })
          ]).range([0, h]);
          key = function(d) {
            return d.key;
          };
          svg = d3.select(location).html('').append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d.value);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d.value);
          }).attr("id", function(d) {
            return d.key;
          }).attr("class", function(d) {
            return "mychart";
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d.value);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        MyHelper.prototype.buildLineChart = function(dataset) {
          var h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset, function(d) {
              return d.value;
            })
          ]).range([0, h]);
          key = function(d) {
            return d.key;
          };
          svg = d3.select("#datatypechart").append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d.value);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d.value);
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d.value);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        MyHelper.prototype.buildBarChart2 = function() {
          var dataset, h, key, svg, w, xScale, yScale;
          w = 200;
          h = 25;
          dataset = [
            {
              key: 0,
              value: 5
            }, {
              key: 1,
              value: 10
            }, {
              key: 2,
              value: 13
            }, {
              key: 3,
              value: 19
            }, {
              key: 4,
              value: 21
            }, {
              key: 5,
              value: 25
            }, {
              key: 6,
              value: 22
            }, {
              key: 7,
              value: 18
            }, {
              key: 8,
              value: 15
            }, {
              key: 9,
              value: 13
            }, {
              key: 10,
              value: 11
            }, {
              key: 11,
              value: 12
            }, {
              key: 12,
              value: 15
            }, {
              key: 13,
              value: 20
            }, {
              key: 14,
              value: 18
            }, {
              key: 15,
              value: 17
            }, {
              key: 16,
              value: 16
            }, {
              key: 17,
              value: 18
            }, {
              key: 18,
              value: 23
            }, {
              key: 19,
              value: 25
            }
          ];
          xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([0, w], 0.05);
          yScale = d3.scale.linear().domain([
            0, d3.max(dataset, function(d) {
              return d.value;
            })
          ]).range([0, h]);
          key = function(d) {
            return d.key;
          };
          svg = d3.select("#organismchart").append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", function(d, i) {
            return xScale(i);
          }).attr("y", function(d) {
            return h - yScale(d.value);
          }).attr("width", xScale.rangeBand()).attr("height", function(d) {
            return yScale(d.value);
          }).attr("fill", "grey").on("mouseover", function(d) {
            var xPosition, yPosition;
            xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
            yPosition = parseFloat(d3.select(this).attr("y")) + 14;
            d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text(d.value);
            d3.select("#tooltip").classed("hidden", false);
          }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
          });
        };
      
        return MyHelper;
      
      })();
      
      module.exports = MyHelper;
      
    });

    
    // dependencies.js
    root.require.register('MultiMine/src/modules/dependencies.js', function(exports, require, module) {
    
      var $;
            
      $ = window.jQuery
            
      module.exports = {
              $: $,
              _: _,
              Backbone: Backbone,
      
      };
    });

    
    // fieldmappings.coffee
    root.require.register('MultiMine/src/modules/fieldmappings.js', function(exports, require, module) {
    
      
      
    });

    
    // globals.js
    root.require.register('MultiMine/src/modules/globals.js', function(exports, require, module) {
    
      var columns = [];
      exports.columns = columns;
    });

    
    // mediator.js
    root.require.register('MultiMine/src/modules/mediator.js', function(exports, require, module) {
    
        var mediator = _.extend({}, Backbone.Events);
        module.exports = mediator;
    });

    
    // FilterGenusOffTemplate.eco
    root.require.register('MultiMine/src/templates/FilterGenusOffTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div></i>');
          
            __out.push(__sanitize(this.result.genus));
          
            __out.push('<i class="icon-down-circle showall expand"></i></div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterGenusTemplate.eco
    root.require.register('MultiMine/src/templates/FilterGenusTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div><i class="icon-ok"></i>');
          
            __out.push(__sanitize(this.result.genus));
          
            __out.push('<i class="icon-down-circle showall expand"></i></div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterListItemOffTemplate.eco
    root.require.register('MultiMine/src/templates/FilterListItemOffTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push(__sanitize(this.result.name));
          
            __out.push(' (');
          
            __out.push(__sanitize(this.result.count));
          
            __out.push(')');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterListItemTemplate.eco
    root.require.register('MultiMine/src/templates/FilterListItemTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<i class="icon-ok"></i>');
          
            __out.push(__sanitize(this.result.name));
          
            __out.push(' (');
          
            __out.push(__sanitize(this.result.count));
          
            __out.push(')');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterSpeciesTemplate.eco
    root.require.register('MultiMine/src/templates/FilterSpeciesTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<i class="icon-ok"></i>');
          
            __out.push(__sanitize(this.result.species));
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // ResultTypeCategoryTemplate.eco
    root.require.register('MultiMine/src/templates/ResultTypeCategoryTemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('Result2: ');
          
            __out.push(__sanitize(this.result.name));
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // apptemplate.eco
    root.require.register('MultiMine/src/templates/apptemplate.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<div id="search-app">\n\t<div id="search-header"></div>\n\t<div id="search-results"></div>\n\t<div id="search-footer"></div>\n</div>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // results.eco
    root.require.register('MultiMine/src/templates/results.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            var result, _i, _len, _ref;
          
            __out.push('<ul>\n\n\t');
          
            console.log("results obj from templte: ", this.results);
          
            __out.push('\n\t');
          
            _ref = this.results;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              result = _ref[_i];
              __out.push('\n\t\t<li><span>Type: </span>');
              __out.push(__sanitize(result.type));
              __out.push('</li>\n\t');
            }
          
            __out.push('\n</ul>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultshead.eco
    root.require.register('MultiMine/src/templates/resultshead.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<thead>\n</thead>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultsrow.eco
    root.require.register('MultiMine/src/templates/resultsrow.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            var key, percentage, value, _ref;
          
            __out.push('<td class="TypeColumn">\n\t<a href="');
          
            __out.push(__sanitize(this.result.mineBase));
          
            __out.push('report.do?id=');
          
            __out.push(__sanitize(this.result.id));
          
            __out.push('" target="_blank">');
          
            __out.push(__sanitize(this.result.type));
          
            __out.push('</a>\n</td>\n<td>\n\t<ul>\n\t\t');
          
            _ref = this.result.fields;
            for (key in _ref) {
              value = _ref[key];
              __out.push('\n\t\t\t<li><strong>');
              __out.push(__sanitize("" + key + ": "));
              __out.push('</strong>');
              __out.push(__sanitize("" + value));
              __out.push('</li>\n\t\t');
            }
          
            __out.push('\n\t</ul>\n</td>\n<td class="Organism">\n\t');
          
            __out.push(__sanitize(this.result.shortName));
          
            __out.push('\n</td>\n<!-- <td class="RelevanceColumn">\n\t');
          
            percentage = (this.result.relevance / 1) * 100;
          
            __out.push('\n\t<div class="progress" style="width:');
          
            __out.push(__sanitize(percentage));
          
            __out.push('%"></div>\n</td> -->\n<td class="SourceColumn">\n\t<span>');
          
            __out.push(__sanitize(this.result.mineName));
          
            __out.push('</span>\n</td>\n');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultstable.eco
    root.require.register('MultiMine/src/templates/resultstable.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<thead>\n\t<tr>\n\t\t<th>Type</th>\n\t\t<th>Details</th>\n\t\t<th>Organism</th>\n\t\t<!-- <th>Relevance</th> -->\n\t\t<th>Source</th>\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // resultstbody.eco
    root.require.register('MultiMine/src/templates/resultstbody.js', function(exports, require, module) {
    
      module.exports = function(__obj) {
        if (!__obj) __obj = {};
        var __out = [], __capture = function(callback) {
          var out = __out, result;
          __out = [];
          callback.call(this);
          result = __out.join('');
          __out = out;
          return __safe(result);
        }, __sanitize = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else if (typeof value !== 'undefined' && value != null) {
            return __escape(value);
          } else {
            return '';
          }
        }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
        __safe = __obj.safe = function(value) {
          if (value && value.ecoSafe) {
            return value;
          } else {
            if (!(typeof value !== 'undefined' && value != null)) value = '';
            var result = new String(value);
            result.ecoSafe = true;
            return result;
          }
        };
        if (!__escape) {
          __escape = __obj.escape = function(value) {
            return ('' + value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');
          };
        }
        (function() {
          (function() {
            __out.push('<tbody>\n</tbody>');
          
          }).call(this);
          
        }).call(__obj);
        __obj.safe = __objSafe, __obj.escape = __escape;
        return __out.join('');
      }
    });

    
    // FilterGenusView.coffee
    root.require.register('MultiMine/src/views/FilterGenusView.js', function(exports, require, module) {
    
      var FilterGenusView, FilterSpeciesView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterSpeciesView = require('./FilterSpeciesView');
      
      FilterGenusView = (function(_super) {
        __extends(FilterGenusView, _super);
      
        function FilterGenusView() {
          this.render = __bind(this.render, this);
          _ref = FilterGenusView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterGenusView.prototype.tagName = "li";
      
        FilterGenusView.prototype.className = "expandable";
      
        FilterGenusView.prototype.template = require('../templates/FilterGenusTemplate');
      
        FilterGenusView.prototype.templateOff = require('../templates/FilterGenusOffTemplate');
      
        FilterGenusView.prototype.enabled = true;
      
        FilterGenusView.prototype.events = function() {
          return {
            "click .expand": "showChildren",
            "click": "toggle"
          };
        };
      
        FilterGenusView.prototype.toggle = function() {
          if (this.enabled === true) {
            $(this.el).html(this.templateOff({
              result: this.options
            }));
            $(this.el).addClass("off");
            this.enabled = false;
            return mediator.trigger("filter:removeGenus", {
              genus: this.options.genus
            });
          } else {
            this.render();
            $(this.el).removeClass("off");
            this.enabled = true;
            return mediator.trigger("filter:addGenus", {
              genus: this.options.genus
            });
          }
        };
      
        FilterGenusView.prototype.showChildren = function() {
          var content;
          content = $(this.el).find('ul');
          return content.slideToggle(100, function() {});
        };
      
        FilterGenusView.prototype.filterAll = function() {};
      
        FilterGenusView.prototype.initialize = function(attr) {
          this.options = attr;
          mediator.on('display:hideAllOrganisms', this.toggleOff, this);
          return mediator.on('display:showAllOrganisms', this.toggleOn, this);
        };
      
        FilterGenusView.prototype.toggleOff = function() {
          $(this.el).html(this.templateOff({
            result: this.options
          }));
          $(this.el).addClass("off");
          return this.enabled = false;
        };
      
        FilterGenusView.prototype.toggleOn = function() {
          this.render();
          $(this.el).removeClass("off");
          return this.enabled = true;
        };
      
        FilterGenusView.prototype.render = function() {
          var nextModel, speciesView, ul, _i, _len, _ref1;
          $(this.el).html(this.template({
            result: this.options,
            count: this.options.models.length
          }));
          ul = $('<ul>');
          ul.addClass("content");
          _ref1 = this.options.models;
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            nextModel = _ref1[_i];
            speciesView = new FilterSpeciesView({
              model: nextModel
            });
            ul.append(speciesView.render().$el);
          }
          $(this.el).append(ul);
          return this;
        };
      
        FilterGenusView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterGenusView.prototype.toggleMe = function() {};
      
        return FilterGenusView;
      
      })(Backbone.View);
      
      module.exports = FilterGenusView;
      
    });

    
    // FilterListItemView.coffee
    root.require.register('MultiMine/src/views/FilterListItemView.js', function(exports, require, module) {
    
      var FilterListItemView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterListItemView = (function(_super) {
        __extends(FilterListItemView, _super);
      
        function FilterListItemView() {
          this.render = __bind(this.render, this);
          _ref = FilterListItemView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListItemView.prototype.tagName = "li";
      
        FilterListItemView.prototype.template = require('../templates/FilterListItemTemplate');
      
        FilterListItemView.prototype.templateOff = require('../templates/FilterListItemOffTemplate');
      
        FilterListItemView.prototype.events = function() {
          return {
            "click": "toggleMe",
            "mouseover": "moused"
          };
        };
      
        FilterListItemView.prototype.initialize = function() {
          return this.model.on('change:enabled', this.render);
        };
      
        FilterListItemView.prototype.render = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            $(this.el).removeClass("off");
            mediator.trigger("filter:apply", [this.model.get("name"), "type"]);
          } else {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            mediator.trigger("filter:remove", [this.model.get("name"), "type"]);
          }
          return this;
        };
      
        FilterListItemView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterListItemView.prototype.toggleMe = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            this.model.set({
              enabled: false
            });
            return mediator.trigger("filter:removeType", this.model.get("name"));
          } else {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            this.model.set({
              enabled: true
            });
            $(this.el).removeClass("off");
            return mediator.trigger("filter:addType", this.model.get("name"));
          }
        };
      
        return FilterListItemView;
      
      })(Backbone.View);
      
      module.exports = FilterListItemView;
      
    });

    
    // FilterListView.coffee
    root.require.register('MultiMine/src/views/FilterListView.js', function(exports, require, module) {
    
      var FilterListItemView, FilterListView, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterListItemView = require('./FilterListItemView');
      
      FilterListView = (function(_super) {
        __extends(FilterListView, _super);
      
        function FilterListView() {
          _ref = FilterListView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterListView.prototype.tagName = "ul";
      
        FilterListView.prototype.initialize = function() {
          return $(this.el).mouseleave(function() {
            return mediator.trigger("charts:clear", {});
          });
        };
      
        FilterListView.prototype.render = function() {
          var $el;
          $el = $(this.el);
          this.collection.each(function(nextModel) {
            var itemView;
            itemView = new FilterListItemView({
              model: nextModel
            });
            return $el.append(itemView.render().$el);
          });
          return this;
        };
      
        return FilterListView;
      
      })(Backbone.View);
      
      module.exports = FilterListView;
      
    });

    
    // FilterOrganismItemView.coffee
    root.require.register('MultiMine/src/views/FilterOrganismItemView.js', function(exports, require, module) {
    
      var FilterOrganismItemView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterOrganismItemView = (function(_super) {
        __extends(FilterOrganismItemView, _super);
      
        function FilterOrganismItemView() {
          this.render = __bind(this.render, this);
          _ref = FilterOrganismItemView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterOrganismItemView.prototype.tagName = "li";
      
        FilterOrganismItemView.prototype.template = require('../templates/FilterListItemTemplate');
      
        FilterOrganismItemView.prototype.templateOff = require('../templates/FilterListItemOffTemplate');
      
        FilterOrganismItemView.prototype.events = function() {
          return {
            "click": "toggleMe",
            "mouseover": "moused"
          };
        };
      
        FilterOrganismItemView.prototype.initialize = function() {
          return this.model.on('change:enabled', this.render);
        };
      
        FilterOrganismItemView.prototype.render = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            $(this.el).removeClass("off");
            mediator.trigger("filter:apply", [this.model.get("taxonId"), "organism"]);
          } else {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
          }
          return this;
        };
      
        FilterOrganismItemView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterOrganismItemView.prototype.toggleMe = function() {
          if (this.model.get("enabled") === true) {
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            this.model.set({
              enabled: false
            });
            return mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
          } else {
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            this.model.set({
              enabled: true
            });
            $(this.el).removeClass("off");
            return mediator.trigger("filter:apply", [this.model.get("taxonId"), "organism"]);
          }
        };
      
        return FilterOrganismItemView;
      
      })(Backbone.View);
      
      module.exports = FilterOrganismItemView;
      
    });

    
    // FilterOrganismView.coffee
    root.require.register('MultiMine/src/views/FilterOrganismView.js', function(exports, require, module) {
    
      var FilterGenusView, FilterOrganismView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterGenusView = require('./FilterGenusView');
      
      FilterOrganismView = (function(_super) {
        __extends(FilterOrganismView, _super);
      
        function FilterOrganismView() {
          this.render = __bind(this.render, this);
          _ref = FilterOrganismView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterOrganismView.prototype.tagName = "ul";
      
        FilterOrganismView.prototype.className = "expandable";
      
        FilterOrganismView.prototype.childViews = [];
      
        FilterOrganismView.prototype.templateOff = require('../templates/FilterListItemOffTemplate');
      
        FilterOrganismView.prototype.events = function() {
          return {
            "click": "describe"
          };
        };
      
        FilterOrganismView.prototype.showChildren = function() {
          var content;
          content = $(this.el).find('ul');
          return content.slideToggle(100, function() {});
        };
      
        FilterOrganismView.prototype.describe = function() {
          return console.log(this);
        };
      
        FilterOrganismView.prototype.filterAll = function() {
          return console.log("Toggling children.");
        };
      
        FilterOrganismView.prototype.initialize = function(attr) {
          return this.options = attr;
        };
      
        FilterOrganismView.prototype.render = function() {
          var group, groups, nextGenus;
          groups = this.options.collection.groupBy(function(model) {
            return model.get("genus");
          });
          for (group in groups) {
            nextGenus = new FilterGenusView({
              models: groups[group],
              genus: group
            });
            $(this.el).append(nextGenus.render().$el);
          }
          return this;
        };
      
        FilterOrganismView.prototype.moused = function() {
          d3.selectAll(".mychart").style("fill", "#808080");
          return d3.select("#" + this.model.get("name")).style("fill", "white");
        };
      
        FilterOrganismView.prototype.toggleMe = function() {
          return console.log("clicked");
        };
      
        return FilterOrganismView;
      
      })(Backbone.View);
      
      module.exports = FilterOrganismView;
      
    });

    
    // FilterSpeciesView.coffee
    root.require.register('MultiMine/src/views/FilterSpeciesView.js', function(exports, require, module) {
    
      var FilterSpeciesView, mediator, _ref,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterSpeciesView = (function(_super) {
        __extends(FilterSpeciesView, _super);
      
        function FilterSpeciesView() {
          this.render = __bind(this.render, this);
          _ref = FilterSpeciesView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        FilterSpeciesView.prototype.tagName = "li";
      
        FilterSpeciesView.prototype.template = require('../templates/FilterSpeciesTemplate');
      
        FilterSpeciesView.prototype.events = function() {
          return {
            "click": "filterAll"
          };
        };
      
        FilterSpeciesView.prototype.filterAll = function() {
          return mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
        };
      
        FilterSpeciesView.prototype.initialize = function(attr) {
          return this.options = attr;
        };
      
        FilterSpeciesView.prototype.render = function() {
          $(this.el).html(this.template({
            result: this.model.toJSON()
          }));
          return this;
        };
      
        return FilterSpeciesView;
      
      })(Backbone.View);
      
      module.exports = FilterSpeciesView;
      
    });

    
    // OrganismListView.coffee
    root.require.register('MultiMine/src/views/OrganismListView.js', function(exports, require, module) {
    
      var FilterOrganismItemView, OrganismListView, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      FilterOrganismItemView = require('./FilterOrganismItemView');
      
      OrganismListView = (function(_super) {
        __extends(OrganismListView, _super);
      
        function OrganismListView() {
          _ref = OrganismListView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        OrganismListView.prototype.tagName = "ul";
      
        OrganismListView.prototype.childViews = [];
      
        OrganismListView.prototype.initialize = function() {
          return $(this.el).mouseleave(function() {
            return mediator.trigger("charts:clear", {});
          });
        };
      
        OrganismListView.prototype.render = function() {
          var $el;
          $el = $(this.el);
          this.collection.each(function(nextModel) {
            var itemView;
            itemView = new FilterOrganismItemView({
              model: nextModel
            });
            this.childViews.push(itemView);
            return $el.append(itemView.render().$el);
          });
          return this;
        };
      
        return OrganismListView;
      
      })(Backbone.View);
      
      module.exports = OrganismListView;
      
    });

    
    // ResultView.coffee
    root.require.register('MultiMine/src/views/ResultView.js', function(exports, require, module) {
    
      var ResultView, mediator, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      mediator = require('../modules/mediator');
      
      ResultView = (function(_super) {
        __extends(ResultView, _super);
      
        function ResultView() {
          _ref = ResultView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultView.prototype.tagName = "tr";
      
        ResultView.prototype.className = "test";
      
        ResultView.prototype.template = require('../templates/resultsrow');
      
        ResultView.prototype.initialize = function() {
          return this.model.on('change:enabled', this.toggleVisible, this);
        };
      
        ResultView.prototype.toggleVisible = function() {
          console.log("CHANGING VISIBILITY");
          return $(this.el).toggleClass('hidden', !this.model.get("enabled"));
        };
      
        ResultView.prototype.render = function() {
          $(this.el).append(this.template({
            result: this.model.toJSON()
          }));
          return this;
        };
      
        return ResultView;
      
      })(Backbone.View);
      
      module.exports = ResultView;
      
    });

    
    // ResultsTableView.coffee
    root.require.register('MultiMine/src/views/ResultsTableView.js', function(exports, require, module) {
    
      var ResultView, ResultsTableView, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      ResultView = require('./ResultView');
      
      ResultsTableView = (function(_super) {
        __extends(ResultsTableView, _super);
      
        function ResultsTableView() {
          _ref = ResultsTableView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultsTableView.prototype.tagName = "table";
      
        ResultsTableView.prototype.className = "ResultsTable";
      
        ResultsTableView.prototype.template = require('../templates/resultstable');
      
        ResultsTableView.prototype.initialize = function() {
          return ResultsTableView.__super__.initialize.apply(this, arguments);
        };
      
        ResultsTableView.prototype.render = function() {
          var _this = this;
          $(this.el).append(this.template({}));
          this.collection.each(function(aModel) {
            var resultView;
            resultView = new ResultView({
              model: aModel
            });
            return $(_this.el).append(resultView.render().el);
          });
          return this;
        };
      
        return ResultsTableView;
      
      })(Backbone.View);
      
      module.exports = ResultsTableView;
      
    });

    
    // appview.js
    root.require.register('MultiMine/src/views/appview.js', function(exports, require, module) {
    
        // Include helper functions:
        var mediator = require("../modules/mediator");
        var $ = require('../modules/dependencies').$;
        var Helper = require("../modules/MyHelper");
        var ResultModel = require("../models/ResultModel");
        var ResultsCollection = require("../models/ResultsCollection");
        var ResultView = require("../views/ResultView");
        var ResultsTableView = require("../views/ResultsTableView");
        var ResultTypeCategory = require("../models/ResultTypeCategory");
        var ResultTypeCollection = require("../models/ResultTypeCollection");
      
        // Collections
        var FilterListCollection = require("../models/FilterListCollection");
        var FilterListItem = require("../models/FilterListItem");
      
        var FilterListView = require("./FilterListView");
      
        var OrganismItem = require("../models/OrganismItem");
        var OrganismCollection = require("../models/OrganismCollection");
        var OrganismListView = require("../views/OrganismListView");
        var FilterGenusView = require("../views/FilterGenusView");
        var FilterOrganismView = require("../views/FilterOrganismView");
      
      
        var searchResultsCollection = {};
        var filterTypeArr = [];
        var filterOrganismArr = [];
        var typecat = new ResultTypeCategory();
      
      
        var myResultsCollection = new ResultsCollection();
      
      
        var categoryFilterListCollection = new FilterListCollection();
        var organismFilterListCollection = new FilterListCollection();
        var organismCollection = new OrganismCollection();
      
        var globalFilter = {};
      
        var spinner;
      
      
        // The Application
        // --------------
        var AppView = Backbone.View.extend({
      
          el: '#search-results',
      
          initialize: function(params) {
      
            console.log("initialized");
      
      
            // Add the "ENTER" keypress to our search box:
      
            $('#' + params.input).on('keypress', function(e) {
      
              if (e.keyCode == 13) {
      
                value = $('#' + params.input).val()
                $("#minisearch").val(value);
                
                mediator.trigger('rand', {test: value});
                return false;
              }
            });
      
            $('#minisearch').on('keypress', function(e) {
      
              
              
             
              if (e.keyCode == 13) {
                
                mediator.trigger('rand', {test: $("#minisearch").val()});
                return false;
              }
            });
      
            $('#hideAllDataTypes').on('click', function(e) {
              mediator.trigger('filter:removeAllTypes', {});
              mediator.trigger('display:hideAllTypes', {});
            });
      
            $('#showAllDataTypes').on('click', function(e) {
              mediator.trigger('filter:addAllTypes', {});
              mediator.trigger('display:showAllTypes')
            });
      
            $('#hideAllOrganisms').on('click', function(e) {
              mediator.trigger('display:hideAllOrganisms', {});
            });
      
             $('#showAllOrganisms').on('click', function(e) {
              mediator.trigger('display:showAllOrganisms', {});
            });
      
      
      
            
      
      
      
             
      
      
      
      
            // Attach our listeners to the medaitor
      
            mediator.on('rand', this.rand, this);
            // mediator.on('column:add', this.addColumn, this);
            mediator.on('filter:apply', this.applyFilter, this);
            // mediator.on('filter:remove', this.removeFilter, this);
            mediator.on('filter:hello', this.test2, this);
            mediator.on('medTest', this.test, this);
      
            mediator.on('charts:clear', this.clearCharts, this);
      
            mediator.on('display:hideAllTypes', this.hideAllDataTypes, this);
            mediator.on('display:showAllTypes', this.showAllDataTypes, this);
            mediator.on('display:hideAllOrganisms', this.hideAllOrganisms, this);
            mediator.on('display:showAllOrganisms', this.showAllOrganisms, this);
      
            mediator.on('filter:newremove', this.newremove, this);
      
        
      
      
      
      
      
      
            
          },
      
          newremove: function(data) {
            alert(JSON.stringify(data));
          },
      
          hideAllDataTypes: function() {
      
      
            categoryFilterListCollection.toggleAll(false);
      
          },
      
          showAllDataTypes: function() {
      
            categoryFilterListCollection.toggleAll(true);
      
          },
      
          hideAllOrganisms: function() {
      
            mediator.trigger("filter:removeAllGenus", {});
            organismCollection.toggleAll(false);
      
          },
      
          showAllOrganisms: function() {
      
            organismFilterListCollection.toggleAll(true);
            mediator.trigger("filter:addAllGenus", {})
      
          },
      
      
      
      
      
          clearCharts: function() {
            d3.selectAll(".mychart").style("fill", "#808080")
          },
      
          removeFilter: function(value) {
      
      
            _.each(myResultsCollection.models, function(aModel) {
              console.log("nextModel", aModel);
              aModel.set({show: false});
            });
      
      
            if (value[1] === "type") {
              filterTypeArr = _.without(filterTypeArr, value[0]);
            } else if (value[1] === "organism") {
              filterOrganismArr = _.without(filterOrganismArr, value[0]);
            }
      
            var nResults = myResultsCollection.filterType(filterTypeArr, filterOrganismArr);
            console.log("filtered results", nResults);
            _.each(nResults, function(aModel) {
                aModel.set({show: true});
            });
      
      
      
      
          },
      
          applyFilter: function(value) {
      
      
      
            // Hide all of our results:
            _.each(myResultsCollection.models, function(aModel) {
              aModel.set({show: false});
            });
      
            if (value[1] === "type") {
              filterTypeArr.push(value[0]);
            } else if (value[1] === "organism") {
              filterOrganismArr.push(value[0]);
            }
            
      
            var nResults = myResultsCollection.filterType(filterTypeArr, filterOrganismArr);
            _.each(nResults, function(aModel) {
                aModel.set({show: true});
            });
      
          },
      
          test: function(val) {
            filterTypeArr.push(val[0]);
            var nResults = myResultsCollection.filterType(filterTypeArr);
            _.each(nResults, function(aModel) {
                aModel.set({show: true});
            });
          },
      
          showLoading: function() {
      
            var opts = {
              lines: 11, // The number of lines to draw
              length: 11, // The length of each line
              width: 10, // The line thickness
              radius: 23, // The radius of the inner circle
              corners: 1, // Corner roundness (0..1)
              rotate: 0, // The rotation offset
              direction: 1, // 1: clockwise, -1: counterclockwise
              color: '#000', // #rgb or #rrggbb or array of colors
              speed: 1, // Rounds per second
              trail: 71, // Afterglow percentage
              shadow: true, // Whether to render a shadow
              hwaccel: false, // Whether to use hardware acceleration
              className: 'spinner', // The CSS class to assign to the spinner
              zIndex: 2e9, // The z-index (defaults to 2000000000)
              top: '50%', // Top position relative to parent in px
              left: '50%' // Left position relative to parent in px
            };
            var target = document.getElementById('loading2');
            spinner = new Spinner(opts).spin(target);
      
            console.log("SHOWING LOADING ANIMATION");
      
          },
      
          hideLoading: function() {
      
            spinner.stop();
      
          },
      
      
          rand: function(searchValue) {
      
            //this.showLoading();
      
      
            // Reset our collections
            myResultsCollection.reset();
      
      
            categoryFilterListCollection.reset();
            organismFilterListCollection.reset();
            organismCollection.reset();
      
            $("#searchbox").css("display", "none");
            
      
      
      
            that = this;
      
            // Get results from the quick search
            var aHelper = new Helper();
      
            value = searchValue.test;
      
      
            // value = $("#textsearch").val();
      
            var someResults = aHelper.quickSearchEverything(value);
      
            // Evaluate the results and render our items
            Q(someResults)
            .then(function(o) {
      
              var myOrganisms = o.organisms
              var myResults = o.results
      
      
              var countedTypes = _.countBy(myResults.results, function(result) {
      
                return result.type;
      
      
              });
      
      
              var o = o.results
      
              var x = 1;
              for(var propt in countedTypes){
                  var anotherModel = new FilterListItem({name: propt, count: countedTypes[propt] });
      
                  categoryFilterListCollection.add(anotherModel);
                  filterTypeArr.push(propt);
      
              }
      
              // Build our filter object:
      
      
      
              // Build a collection
              // var myResultsCollection = new ResultsCollection();
      
              // Add our models to our collection
      
              // Build our collections of filters
      
      
      
      
              // Create Views for our DATATYPES
              //var categoryFilterListCollection = new FilterListCollection();
              // var x = 1;
              // for(var propt in o.facets.Category){
              //     var anotherModel = new FilterListItem({name: propt, count: o.facets.Category[propt] });
      
      
              //     categoryFilterListCollection.add(anotherModel);
      
              //     console.log("ANOTHER MODEL", anotherModel);
              //     console.log(propt + ': ' + o.facets.Category[propt]);
              //     filterTypeArr.push(propt);
      
              // }
              var categoryFilterListView = new FilterListView({collection: categoryFilterListCollection, options: "test"});
      
              // Create Views for our ORGANISMS
              //var organismFilterListCollection = new FilterListCollection();
              // for(var propt in o.facets.organisms){
              //     var anotherModel = new FilterListItem({name: propt, count: o.facets.organisms[propt] });
              //     organismFilterListCollection.add(anotherModel);
              //     console.log("ORGANISM MODEL", anotherModel);
              //     console.log(propt + ': ' + o.facets.Category[propt]);
              // }
              
              
              // Create an ORGANISM COLLECTION
              for (var item in myOrganisms) {
                if (myOrganisms.hasOwnProperty(item)) {
                  var newOrganism = new OrganismItem(myOrganisms[item]);
                  organismCollection.add(newOrganism);
                }
               //console.log("next item", item);
              }
      
              var counted = _.countBy(organismCollection.models, function(model) {
      
                return model.get("genus");
      
      
              });
      
      
              // var organismFilterListView = new FilterListView({collection: organismFilterListCollection});
              var organismFilterListView = new OrganismListView({collection: organismCollection});
      
              
              $('#CategoryFilterList').html(categoryFilterListView.render().$el);
              // $('#CategoryFilterList').html("EMPTY");
      
      
              // $('#OrganismFilterList').append(organismFilterListView.render().$el);
      
      
      
              // Now map some data
              //var enabledCategories = _.where(categoryFilterListCollection, {enabled: false});
      
              //console.log("ENABLED CATEGORIES", enabledCategories);
      
              categoryValues = categoryFilterListCollection.map(function(model) {
      
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
              organismValues = organismFilterListCollection.map(function(model) {
      
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
              // categoryValues = categoryFilterListCollection.map(function(model) {
              //   console.log("HERE");
              //   var test = {key: model.get("name"), value: model.get("count")};
              //   return test;
              // });
      
              organismValues = organismFilterListCollection.map(function(model) {
      
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
      
      
              
      
      
      
              // Build chart
              aHelper.buildBarChart(categoryValues, "#datatypechart");
              aHelper.buildBarChart(organismValues, "#organismchart");
      
      
      //        d3.select("#Gene").style("fill", "red");
              _.each(o.results, function(x) {
                var aModel = new ResultModel(x);
                myResultsCollection.add(aModel);
      
              
      
      
      
      
              });
      
      
      
              that.searchResultsCollection = myResultsCollection;
              
              //console.log("filteredResults", filteredResults);
      
              var myResultsTableView = new ResultsTableView({collection: myResultsCollection});
              that.$el.html(myResultsTableView.render().el);
      
              $('#resultscount').html(myResultsCollection.length + " results");
      
      
              var nextvalues = _.groupBy(myResultsCollection, function(item) {
                // console.log("next");
              })
      
      
      
      
              var catPairs = _.pairs(o.facets.Category);
              //aHelper.buildChartOrganisms(catPairs, "type");
      
              var pairs = _.pairs(o.facets.organisms);
      
      
              grouped = organismCollection.groupBy (function(model) {
                return model.get("genus");
              });
      
              //console.log("Grouped", grouped);
      
              // for (var group in grouped) {
              //   //console.log("group", grouped[group]);
              //   var aGenus = new FilterGenusView({models: grouped[group], genus: group, collection: organismCollection});
              //   aGenus.render();
              // }
      
              var orgView = new FilterOrganismView({collection: organismCollection});
      
              //console.log("renderedddddd", orgView.render().$el);
      
              $('#OrganismFilterList').html(orgView.render().$el);
      
      
      
              //var aGenus = new FilterGenusView({models: organismCollection.models, genus: "Drosophila"});
              //aGenus.render();
      
      
      
              // var customFilter = {type: ["Protein", "RNAiResult", "Gene"], taxonId: [7237]};
              // var filtered = myResultsCollection.filter(customFilter);
              // console.log("final filtered", filtered);
      
              myResultsCollection.buildFilter({});
              //myResultsCollection.filterTest();
              
              //that.hideLoading();
              $(".toolbarLeft").removeClass("hidden");
      
      
      
            })
            .then(function() {
              console.log("I am finished");
      
      
            });
      
      
          },
      
      
      
          render: function() {
            return this;
          }
      
        });
      
      
        module.exports = AppView;
    });
  })();

  // Return the main app.
  var main = root.require("MultiMine/src/main.js");

  // AMD/RequireJS.
  if (typeof define !== 'undefined' && define.amd) {
  
    define("MultiMine", [ /* load deps ahead of time */ ], function () {
      return main;
    });
  
  }

  // CommonJS.
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
  }

  // Globally exported.
  else {
  
    root["MultiMine"] = main;
  
  }

  // Alias our app.
  
  root.require.alias("MultiMine/src/main.js", "MultiMine/index.js");
  

})(this);