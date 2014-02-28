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
      
        FilterListCollection.prototype.initialize = function() {
          return console.log("FilterListCollection has been created.");
        };
      
        FilterListCollection.prototype.comparator = function(item) {
          return -item.get("count");
        };
      
        FilterListCollection.prototype.toggleAll = function(value) {
          console.log("FilterListemCollection.toggleAll called with", value);
          _.each(this.models, function(model) {
            return model.set({
              enabled: value
            });
          });
          return console.log("models now", this.models);
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
      
        OrganismCollection.prototype.initialize = function() {
          return console.log("OrganismItem has been created.");
        };
      
        OrganismCollection.prototype.comparator = function(item) {
          return item.get("genus");
        };
      
        OrganismCollection.prototype.toggleAll = function(value) {
          _.each(this.models, function(model) {
            console.log("stepping");
            return model.set({
              enabled: value
            });
          });
          return console.log("models now", this.models);
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
    
      var ResultModel, ResultsCollection, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
      
      ResultModel = require('./ResultModel');
      
      ResultsCollection = (function(_super) {
        __extends(ResultsCollection, _super);
      
        function ResultsCollection() {
          _ref = ResultsCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultsCollection.prototype.model = ResultModel;
      
        ResultsCollection.prototype.globalFilter = {};
      
        ResultsCollection.prototype.initialize = function() {};
      
        ResultsCollection.prototype.comparator = function(mod) {
          return -mod.get("relevance");
        };
      
        ResultsCollection.prototype.buildFilter = function(filterObj) {
          var genus, genusGroups, genusObj, obj, prop, test, types;
          obj = {};
          types = _.countBy(this.models, function(model) {
            return model.get("type");
          });
          genusGroups = _.groupBy(this.models, function(item) {
            return item.get("genus");
          });
          console.log("genusGroup", genusGroups);
          this.globalFilter.genus = [];
          for (genus in genusGroups) {
            if (genus !== "undefined") {
              console.log("genus", genus);
              test = _.map(genusGroups[genus], function(model) {
                return model.get("taxonId");
              });
              genusObj = {};
              genusObj[genus] = test;
              console.log("test", _.uniq(test));
              this.globalFilter.genus.push(genusObj);
            }
          }
          this.globalFilter.type = (function() {
            var _results;
            _results = [];
            for (prop in types) {
              _results.push(prop);
            }
            return _results;
          })();
          return console.log("done with filter", this.globalFilter);
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
                console.log("disposing model", model);
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
          return _.each(filtered, function(model) {
            return console.log("model type", model.get("type"));
          });
        };
      
        ResultsCollection.prototype.filterType = function(typevalues, organismvalues) {
          var results, that;
          console.log("filterType called with type values ", typevalues);
          console.log("filterType called with organism values ", organismvalues);
          that = this;
          results = this.models.filter(function(model) {
            var fields, org, _ref1, _ref2, _ref3;
            fields = model.get("fields");
            org = model.get("taxonId");
            if (organismvalues.length > 0 && typevalues.length < 1) {
              return console.log("case 1");
            } else if (organismvalues.length < 1 && typevalues.length > 0) {
              return _ref1 = model.get("type"), __indexOf.call(typevalues, _ref1) >= 0;
            } else if (organismvalues.length > 0 && typevalues.length > 0) {
              console.log("HELLO", org);
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
              name: "ModMine",
              queryUrl: "http://intermine.modencode.org/query",
              baseUrl: "http://intermine.modencode.org/release-32/"
            }, {
              name: "FlyMine",
              queryUrl: "http://www.flymine.org/query",
              baseUrl: "http://www.flymine.org/release-38.0/"
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
            console.log("Returning final results", _this.totalResults);
            console.log("Returning organism results", _this.organismMap);
            _ref = _this.totalResults.results;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              obj = _ref[_i];
              fields = obj.fields;
              if (fields["organism.name"] !== void 0) {
                found = _.findWhere(_this.organismMap, {
                  name: fields["organism.name"]
                });
                console.log("found", found);
                obj.taxonId = found.taxonId;
                obj.genus = found.genus;
                obj.species = found.species;
                obj.organismName = found.name;
                obj.shortName = found.genus.charAt(0) + ". " + found.species;
                console.log("Saving new item", obj);
              } else if (fields["organism.shortName"] !== void 0) {
                res = fields["organism.shortName"].split(" ");
                parsedSpecies = res[1];
                found = _.findWhere(_this.organismMap, {
                  species: parsedSpecies
                });
                console.log("found", found);
                obj.taxonId = found.taxonId;
                obj.genus = found.genus;
                obj.species = found.species;
                obj.organismName = found.name;
                obj.shortName = found.genus.charAt(0) + ". " + found.species;
                console.log("Saving new item", obj);
              } else {
                console.log("no match for obj", obj);
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
            console.log("Raw results: ", results);
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
            console.log("queryOrganismArray", queryOrganismArray);
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
            var organism, _i, _len;
            console.log("ORGRESULTS", results);
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              organism = results[_i];
              if (organism.taxonId in _this.organismMap) {
                console.log("SKIPPING!!!!!!!!!!!");
              } else {
                _this.organismMap[organism.taxonId] = organism;
              }
            }
            return console.log("can continue");
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
            console.log("key", key);
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
          console.log("CALL THIS FUNICTION", filter);
          if (d.toggled === false || d.toggled === void 0) {
            d.toggled = true;
            console.log("calling mediator for ON", mediator);
            mediator.trigger("filter:apply", [d.data[0], filter]);
          } else if (d.toggled === true) {
            d.toggled = false;
            console.log("calling mediator for OFF", mediator);
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
            console.log("d.toggled is currently set to", d.toggled);
            if (d.toggled === false || d.toggled === void 0) {
              console.log("EXPANDING");
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
          console.log("buildBarchart called with ", dataset);
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
            console.log("D", d);
            return d[0];
          };
          svg = d3.select("#datatypechart").append("svg").attr("width", w).attr("height", h);
          return svg.selectAll("rect").data(dataset2).enter().append("rect").attr("x", function(d, i) {
            console.log("xScale", xScale(i));
            return xScale(i);
          }).attr("y", function(d) {
            console.log("xScale", h - yScale(d[1]));
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
          svg = d3.select(location).append("svg").attr("width", w).attr("height", h);
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
            console.log("D STANDS FOR", d);
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
            console.log("Triggering filter:remove");
            $(this.el).html(this.templateOff({
              result: this.options
            }));
            $(this.el).addClass("off");
            this.enabled = false;
            return mediator.trigger("filter:newremove", {
              genus: this.options.genus
            });
          } else {
            console.log("Triggering filter:apply");
            this.render();
            $(this.el).removeClass("off");
            return this.enabled = true;
          }
        };
      
        FilterGenusView.prototype.showChildren = function() {
          var content;
          console.log(this.options.collection);
          content = $(this.el).find('ul');
          console.log("content", content);
          return content.slideToggle(100, function() {
            return console.log("sliding");
          });
        };
      
        FilterGenusView.prototype.filterAll = function() {
          return console.log("this is me", this);
        };
      
        FilterGenusView.prototype.initialize = function(attr) {
          this.options = attr;
          return console.log("FilterGenusView initialized", this);
        };
      
        FilterGenusView.prototype.render = function() {
          var nextModel, speciesView, ul, _i, _len, _ref1;
          console.log("rendering");
          $(this.el).html(this.template({
            result: this.options
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
      
        FilterGenusView.prototype.toggleMe = function() {
          return console.log("clicked");
        };
      
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
      
        FilterListItemView.prototype.render2 = function() {
          return console.log("second step");
        };
      
        FilterListItemView.prototype.render = function() {
          console.log("RENDER HAS BEEN CALLED?", this.model);
          if (this.model.get("enabled") === true) {
            console.log("model is true");
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            $(this.el).removeClass("off");
            mediator.trigger("filter:apply", [this.model.get("name"), "type"]);
          } else {
            console.log("model is false");
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
            console.log("Triggering filter:remove");
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            this.model.set({
              enabled: false
            });
            return mediator.trigger("filter:remove", [this.model.get("name"), "type"]);
          } else {
            console.log("Triggering filter:apply");
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            this.model.set({
              enabled: true
            });
            $(this.el).removeClass("off");
            return mediator.trigger("filter:apply", [this.model.get("name"), "type"]);
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
            console.log("The mouse has left me.");
            return mediator.trigger("charts:clear", {});
          });
        };
      
        FilterListView.prototype.render = function() {
          var $el;
          $el = $(this.el);
          console.log("Render has been called on FilterListView", this.collection);
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
      
        FilterOrganismItemView.prototype.render2 = function() {
          return console.log("second step");
        };
      
        FilterOrganismItemView.prototype.render = function() {
          console.log("RENDER HAS BEEN CALLED?", this.model);
          if (this.model.get("enabled") === true) {
            console.log("model is true");
            $(this.el).html(this.template({
              result: this.model.toJSON()
            }));
            $(this.el).removeClass("off");
            mediator.trigger("filter:apply", [this.model.get("taxonId"), "organism"]);
          } else {
            console.log("model is false");
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
            console.log("Triggering filter:remove");
            $(this.el).html(this.templateOff({
              result: this.model.toJSON()
            }));
            $(this.el).addClass("off");
            this.model.set({
              enabled: false
            });
            return mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
          } else {
            console.log("Triggering filter:apply");
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
      
        FilterOrganismView.prototype.templateOff = require('../templates/FilterListItemOffTemplate');
      
        FilterOrganismView.prototype.events = function() {
          return {
            "click": "describe"
          };
        };
      
        FilterOrganismView.prototype.showChildren = function() {
          var content;
          console.log(this.options.collection);
          content = $(this.el).find('ul');
          console.log("content", content);
          return content.slideToggle(100, function() {
            return console.log("sliding");
          });
        };
      
        FilterOrganismView.prototype.describe = function() {
          return console.log(this);
        };
      
        FilterOrganismView.prototype.filterAll = function() {
          return console.log("Toggling children.");
        };
      
        FilterOrganismView.prototype.initialize = function(attr) {
          this.options = attr;
          return console.log("FilterOrganismView initialized", this);
        };
      
        FilterOrganismView.prototype.render = function() {
          var group, groups, nextGenus;
          console.log("FilterOrganismView render called.");
          groups = this.options.collection.groupBy(function(model) {
            return model.get("genus");
          });
          for (group in groups) {
            console.log("next group", groups[group]);
            nextGenus = new FilterGenusView({
              models: groups[group],
              genus: group
            });
            $(this.el).append(nextGenus.render().$el);
          }
          console.log("my el from org view", $(this.el));
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
          mediator.trigger("filter:remove", [this.model.get("taxonId"), "organism"]);
          return console.log(this.model.get("species") + " has been clicked");
        };
      
        FilterSpeciesView.prototype.initialize = function(attr) {
          this.options = attr;
          return console.log("FilterSpeciesView initialized", this);
        };
      
        FilterSpeciesView.prototype.render = function() {
          console.log("Rendering a FilterSpeciesView");
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
      
        OrganismListView.prototype.initialize = function() {
          return $(this.el).mouseleave(function() {
            console.log("The mouse has left me.");
            return mediator.trigger("charts:clear", {});
          });
        };
      
        OrganismListView.prototype.render = function() {
          var $el;
          $el = $(this.el);
          console.log("Render has been called on OrganismListView", this.collection);
          this.collection.each(function(nextModel) {
            var itemView;
            itemView = new FilterOrganismItemView({
              model: nextModel
            });
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
          return this.model.on('change:show', this.toggleVisible, this);
        };
      
        ResultView.prototype.toggleVisible = function() {
          return $(this.el).toggleClass('hidden', !this.model.get("show"));
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
          ResultsTableView.__super__.initialize.apply(this, arguments);
          return console.log("ResultTable Initialized with collection:", this.collection);
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
      
        var tview;
      
        var categoryFilterListCollection = new FilterListCollection();
        var organismFilterListCollection = new FilterListCollection();
      
        var globalFilter = {};
      
      
        // The Application
        // --------------
        var AppView = Backbone.View.extend({
      
          el: '#search-results',
      
          initialize: function(params) {
      
            console.log("initialized");
      
      
            // Add the "ENTER" keypress to our search box:
      
            $('#' + params.input).on('keypress', function(e) {
              console.log("triggered");
              if (e.keyCode == 13) {
                
                mediator.trigger('rand', {});
                return false;
              }
            });
      
            $('#hideAllDataTypes').on('click', function(e) {
              mediator.trigger('hideAllDataTypes', {});
            });
      
            $('#showAllDataTypes').on('click', function(e) {
              mediator.trigger('showAllDataTypes', {});
            });
      
            $('#hideAllOrganisms').on('click', function(e) {
              mediator.trigger('hideAllOrganisms', {});
            });
      
             $('#showAllOrganisms').on('click', function(e) {
              mediator.trigger('showAllOrganisms', {});
            });
      
      
      
      
            // Attach our listeners to the medaitor
      
            mediator.on('rand', this.rand, this);
            mediator.on('column:add', this.addColumn, this);
            mediator.on('filter:apply', this.applyFilter, this);
            mediator.on('filter:remove', this.removeFilter, this);
            mediator.on('filter:hello', this.test2, this);
            mediator.on('medTest', this.test, this);
      
            mediator.on('charts:clear', this.clearCharts, this);
      
            mediator.on('hideAllDataTypes', this.hideAllDataTypes, this);
            mediator.on('showAllDataTypes', this.showAllDataTypes, this);
            mediator.on('hideAllOrganisms', this.hideAllOrganisms, this);
            mediator.on('showAllOrganisms', this.showAllOrganisms, this);
      
            mediator.on('filter:newremove', this.newremove, this);
            //this.rand();
      
      /*
            $('#' + params.input).on('keyup change', function() {
              console.log("changed");
            });*/
      
            // Listen to our mediator for events
      
      
            // tview = new ResultsTypeCategoryView({model: typecat});
            // tview.render();
      
            // Set up our mock filters:
      
            // models...
            // var mod1 = new FilterListItem();
            // var mod2 = new FilterListItem();
            // var mod3 = new FilterListItem();
      
            // // var view1 = new ResultsTypeCategoryView({model: mod1});
            // // var view2 = new ResultsTypeCategoryView({model: mod2});
            // // var view3 = new ResultsTypeCategoryView({model: mod3});
      
            // mod1.set({name: "Publications"});
            // mod2.set({name: "Proteins"});
            // mod3.set({name: "Authors"});
      
            // // $('#typecategories').append(view1.render().el);
            // // $('#typecategories').append(view2.render().el);
            // // $('#typecategories').append(view3.render().el);
            // // //console.log("rendered: ", view1.render().el);
      
            // var newFilterListCollection = new FilterListCollection();
      
            // newFilterListCollection.add(mod1);
            // newFilterListCollection.add(mod2);
            // newFilterListCollection.add(mod3);
      
            // Now create our ListView
            //var newFilterListView = new FilterListView({collection: newFilterListCollection});
            //$('#FilterList').append(newFilterListView.render().$el);
            //$('#FilterList').append(newFilterListView.render().$el);
            //newFilterListecollection
        
      
      
      
      
      
      
            
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
      
            organismFilterListCollection.toggleAll(false);
      
          },
      
          showAllOrganisms: function() {
      
            organismFilterListCollection.toggleAll(true);
      
          },
      
      
      
          test2: function() {
            typecat.toggle();
            tview.render();
            console.log("TYPECAT2", typecat.get("enabled"));
            
          },
      
          clearCharts: function() {
            //alert('clearing charts');
            d3.selectAll(".mychart").style("fill", "#808080")
            //d3.select("#" + @model.get("name")).style("fill", "white");
          },
      
          removeFilter: function(value) {
      
      
      
      
            console.log("REMOVE FILTER CALLED");
      
            _.each(myResultsCollection.models, function(aModel) {
              console.log("nextModel", aModel);
              aModel.set({show: false});
            });
      
      
      
      
            console.log("removeFilter called with ", value);
      
            if (value[1] === "type") {
              filterTypeArr = _.without(filterTypeArr, value[0]);
            } else if (value[1] === "organism") {
              console.log("filterOrganismArr is", filterOrganismArr);
              filterOrganismArr = _.without(filterOrganismArr, value[0]);
            }
      
            var nResults = myResultsCollection.filterType(filterTypeArr, filterOrganismArr);
            console.log("filtered results", nResults);
            _.each(nResults, function(aModel) {
                console.log("nextModel2", aModel);
                aModel.set({show: true});
            });
      
            console.log ("filterTypeArr is now ", filterTypeArr.length);
      
      
            // if (filterTypeArr.length < 1) {
            //   console.log("SHOWING ALL ITEMS");
            //   _.each(myResultsCollection.models, function(aModel) {
            //     aModel.set({show: true});
            //   });
            // }
      
            
      
      
          },
      
          applyFilter: function(value) {
      
            console.log("calling applyFilter with value", value);
      
            // Hide all of our results:
            _.each(myResultsCollection.models, function(aModel) {
              aModel.set({show: false});
            });
      
            console.log("applyFilter called with ", value[0]);
            if (value[1] === "type") {
              filterTypeArr.push(value[0]);
            } else if (value[1] === "organism") {
              filterOrganismArr.push(value[0]);
            }
            
      
            var nResults = myResultsCollection.filterType(filterTypeArr, filterOrganismArr);
            console.log("filtered results", nResults);
            _.each(nResults, function(aModel) {
                console.log("nextModel2", aModel);
                aModel.set({show: true});
            });
      
          },
      
          test: function(val) {
            console.log("test called with ", val);
            filterTypeArr.push(val[0]);
            var nResults = myResultsCollection.filterType(filterTypeArr);
            console.log("filtered results", nResults);
            _.each(nResults, function(aModel) {
                console.log("nextModel2", aModel);
                aModel.set({show: true});
            });
          },
      
      
          rand: function() {
      
      
            $("#searchbox").css("display", "none");
      
            that = this;
      
            // Get results from the quick search
            var aHelper = new Helper();
            value = $("#textsearch").val();
            var someResults = aHelper.quickSearchEverything(value);
      
            // Evaluate the results and render our items
            Q(someResults)
            .then(function(o) {
              console.log("TOTALLED RESULTSs", o);
              var myOrganisms = o.organisms
              var myResults = o.results
      
              console.log("my results", myResults.results);
      
              var countedTypes = _.countBy(myResults.results, function(result) {
      
                return result.type;
      
      
              });
      
      
              var o = o.results
      
              var x = 1;
              for(var propt in countedTypes){
                  var anotherModel = new FilterListItem({name: propt, count: countedTypes[propt] });
      
      
                  categoryFilterListCollection.add(anotherModel);
      
                  console.log("ANOTHER MODEL", anotherModel);
                  console.log(propt + ': ' + countedTypes[propt]);
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
              
      
              console.log("MY ORGANISMS", myOrganisms);
              var organismCollection = new OrganismCollection();
              // Create an ORGANISM COLLECTION
              for (var item in myOrganisms) {
                if (myOrganisms.hasOwnProperty(item)) {
                  var newOrganism = new OrganismItem(myOrganisms[item]);
                  organismCollection.add(newOrganism);
                  console.log("key ", myOrganisms[item]);
                }
               //console.log("next item", item);
              }
              console.log("PLEASE LOOK FOR ME3", organismCollection);
      
              var counted = _.countBy(organismCollection.models, function(model) {
      
                return model.get("genus");
      
      
              });
      
              console.log("sorted", counted);
      
              // var organismFilterListView = new FilterListView({collection: organismFilterListCollection});
              var organismFilterListView = new OrganismListView({collection: organismCollection});
      
              
      
            
              console.log("PLEASE LOOK FOR ME21");
      
      
              console.log("populated organismCollection", organismCollection);
              $('#CategoryFilterList').append(categoryFilterListView.render().$el);
              // $('#OrganismFilterList').append(organismFilterListView.render().$el);
      
              console.log("PRE MAP");
      
              // Now map some data
              console.log("category", categoryFilterListCollection);
              //var enabledCategories = _.where(categoryFilterListCollection, {enabled: false});
      
              console.log("POST MAP");
              //console.log("ENABLED CATEGORIES", enabledCategories);
      
              categoryValues = categoryFilterListCollection.map(function(model) {
                console.log("HERE");
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
              organismValues = organismFilterListCollection.map(function(model) {
                console.log("HERE");
                var test = {key: model.get("name"), value: model.get("count")};
                return test;
              });
      
              // categoryValues = categoryFilterListCollection.map(function(model) {
              //   console.log("HERE");
              //   var test = {key: model.get("name"), value: model.get("count")};
              //   return test;
              // });
      
              // organismValues = organismFilterListCollection.map(function(model) {
              //   console.log("HERE");
              //   var test = {key: model.get("name"), value: model.get("count")};
              //   return test;
              // });
      
              console.log("next");
      
              
      
      
      
              // Build chart
              aHelper.buildBarChart(categoryValues, "#datatypechart");
              aHelper.buildBarChart(organismValues, "#organismchart");
      
              organismFilterListCollection.toggleAll(true);
              // aHelper.buildBarChart(values, "#organismchart");
      
              console.log("done building chart");
      
              //that.hideAllDataTypes();
      
              console.log("done again");
      
              
      
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
      
      
      
              console.log("myResultsCollection", myResultsCollection);
              var nextvalues = _.groupBy(myResultsCollection, function(item) {
                console.log("next");
              })
      
              console.log("next values: ", nextvalues);
      
              // var filteredResults = myResultsCollection.byType("Gene");
        
      
              // console.log("filtered results: ", filteredResults);
      
              // var testResults = _.filter(myResultsCollection, function(result) {
              //     return result.get("type") == "Gene";
              // });
      
      
              //console.log("testResults", testResults);
              // _.each(testResults, function(result) {
              //   //console.log("HELP ME", result.get("type"));
              // });
      
      
              var catPairs = _.pairs(o.facets.Category);
              console.log("catPairs", catPairs);
              //aHelper.buildChartOrganisms(catPairs, "type");
      
      
           
              var pairs = _.pairs(o.facets.organisms);
              console.log("pairs", pairs);
              //aHelper.buildChartOrganisms(pairs, "organism");
      
              // Now get the stats for our bar charts:
            
      
              //aHelper.buildBarChartNew([["one", 1], ["two", 2], ["three", 3]]);
              //aHelper.buildBarChart2();
      
              console.log("bar chart built");
      
              console.log("collection", myResultsCollection);
      
              console.log("now doing some filtering");
      
      
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
              console.log("Rendering orgView");
              //console.log("renderedddddd", orgView.render().$el);
      
              $('#OrganismFilterList').append(orgView.render().$el);
      
              console.log("Done rendering orgView");
      
              //var aGenus = new FilterGenusView({models: organismCollection.models, genus: "Drosophila"});
              //aGenus.render();
      
              console.log("done");
      
              var customFilter = {type: ["Protein", "RNAiResult", "Gene"], taxonId: [7237]};
              var filtered = myResultsCollection.filter(customFilter);
              console.log("final filtered", filtered);
      
            myResultsCollection.buildFilter({});
      
      
            console.log("That's all, folks.");
      
      
      
      
      
      
      /*
              var nResults = myResultsCollection.filterType("Something");
              console.log("nResults", nResults);
      
              _.each(nResults, function(aModel) {
                console.log("nextModel", aModel);
                aModel.set({show: true});
              });
      
              var thirdModel = myResultsCollection.at(3);
              console.log("third model", thirdModel);
      
              
      
              var val = _.contains(myResultsCollection.models, thirdModel);
              console.log("val", val);
      */
      
      
      
      
            
      
      
      /*
              myResultsCollection.each(function(model) {
                model.set({show: true});
              });*/
              //$el.append(myResultsTableView.render().$el);
              //myResultsTableView.render();   
      
      
        
              /*
              console.log("SOME RESULTS FACETS", o);
              var pairs = _.pairs(o.facets.organisms);
              console.log("pairs", pairs);
              aHelper.buildChartOrganisms(pairs);
              */
            })
            .then(function() {
              console.log("I am finished");
      
            });
      
            // Now our data is collected.
      
            //aHelper.calcOrganisms(someResults);
      
      
      
      
      
          },
      
          rand2: function() {
          var aHelper = new Helper();
          value = $("#textsearch").val();
          someResults = aHelper.quickSearchSingle(value);
      
          Q(someResults)
          .then(function(o){
            var categories = aHelper.calcCategories(o);
            var organisms = aHelper.calcOrganisms(o);
      
            aHelper.buildChart(categories);
            aHelper.buildChart(organisms);
            return someData;
             // console.log(JSON.stringify(o, null, 2));
            })
          .then(function() {
            aHelper.buildChart(someData);
          })
          .then(function() {
            someData = aHelper.calc
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