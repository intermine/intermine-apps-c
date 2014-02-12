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
      var SecView = require('./views/SecondaryView');
      
      var $ = require('./modules/dependencies').$;
      
      module.exports = function(params) {
      
      
      	var view = new AppView(params);
      	//if ($(params.target).length != 1) throw "Not found";
      	// console.log(params.input);
      	view.setElement($(params.target));
      	view.render();
      
      
      
      	
      
      	var throttled = _.throttle(updatePosition, 1000);
      	$(window).scroll(throttled);
      
      	function updatePosition() {
      		// console.log("updated position");
      	}
      
      	var sec = new SecView();
      
      
      
      	updatePosition();
      
      }
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
          var fields, firstletter, neworganism, split;
          fields = this.get("fields");
          if (this.get("relevance") > 1.0) {
            this.set({
              relevance: 1
            });
          }
          mediator.on('filter:show', this.filter);
          if (fields["organism.shortName"] === null || fields["organism.shortName"] === "" || fields["organism.shortName"] === void 0) {
            if (fields["organism.name"] !== void 0) {
              split = fields["organism.name"].split(" ");
              firstletter = split[0].substring(0, 1);
              neworganism = firstletter + ". " + split[1];
              console.log("split values", firstletter);
              return fields["organism.shortName"] = neworganism;
            }
          }
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
      
        ResultsCollection.prototype.initialize = function() {};
      
        ResultsCollection.prototype.comparator = function(mod) {
          return -mod.get("relevance");
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
          console.log("filterType called with values ", organismvalues);
          that = this;
          results = this.models.filter(function(model) {
            var fields, org, _ref1, _ref2;
            fields = model.get("fields");
            org = fields["organism.shortName"];
            if (organismvalues.length > 0 && typevalues.length < 1) {
              return __indexOf.call(organismvalues, org) >= 0;
            } else if (organismvalues.length < 1 && typevalues.length > 0) {
              return _ref1 = model.get("type"), __indexOf.call(typevalues, _ref1) >= 0;
            } else if (organismvalues.length > 0 && typevalues.length > 0) {
              return __indexOf.call(organismvalues, org) >= 0 && (_ref2 = model.get("type"), __indexOf.call(typevalues, _ref2) >= 0);
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
          this.testjson = require('./testjson');
          this.testjson = [this.testjson];
          this.totalResults = {
            facets: {
              Category: {},
              organisms: {}
            },
            results: []
          };
          this.globalFilter = [];
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
            return _this.totalResults;
          });
        };
      
        MyHelper.prototype.runOne = function(mineUrl, term, mineName, mineBase) {
          var def, service;
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
          return def.promise;
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
          canvasWidth = 300;
          canvasHeight = 200;
          outerRadius = 75;
          innerRadius = 30;
          w = 130;
          h = 130;
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
          }).style("fill", "Black").style("font", "12px Arial").text(function(d, i) {
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

    
    // testjson.coffee
    root.require.register('MultiMine/src/modules/testjson.js', function(exports, require, module) {
    
      var obj;
      
      obj = {
        facets: {
          Category: {
            Gene: 42,
            ProteinDomain: 5,
            InteractionExperiment: 4,
            Publication: 122,
            OntologyTermSynonym: 1,
            GOTerm: 2,
            Protein: 47
          },
          "organism.shortName": {
            "D. mojavensis": 16,
            "D. simulans": 1,
            "H. sapiens": 1,
            "D. melanogaster": 25,
            "C. remanei": 1,
            "D. pseudoobscura": 14,
            "D. ananassae": 1,
            "D. yakuba": 19,
            "D. virilis": 11
          },
          "experiment.name": {}
        },
        results: [
          {
            id: 140799701,
            relevance: 5.41722,
            type: "Gene",
            fields: {
              primaryIdentifier: "Adh",
              source: "modENCODE-Annotation of the developmental transcriptome of Drosophila melanogaster",
              secondaryIdentifier: "Adh",
              "organism.shortName": "D. melanogaster"
            }
          }, {
            id: 1012832,
            relevance: 2.8725471,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0000055",
              symbol: "Adh",
              source: "FlyBase",
              name: "Alcohol dehydrogenase",
              secondaryIdentifier: "CG3481",
              "organism.shortName": "D. melanogaster"
            }
          }, {
            id: 1067874,
            relevance: 0.66355073,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0000054",
              symbol: "Adf1",
              source: "FlyBase",
              name: "Adh transcription factor 1",
              secondaryIdentifier: "CG15845",
              "organism.shortName": "D. melanogaster"
            }
          }, {
            id: 29900621,
            relevance: 0.62260634,
            type: "OntologyTermSynonym",
            fields: {
              name: "ADH",
              type: "related_synonym"
            }
          }, {
            id: 7005809,
            relevance: 0.3736472,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0012113",
              symbol: "Dana\\Adh",
              source: "FlyBase",
              name: "Alcohol dehydrogenase",
              secondaryIdentifier: "GF14888",
              "organism.shortName": "D. ananassae"
            }
          }, {
            id: 7420156,
            relevance: 0.3507608,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0013162",
              symbol: "Dyak\\Adh",
              source: "FlyBase",
              name: "Alcohol dehydrogenase",
              secondaryIdentifier: "GE19037",
              "organism.shortName": "D. yakuba"
            }
          }, {
            id: 13030573,
            relevance: 0.3113727,
            type: "Gene",
            fields: {
              primaryIdentifier: "551",
              symbol: "AVP",
              name: "arginine vasopressin",
              "organism.shortName": "H. sapiens"
            }
          }, {
            id: 56035871,
            relevance: 0.30276686,
            type: "Publication",
            fields: {
              firstAuthor: "Gilsohn E",
              journal: "Cell Adh Migr",
              title: "Fine tuning cellular recognition: The function of the leucine rich repeat (LRR) trans-membrane protein, LRT, in muscle targeting to tendon cells.",
              pages: "368-71",
              volume: "4",
              pubMedId: "20404543",
              year: 2010
            }
          }, {
            id: 56035976,
            relevance: 0.30276686,
            type: "Publication",
            fields: {
              firstAuthor: "Liu ZC",
              journal: "Cell Adh Migr",
              title: "\"Importin\" signaling roles for import proteins: the function of Drosophila importin-7 (DIM-7) in muscle-tendon signaling.",
              pages: "4-12",
              volume: "6",
              pubMedId: "22647935",
              year: 2012
            }
          }, {
            id: 56036011,
            relevance: 0.30276686,
            type: "Publication",
            fields: {
              firstAuthor: "Choi KW",
              journal: "Cell Adh Migr",
              title: "To cease or to proliferate: new insights into TCTP function from a Drosophila study.",
              pages: "129-30",
              volume: "1",
              pubMedId: "19262129",
              year: 2007
            }
          }, {
            id: 56036127,
            relevance: 0.30276686,
            type: "Publication",
            fields: {
              firstAuthor: "Arpin M",
              journal: "Cell Adh Migr",
              title: "Emerging role for ERM proteins in cell adhesion and migration.",
              pages: "199-206",
              volume: "5",
              pubMedId: "21343695",
              year: 2011
            }
          }, {
            id: 7006061,
            relevance: 0.28848624,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0012566",
              symbol: "Dmoj\\Adh1",
              source: "FlyBase",
              name: "Alcohol dehydrogenase-1",
              secondaryIdentifier: "GI17644",
              "organism.shortName": "D. mojavensis"
            }
          }, {
            id: 7374187,
            relevance: 0.28848624,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0014836",
              symbol: "Dvir\\Adh1",
              source: "FlyBase",
              name: "Alcohol dehydrogenase 1",
              secondaryIdentifier: "GJ18208",
              "organism.shortName": "D. virilis"
            }
          }, {
            id: 7374192,
            relevance: 0.28848624,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0014837",
              symbol: "Dvir\\Adh2",
              source: "FlyBase",
              name: "Alcohol dehydrogenase 2",
              secondaryIdentifier: "GJ18209",
              "organism.shortName": "D. virilis"
            }
          }, {
            id: 6001877,
            relevance: 0.25734895,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0243561",
              symbol: "Dpse\\Adh",
              source: "FlyBase",
              secondaryIdentifier: "GA17214",
              "organism.shortName": "D. pseudoobscura"
            }
          }, {
            id: 7006367,
            relevance: 0.25734895,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0012567",
              symbol: "Dmoj\\Adh2",
              source: "FlyBase",
              name: "Alcohol dehydrogenase-2",
              secondaryIdentifier: "GI17643",
              "organism.shortName": "D. mojavensis"
            }
          }, {
            id: 7006389,
            relevance: 0.24909815,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0012824",
              symbol: "Dsim\\Adh",
              source: "FlyBase",
              name: "Alcohol dehydrogenase",
              secondaryIdentifier: "GD23968",
              "organism.shortName": "D. simulans"
            }
          }, {
            id: 7394503,
            relevance: 0.2262117,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0013163",
              symbol: "Dyak\\jgw",
              source: "FlyBase",
              name: "jingwei",
              secondaryIdentifier: "GE10683",
              "organism.shortName": "D. yakuba"
            }
          }, {
            id: 1131895,
            relevance: 0.21796088,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0005694",
              symbol: "Aef1",
              source: "FlyBase",
              name: "Adult enhancer factor 1",
              secondaryIdentifier: "CG5683",
              "organism.shortName": "D. melanogaster"
            }
          }, {
            id: 16505184,
            relevance: 0.1868236,
            type: "Protein",
            fields: {
              primaryAccession: "P05552-2",
              "organism.name": "Drosophila melanogaster",
              primaryIdentifier: "ADF1_DROME-2"
            }
          }, {
            id: 1027498,
            relevance: 0.16393717,
            type: "Gene",
            fields: {
              primaryIdentifier: "FBgn0000056",
              symbol: "Adhr",
              source: "FlyBase",
              name: "Adh-related",
              secondaryIdentifier: "CG3484",
              "organism.shortName": "D. melanogaster"
            }
          }, {
            id: 5498039,
            relevance: 0.16124175,
            type: "InteractionExperiment",
            fields: {
              name: "Genetic and cytogenetic analysis of the Adh region in Drosophila melanogaster."
            }
          }, {
            id: 27087925,
            relevance: 0.16124175,
            type: "InteractionExperiment",
            fields: {
              description: "Genetic and cytogenetic analysis of the Adh region in Drosophila melanogaster.",
              name: "ODonnell J (1977)"
            }
          }, {
            id: 1397078,
            relevance: 0.15568635,
            type: "Protein",
            fields: {
              primaryAccession: "P05552",
              "organism.name": "Drosophila melanogaster",
              primaryIdentifier: "FBpp0089262"
            }
          }, {
            id: 6036892,
            relevance: 0.14574471,
            type: "Publication",
            fields: {
              firstAuthor: "Dorit RL",
              journal: "J Mol Evol",
              title: "ADH evolution and the phylogenetic footprint.",
              pages: "658-62",
              volume: "40",
              pubMedId: "7643416",
              year: 1995
            }
          }, {
            id: 5502000,
            relevance: 0.14108653,
            type: "InteractionExperiment",
            fields: {
              name: "An exploration of the sequence of a 2.9-Mb region of the genome of Drosophila melanogaster. The Adh region."
            }
          }, {
            id: 27098996,
            relevance: 0.14108653,
            type: "InteractionExperiment",
            fields: {
              description: "An exploration of the sequence of a 2.9-Mb region of the genome of Drosophila melanogaster: the Adh region.",
              name: "Ashburner M (1999)"
            }
          }, {
            id: 29526656,
            relevance: 0.13619514,
            type: "GOTerm",
            fields: {
              description: "Catalysis of the reaction: 2,2'-iminodipropanoate + H(2)O + NAD(+) = L-alanine + H(+) + NADH + pyruvate.",
              name: "alanopine dehydrogenase activity",
              identifier: "GO:0047636"
            }
          }, {
            id: 1012843,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Kreitman ME",
              journal: "Genetics",
              title: "Excess polymorphism at the Adh locus in Drosophila melanogaster.",
              pages: "93-110",
              volume: "114",
              pubMedId: "3021568",
              year: 1986
            }
          }, {
            id: 1012853,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Marfany G",
              journal: "Mol Biol Evol",
              title: "The Drosophila subobscura Adh genomic region contains valuable evolutionary markers.",
              pages: "261-77",
              volume: "9",
              pubMedId: "1560762",
              year: 1992
            }
          }, {
            id: 1013052,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Cohn VH",
              journal: "J Mol Evol",
              title: "Nucleotide sequence comparison of the Adh gene in three drosophilids.",
              pages: "31-7",
              volume: "20",
              pubMedId: "6429340",
              year: 1984
            }
          }, {
            id: 1013057,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "McDonald JF",
              journal: "Genetics",
              title: "Biochemical differences between products of the Adh locus in Drosophila.",
              pages: "1013-22",
              volume: "95",
              pubMedId: "6781982",
              year: 1980
            }
          }, {
            id: 1013074,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Maroni G",
              journal: "Genetics",
              title: "Genetic variation in the expression of ADH in Drosophila melanogaster.",
              pages: "431-46",
              volume: "101",
              pubMedId: "6816669",
              year: 1982
            }
          }, {
            id: 1013096,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Atkinson PW",
              journal: "Genetics",
              title: "Structure and evolution of the Adh genes of Drosophila mojavensis.",
              pages: "713-23",
              volume: "120",
              pubMedId: "3224808",
              year: 1988
            }
          }, {
            id: 1013101,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Vigue C",
              journal: "Biochem Genet",
              title: "Adh-n5: a temperature-sensitive mutant at the Adh locus in Drosophila.",
              pages: "387-96",
              volume: "11",
              pubMedId: "4210301",
              year: 1974
            }
          }, {
            id: 1013121,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Langley CH",
              journal: "Proc Natl Acad Sci U S A",
              title: "Restriction map variation in the Adh region of Drosophila.",
              pages: "5631-5",
              volume: "79",
              pubMedId: "6291056",
              year: 1982
            }
          }, {
            id: 1013192,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Albalat R",
              journal: "Nucleic Acids Res",
              title: "Nucleotide sequence of the Adh gene of Drosophila lebanonensis.",
              pages: "6706",
              volume: "18",
              pubMedId: "2251140",
              year: 1990
            }
          }, {
            id: 1013194,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Juan E",
              journal: "Nucleic Acids Res",
              title: "Nucleotide sequence of the Adh gene of Drosophila lebanonensis.",
              pages: "6420",
              volume: "18",
              pubMedId: "2243785",
              year: 1990
            }
          }, {
            id: 1013230,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Villarroya A",
              journal: "J Mol Evol",
              title: "ADH and phylogenetic relationships of Drosophila lebanonesis (Scaptodrosophila).",
              pages: "421-8",
              volume: "32",
              pubMedId: "1904097",
              year: 1991
            }
          }, {
            id: 1013232,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "McDonald JH",
              journal: "Nature",
              title: "Adaptive protein evolution at the Adh locus in Drosophila.",
              pages: "652-4",
              volume: "351",
              pubMedId: "1904993",
              year: 1991
            }
          }, {
            id: 1013294,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Li XM",
              journal: "Proc Biol Sci",
              title: "Synergistic effect of Adh alleles in Drosophila melanogaster.",
              pages: "9-16",
              volume: "247",
              pubMedId: "1348124",
              year: 1992
            }
          }, {
            id: 1013320,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Ohler U",
              journal: "Genome Res",
              title: "Promoter prediction on a genomic scale--the Adh experience.",
              pages: "539-42",
              volume: "10",
              pubMedId: "10779494",
              year: 2000
            }
          }, {
            id: 1013364,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Freidman R",
              journal: "Genetica",
              title: "Interactions between the regulatory regions of two Adh alleles.",
              pages: "1-14",
              volume: "97",
              pubMedId: "8851878",
              year: 1996
            }
          }, {
            id: 2884782,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Gaasterland T",
              journal: "Genome Res",
              title: "MAGPIE/EGRET annotation of the 2.9-Mb Drosophila melanogaster Adh region.",
              pages: "502-10",
              volume: "10",
              pubMedId: "10779489",
              year: 2000
            }
          }, {
            id: 7006065,
            relevance: 0.121453926,
            type: "Publication",
            fields: {
              firstAuthor: "Sullivan DT",
              journal: "Mol Biol Evol",
              title: "Unusual molecular evolution of an Adh pseudogene in Drosophila.",
              pages: "443-58",
              volume: "11",
              pubMedId: "8015438",
              year: 1994
            }
          }, {
            id: 16526791,
            relevance: 0.10898044,
            type: "Protein",
            fields: {
              primaryAccession: "Q08605",
              "organism.name": "Drosophila melanogaster",
              primaryIdentifier: "GAGA_DROME"
            }
          }, {
            id: 16526825,
            relevance: 0.10898044,
            type: "Protein",
            fields: {
              primaryAccession: "Q08605-4",
              "organism.name": "Drosophila melanogaster",
              primaryIdentifier: "GAGA_DROME-4"
            }
          }, {
            id: 16526854,
            relevance: 0.10898044,
            type: "Protein",
            fields: {
              primaryAccession: "Q08605-2",
              "organism.name": "Drosophila melanogaster",
              primaryIdentifier: "GAGA_DROME-2"
            }
          }, {
            id: 16526883,
            relevance: 0.10898044,
            type: "Protein",
            fields: {
              primaryAccession: "Q08605-3",
              "organism.name": "Drosophila melanogaster",
              primaryIdentifier: "GAGA_DROME-3"
            }
          }, {
            id: 29075270,
            relevance: 0.09728224,
            type: "GOTerm",
            fields: {
              description: "Catalysis of the reaction: an alcohol + NAD+ = an aldehyde or ketone + NADH + H+.",
              name: "alcohol dehydrogenase (NAD) activity",
              identifier: "GO:0004022"
            }
          }, {
            id: 1003245,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "O'Donnell J",
              journal: "Genetics",
              title: "Genetic and cytogenetic analysis of the Adh region in Drosophila melanogaster.",
              pages: "553-66",
              volume: "86",
              pubMedId: "408228",
              year: 1977
            }
          }, {
            id: 1003301,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Visa N",
              journal: "Chromosoma",
              title: "A cytological and molecular analysis of Adh gene expression in Drosophila melanogaster polytene chromosomes.",
              pages: "171-7",
              volume: "97",
              pubMedId: "2465876",
              year: 1988
            }
          }, {
            id: 1005327,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Hansen SK",
              journal: "Cell",
              title: "TAFs and TFIIA mediate differential utilization of the tandem Adh promoters.",
              pages: "565-75",
              volume: "82",
              pubMedId: "7664336",
              year: 1995
            }
          }, {
            id: 1010187,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Fossett NG",
              journal: "Mutat Res",
              title: "Analysis of ENU-induced mutations at the Adh locus in Drosophila melanogaster.",
              pages: "73-85",
              volume: "231",
              pubMedId: "2114535",
              year: 1990
            }
          }, {
            id: 1012847,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Marfany G",
              journal: "J Mol Evol",
              title: "The Adh genomic region of Drosophila ambigua: evolutionary trends in different species.",
              pages: "454-62",
              volume: "32",
              pubMedId: "1908016",
              year: 1991
            }
          }, {
            id: 1012848,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Chia W",
              journal: "J Mol Biol",
              title: "Mutation of the Adh gene of Drosophila melanogaster containing an internal tandem duplication.",
              pages: "679-88",
              volume: "186",
              pubMedId: "2419573",
              year: 1985
            }
          }, {
            id: 1012859,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Oppentocht JE",
              journal: "Mol Biol Evol",
              title: "Isolation and characterization of the genomic region from Drosophila kuntzei containing the Adh and Adhr genes.",
              pages: "1026-40",
              volume: "19",
              pubMedId: "12082123",
              year: 2002
            }
          }, {
            id: 1012861,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Albalat R",
              journal: "Genetica",
              title: "Analysis of nucleotide substitutions and amino acid conservation in the Drosophila Adh genomic region.",
              pages: "27-36",
              volume: "94",
              pubMedId: "7729694",
              year: 1994
            }
          }, {
            id: 1012864,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Marfany G",
              journal: "Mol Phylogenet Evol",
              title: "Characterization and evolution of the Adh genomic region in Drosophila guanche and Drosophila madeirensis.",
              pages: "13-22",
              volume: "2",
              pubMedId: "8081544",
              year: 1993
            }
          }, {
            id: 1012886,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Albalat R",
              journal: "Gene",
              title: "Adh and Adh-dup sequences of Drosophila lebanonensis and D. immigrans: interspecies comparisons.",
              pages: "171-8",
              volume: "126",
              pubMedId: "8482531",
              year: 1993
            }
          }, {
            id: 1012939,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Chia W",
              journal: "J Mol Biol",
              title: "Molecular analysis of the Adh region of the genome of Drosophila melanogaster.",
              pages: "689-706",
              volume: "186",
              pubMedId: "3005593",
              year: 1985
            }
          }, {
            id: 1012940,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Oudman L",
              journal: "Heredity (Edinb)",
              title: "Interaction between the Adh and alpha Gpdh loci in Drosophila melanogaster: adult survival at high temperature.",
              pages: "289-97",
              volume: "68 ( Pt 4)",
              pubMedId: "1563965",
              year: 1992
            }
          }, {
            id: 1012959,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Ren B",
              journal: "EMBO J",
              title: "Regulation of Drosophila Adh promoter switching by an initiator-targeted repression mechanism.",
              pages: "1076-86",
              volume: "17",
              pubMedId: "9463385",
              year: 1998
            }
          }, {
            id: 1012961,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Kamping A",
              journal: "Biochem Genet",
              title: "Alcohol dehydrogenase polymorphism in populations of Drosophila melanogaster. II. Relation between ADH activity and adult mortality.",
              pages: "541-51",
              volume: "16",
              pubMedId: "104710",
              year: 1978
            }
          }, {
            id: 1012964,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Khaustova ND",
              journal: "Genetika",
              title: "[The ADH gene-enzyme system and the fitness of Drosophila melanogaster mutants].",
              pages: "600-5",
              volume: "35",
              pubMedId: "10495947",
              year: 1999
            }
          }, {
            id: 1012972,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Pecsenye K",
              journal: "Biochem Genet",
              title: "Interaction between the Adh and Odh loci in response to ethanol in Drosophila melanogaster.",
              pages: "147-70",
              volume: "36",
              pubMedId: "9673777",
              year: 1998
            }
          }, {
            id: 1013020,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Briscoe DA",
              journal: "Nature",
              title: "Dominance at Adh locus in response of adult Drosophila melanogaster to environmental alcohol.",
              pages: "148-9",
              volume: "255",
              pubMedId: "805374",
              year: 1975
            }
          }, {
            id: 1013026,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "McKenzie RW",
              journal: "Nucleic Acids Res",
              title: "Redundant cis-acting elements control expression of the Drosophila affinidisjuncta Adh gene in the larval fat body.",
              pages: "1257-64",
              volume: "22",
              pubMedId: "8165141",
              year: 1994
            }
          }, {
            id: 1013029,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Vigue C",
              journal: "Biochem Genet",
              title: "Chemical selection of mutants that affect ADH activity in Drosophila. III. Effects of ethanol.",
              pages: "127-35",
              volume: "14",
              pubMedId: "816349",
              year: 1976
            }
          }, {
            id: 1013060,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Gelfand LJ",
              journal: "Behav Genet",
              title: "Relationship between ADH activity and behavioral response to environmental alcohol in Drosophila.",
              pages: "237-49",
              volume: "10",
              pubMedId: "6783026",
              year: 1980
            }
          }, {
            id: 1013067,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Sampsell B",
              journal: "Nature",
              title: "Effect of adh genotype and heat stress on alcohol tolerance in Drosophila melanogaster.",
              pages: "853-5",
              volume: "296",
              pubMedId: "6803175",
              year: 1982
            }
          }, {
            id: 1013100,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Hewitt NE",
              journal: "J Hered",
              title: "Variation in ADH activity in class I and class II strains of Drosophila.",
              pages: "141-8",
              volume: "65",
              pubMedId: "4211247",
              year: 1974
            }
          }, {
            id: 1013114,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Anderson SM",
              journal: "Proc Natl Acad Sci U S A",
              title: "Biochemical and molecular analysis of naturally occurring Adh variants in Drosophila melanogaster.",
              pages: "4798-802",
              volume: "80",
              pubMedId: "6410397",
              year: 1983
            }
          }, {
            id: 1013126,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Corbin V",
              journal: "Nature",
              title: "Role of transcriptional interference in the Drosophila melanogaster Adh promoter switch.",
              pages: "279-82",
              volume: "337",
              pubMedId: "2492088",
              year: 1989
            }
          }, {
            id: 1013127,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Shen NL",
              journal: "Dev Genet",
              title: "Analysis of Adh gene regulation in Drosophila: studies using somatic transformation.",
              pages: "210-9",
              volume: "10",
              pubMedId: "2500285",
              year: 1989
            }
          }, {
            id: 1013131,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Laurie CC",
              journal: "Proc Natl Acad Sci U S A",
              title: "Quantitative analysis of RNA produced by slow and fast alleles of Adh in Drosophila melanogaster.",
              pages: "5161-5",
              volume: "85",
              pubMedId: "2455893",
              year: 1988
            }
          }, {
            id: 1013139,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Corbin V",
              journal: "Genes Dev",
              title: "The role of specific enhancer-promoter interactions in the Drosophila Adh promoter switch.",
              pages: "2191-20",
              volume: "3",
              pubMedId: "2516829",
              year: 1989
            }
          }, {
            id: 1013175,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Shen NL",
              journal: "Biochem Biophys Res Commun",
              title: "Introduction of single-stranded ADH genes into Drosophila results in tissue-specific expression.",
              pages: "1300-5",
              volume: "174",
              pubMedId: "1996993",
              year: 1991
            }
          }, {
            id: 1013183,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Ogueta M",
              journal: "Chem Senses",
              title: "The influence of Adh function on ethanol preference and tolerance in adult Drosophila melanogaster.",
              pages: "813-22",
              volume: "35",
              pubMedId: "20739429",
              year: 2010
            }
          }, {
            id: 1013185,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Menotti-Raymond M",
              journal: "Genetics",
              title: "Characterization of the structure and evolution of the Adh region of Drosophila hydei.",
              pages: "355-66",
              volume: "127",
              pubMedId: "2004708",
              year: 1991
            }
          }, {
            id: 1013187,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Wu CY",
              journal: "Genetics",
              title: "Tissue-specific expression phenotypes of Hawaiian Drosophila Adh genes in Drosophila melanogaster transformants.",
              pages: "599-610",
              volume: "125",
              pubMedId: "2165967",
              year: 1990
            }
          }, {
            id: 1013189,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Ewel A",
              journal: "Nucleic Acids Res",
              title: "Alternative DNA-protein interactions in variable-length internucleosomal regions associated with Drosophila Adh distal promoter expression.",
              pages: "1771-81",
              volume: "18",
              pubMedId: "2159621",
              year: 1990
            }
          }, {
            id: 1013208,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Anderson SM",
              journal: "Genetica",
              title: "Tissue specific expression of the Drosophila Adh gene: a comparison of in situ hybridization and immunocytochemistry.",
              pages: "95-100",
              volume: "84",
              pubMedId: "1756967",
              year: 1991
            }
          }, {
            id: 1013219,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Ayer S",
              journal: "Mol Cell Biol",
              title: "Conserved enhancer and silencer elements responsible for differential Adh transcription in Drosophila cell lines.",
              pages: "3512-23",
              volume: "10",
              pubMedId: "1694013",
              year: 1990
            }
          }, {
            id: 1013226,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Shen NL",
              journal: "Genetics",
              title: "Analysis of sequences regulating larval expression of the Adh gene of Drosophila melanogaster.",
              pages: "763-71",
              volume: "129",
              pubMedId: "1752419",
              year: 1991
            }
          }, {
            id: 1013235,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Mahmoud J",
              journal: "Environ Mol Mutagen",
              title: "DNA sequence analysis of X-ray induced Adh null mutations in Drosophila melanogaster.",
              pages: "157-60",
              volume: "18",
              pubMedId: "1915310",
              year: 1991
            }
          }, {
            id: 1013236,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Rothberg I",
              journal: "Nucleic Acids Res",
              title: "A Drosophila Adh gene can be activated in trans by an enhancer.",
              pages: "5713-7",
              volume: "19",
              pubMedId: "1945848",
              year: 1991
            }
          }, {
            id: 1013244,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Visa N",
              journal: "Chromosoma",
              title: "The Adh in Drosophila: chromosomal location and restriction analysis in species with different phylogenetic relationships.",
              pages: "315-22",
              volume: "100",
              pubMedId: "1860376",
              year: 1991
            }
          }, {
            id: 1013275,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Fang XM",
              journal: "Genetics",
              title: "Multiple cis-acting sequences contribute to evolved regulatory variation for Drosophila Adh genes.",
              pages: "333-43",
              volume: "131",
              pubMedId: "1644276",
              year: 1992
            }
          }, {
            id: 1013287,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Parsch J",
              journal: "Proc Natl Acad Sci U S A",
              title: "Site-directed mutations reveal long-range compensatory interactions in the Adh gene of Drosophila melanogaster.",
              pages: "928-33",
              volume: "94",
              pubMedId: "9023359",
              year: 1997
            }
          }, {
            id: 1013314,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Begun DJ",
              journal: "Mol Biol Evol",
              title: "Is the fast/slow allozyme variation at the Adh locus of Drosophila melanogaster an ancient balanced polymorphism?",
              pages: "1816-9",
              volume: "16",
              pubMedId: "10605124",
              year: 1999
            }
          }, {
            id: 1013328,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Chen Y",
              journal: "Proc Natl Acad Sci U S A",
              title: "Compensatory evolution of a precursor messenger RNA secondary structure in the Drosophila melanogaster Adh gene.",
              pages: "11499-504",
              volume: "100",
              pubMedId: "12972637",
              year: 2003
            }
          }, {
            id: 1013332,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Kerver JW",
              journal: "Genetica",
              title: "Effects on ADH activity and distribution, following selection for tolerance to ethanol in Drosophila melanogaster.",
              pages: "175-83",
              volume: "87",
              pubMedId: "1305125",
              year: 1992
            }
          }, {
            id: 1013339,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Albalat R",
              journal: "Genes Genet Syst",
              title: "A statistical analysis of nucleotide substitutions in the Drosophila Adh region reflects irregularities in molecular clocks.",
              pages: "209-12",
              volume: "76",
              pubMedId: "11569504",
              year: 2001
            }
          }, {
            id: 1013416,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Haring E",
              journal: "Hereditas",
              title: "The phylogenetic position of Drosophila eskoi deduced from P element and Adh sequence data.",
              pages: "235-44",
              volume: "128",
              pubMedId: "9760872",
              year: 1998
            }
          }, {
            id: 1013447,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Ohta T",
              journal: "Proc Natl Acad Sci U S A",
              title: "Amino acid substitution at the Adh locus of Drosophila is facilitated by small population size.",
              pages: "4548-51",
              volume: "90",
              pubMedId: "8506297",
              year: 1993
            }
          }, {
            id: 1753848,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "McKenzie RW",
              journal: "Nucleic Acids Res",
              title: "The two small introns of the Drosophila affinidisjuncta Adh gene are required for normal transcription.",
              pages: "3635-42",
              volume: "24",
              pubMedId: "8836194",
              year: 1996
            }
          }, {
            id: 1753849,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "McKenzie RW",
              journal: "Dev Genet",
              title: "cis-Acting sequences controlling the adult-specific transcription pattern of the Drosophila affinidisjuncta Adh gene.",
              pages: "119-27",
              volume: "23",
              pubMedId: "9770269",
              year: 1998
            }
          }, {
            id: 6036894,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Schaeffer SW",
              journal: "Genet Res",
              title: "Molecular population genetics of sequence length diversity in the Adh region of Drosophila pseudoobscura.",
              pages: "163-75",
              volume: "80",
              pubMedId: "12688655",
              year: 2002
            }
          }, {
            id: 7006064,
            relevance: 0.09716314,
            type: "Publication",
            fields: {
              firstAuthor: "Labrador M",
              journal: "J Hered",
              title: "Genetic mapping of the Adh locus in the repleta group of Drosophila by in situ hybridization.",
              pages: "83-6",
              volume: "81",
              pubMedId: "2185305",
              year: 1990
            }
          }
        ],
        wasSuccessful: true,
        error: null,
        statusCode: 200
      };
      
      module.exports = obj;
      
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
          
            __out.push(__sanitize(this.result.fields["organism.shortName"]));
          
            __out.push('\n</td>\n<td class="RelevanceColumn">\n\t');
          
            percentage = (this.result.relevance / 1) * 100;
          
            __out.push('\n\t<div class="progress" style="width:');
          
            __out.push(__sanitize(percentage));
          
            __out.push('%"></div>\n</td>\n<td class="SourceColumn">\n\t<span>');
          
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
            __out.push('<thead>\n\t<tr>\n\t\t<th>Type</th>\n\t\t<th>Details</th>\n\t\t<th>Organism</th>\n\t\t<th>Relevance</th>\n\t\t<th>Source</th>\n\t</tr>\n</thead>\n<tbody>\n</tbody>\n');
          
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

    
    // ResultsView.coffee
    root.require.register('MultiMine/src/views/ResultsView.js', function(exports, require, module) {
    
      var ResultsView, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      ResultsView = (function(_super) {
        __extends(ResultsView, _super);
      
        function ResultsView() {
          _ref = ResultsView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        ResultsView.prototype.template = require('../templates/resultstable');
      
        ResultsView.prototype.initialize = function() {
          ResultsView.__super__.initialize.apply(this, arguments);
          return console.log("******* INIT", this.collection);
        };
      
        ResultsView.prototype.test = function() {
          return console.log("I exist.");
        };
      
        ResultsView.prototype.render = function() {
          console.log("I have been rendered.");
          $(this.el).append("Hello");
          return this;
        };
      
        return ResultsView;
      
      })(Backbone.View);
      
      module.exports = ResultView;
      
    });

    
    // SecondaryView.coffee
    root.require.register('MultiMine/src/views/SecondaryView.js', function(exports, require, module) {
    
      var SecondaryView, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
      
      SecondaryView = (function(_super) {
        __extends(SecondaryView, _super);
      
        function SecondaryView() {
          _ref = SecondaryView.__super__.constructor.apply(this, arguments);
          return _ref;
        }
      
        SecondaryView.prototype.el = $('body');
      
        SecondaryView.prototype.initialize = function() {
          _.bindAll(this);
          return this.render();
        };
      
        SecondaryView.prototype.render = function() {};
      
        return SecondaryView;
      
      })(Backbone.View);
      
      module.exports = SecondaryView;
      
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
        var searchResultsCollection = {};
        var filterTypeArr = [];
        var filterOrganismArr = [];
      
        var myResultsCollection = new ResultsCollection();
      
        // The Application
        // --------------
        var AppView = Backbone.View.extend({
      
          el: '#search-results',
      
          initialize: function(params) {
      
            mediator.on('rand', this.rand, this);
            //mediator.on('filter', this.filter, this);
      
            // Do search
            $('#' + params.input).on('keypress', function(e) {
              if (e.keyCode == 13) {
                mediator.trigger('rand', {});
                return false;
              }
            });
      
            $('#filter2').on('click', function(e) {
              mediator.trigger('filter:show', {});
             // _.each(someResults, function(model) {})
            });
      
      
            //this.rand();
      
      /*
            $('#' + params.input).on('keyup change', function() {
              console.log("changed");
            });*/
      
            // Listen to our mediator for events
            mediator.on('column:add', this.addColumn, this);
            mediator.on('filter:apply', this.applyFilter, this);
            mediator.on('filter:remove', this.removeFilter, this);
            mediator.on('medTest', this.test, this);
            
          },
      
          removeFilter: function(value) {
      
      
            console.log("REMOVE FILTER CALLED");
      
            _.each(myResultsCollection.models, function(aModel) {
              console.log("nextModel", aModel);
              aModel.set({show: false});
            });
      
            console.log("applyFilter called with ", value);
      
            if (value[1] === "type") {
              filterTypeArr = _.without(filterTypeArr, value[0]);
            } else if (value[1] === "organism") {
              filterOrganismArr = _.without(filterOrganismArr, value[0]);
            }
      
            var nResults = myResultsCollection.filterType(filterTypeArr, filterOrganismArr);
            console.log("filtered results", nResults);
            _.each(nResults, function(aModel) {
                console.log("nextModel2", aModel);
                aModel.set({show: true});
            });
      
            console.log ("filterTypeArr is now ", filterTypeArr.length);
      
            if (filterTypeArr.length < 1) {
              console.log("SHOWING ALL ITEMS");
              _.each(myResultsCollection.models, function(aModel) {
                aModel.set({show: true});
              });
            }
      
            
      
      
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
      
            
      
            $("#filter").html("")
      
            that = this;
      
            // Get results from the quick search
            var aHelper = new Helper();
            value = $("#textsearch").val();
            var someResults = aHelper.quickSearchEverything(value);
      
            // Evaluate the results and render our items
            Q(someResults)
            .then(function(o) {
      
              // Build a collection
              // var myResultsCollection = new ResultsCollection();
      
              // Add our models to our collection
              _.each(o.results, function(x) {
                var aModel = new ResultModel(x);
                myResultsCollection.add(aModel);
      
      
              });
      
             
      
              that.searchResultsCollection = myResultsCollection;
              
              //console.log("filteredResults", filteredResults);
      
              var myResultsTableView = new ResultsTableView({collection: myResultsCollection});
              that.$el.html(myResultsTableView.render().el);
      
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
              // console.log("catPairs", catPairs);
              aHelper.buildChartOrganisms(catPairs, "type");
      
      
           
              var pairs = _.pairs(o.facets.organisms);
              console.log("pairs", pairs);
              aHelper.buildChartOrganisms(pairs, "organism");
      
      
      
      
      
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

    
    // datapaneview.js
    root.require.register('MultiMine/src/views/datapaneview.js', function(exports, require, module) {
    
      var $ = require('../modules/dependencies').$;
      var mediator = require('../modules/mediator');
      
      
      var DataPaneView = Backbone.View.extend({
      
            el: '.dataPane',
      
            events: {
              'click .close': 'close'
            },
      
            initialize: function(options) {
      
              //console.log("Data Pane Created with model " + this.model);
      
              this.options = options || {};
             // console.log("name: " + this.model.get("name"));
              this.render();
              //this.render();
      
            },
      
            close: function() {
             // console.log("I am closing.");
              this.$el.removeClass("active");
              mediator.trigger('stats:clearselected', {});
            },
      
            openMe: function() {
      
              //this.options.parent.$el.css("background-color", "#252525");
               this.options.parent.$el.addClass("highlighted");
              mediator.trigger('stats:show', {taxonId: this.options.taxonId, aModel: this.model});
              //console.log("Cell Click Detected");
      
            },
      
            render: function() {
      
              var detailsTemplate = require('../templates/details');
              var detailsHtml = _.template(detailsTemplate, {pway: this.model.toJSON()});
      
             this.$el.html(detailsHtml);
            // console.log("final html: " + detailsHtml);
      
              return this.$el;
            },
      
        });
      
      module.exports = DataPaneView;
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