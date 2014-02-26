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
  var OrganismListView = require("../views/OrganismListView")



  var searchResultsCollection = {};
  var filterTypeArr = [];
  var filterOrganismArr = [];
  var typecat = new ResultTypeCategory();


  var myResultsCollection = new ResultsCollection();

  var tview;

  var categoryFilterListCollection = new FilterListCollection();
  var organismFilterListCollection = new FilterListCollection();



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
        console.log("TOTALLED RESULTS", o);
        var myOrganisms = o.organisms
        var myResults = o.results

        var o = o.results
        // Build a collection
        // var myResultsCollection = new ResultsCollection();

        // Add our models to our collection

        // Build our collections of filters
        console.log("Categories: ", o.facets.Category);


        // Create Views for our DATATYPES
        //var categoryFilterListCollection = new FilterListCollection();
        var x = 1;
        for(var propt in o.facets.Category){
            var anotherModel = new FilterListItem({name: propt, count: o.facets.Category[propt] });


            categoryFilterListCollection.add(anotherModel);

            console.log("ANOTHER MODEL", anotherModel);
            console.log(propt + ': ' + o.facets.Category[propt]);
            filterTypeArr.push(propt);

        }
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
        console.log("PLEASE LOOK FOR ME", organismCollection);
        // var organismFilterListView = new FilterListView({collection: organismFilterListCollection});
        var organismFilterListView = new OrganismListView({collection: organismCollection});
        console.log("PLEASE LOOK FOR ME2");


        console.log("populated organismCollection", organismCollection);
        $('#CategoryFilterList').append(categoryFilterListView.render().$el);
        $('#OrganismFilterList').append(organismFilterListView.render().$el);

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

        var customFilter = {type: ["Protein", "RNAiResult", "Gene"], taxonId: [7237]};
        myResultsCollection.myFilter(customFilter);



      var counted = _.countBy(myResultsCollection.models, function(model) {

        return model.get("type");


      });

      console.log("counted", counted);






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