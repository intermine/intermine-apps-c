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
  var spinner2;


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



      
      $.fn.center = function ()
      {
          this.css("position","fixed");
          this.css("top", ($(window).height() / 2) - (this.outerHeight() / 2));
          this.css("left", ($(window).width() / 2) - (this.outerWidth() / 2));
          return this;
      }

      $('#loading2').center();
      $(window).resize(function(){
         $('#loading2').center();
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
        zIndex: 20000000, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent in px
        left: '50%' // Left position relative to parent in px
      };




      var target = document.getElementById('loading2');
      $('#loading2').css("display", "block");
      spinner = new Spinner(opts).spin(target);



      console.log("SHOWING LOADING ANIMATION");

    },

    hideLoading: function() {

      spinner.stop();

    },


    rand: function(searchValue) {

      this.showLoading();


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
        
        that.hideLoading();
        $("#loading2").css("display", "none");
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