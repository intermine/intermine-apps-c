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