  // Include helper functions:
  var mediator = require("../modules/mediator");
  var $ = require('../modules/dependencies').$;
  var Helper = require("../modules/MyHelper");
  var ResultModel = require("../models/ResultModel");
  var ResultsCollection = require("../models/ResultsCollection");
  var ResultView = require("../views/ResultView");
  var ResultsTableView = require("../views/ResultsTableView");
  var searchResultsCollection = {};

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
        var myResultsCollection = new ResultsCollection();

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
        var newResults = myResultsCollection.filterType("one");
        console.log("newResults", newResults);

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
        aHelper.buildChartOrganisms(catPairs);


     
        var pairs = _.pairs(o.facets.organisms);
        console.log("pairs", pairs);
        aHelper.buildChartOrganisms(pairs);


        var third = myResultsCollection.at(3);
        console.log("third model", third);
        third.set({show: false});





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