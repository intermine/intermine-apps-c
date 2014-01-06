  // Include helper functions:
  var mediator = require("../modules/mediator");
  var Helper = require('../modules/helper');
  var pwayCollection = require('../models/pathwaycollection');
  var TableView = require("./tableview");
  var TableViewHeaders = require("./tableviewheaders");


  var DataPaneView = require("./datapaneview");
  var Globals = require('../modules/globals');
  var $ = require('../modules/dependencies').$;

  var failures = new Array();
  // The Application
  // --------------
  var AppView = Backbone.View.extend({

    // Stores the final value of our columns
    columns: [],

    // Get the HTML template shell for our application

    //templateApp: _.template($('#tmplPwayApp').html()),
    templateShell: require('../templates/shell'),
    myFriendlyMines: null,


    initialize: function(params) {

     

      $(window).on("resize",this.resizeContext)

      var friendlyMines = params.friendlyMines;

      this.myFriendlyMines = friendlyMines;


      var shellTemplate = require('../templates/shell');
      var shellHTML = _.template(shellTemplate, {"myFriendlyMines": friendlyMines});
      

     this.$el.html(this.templateShell);

      // Listen to our mediator for events
      mediator.on('column:add', this.addColumn, this);
      mediator.on('stats:show', this.showStats, this);
      mediator.on('table:show', this.showTable, this);
      mediator.on('stats:hide', this.hideStats, this);
      mediator.on('table:color', this.updateTableColors, this);
      mediator.on('notify:minefail', this.notifyFail, this);
      
      mediator.on('stats:clearselected', this.clearSelected, this);
      mediator.on('notify:loading', this.showLoading, this);


     Q.when(Helper.launchAll(params.gene, friendlyMines))
      .then(function() { mediator.trigger('table:show', {backgroundColor: params.themeColor});})
      .then(function() { mediator.trigger('table:color', {})});


    },

    showLoading: function() {

      var loadingTemplate = require('../templates/loading');
      this.$("#pwayResultsContainer").append(loadingTemplate);
    },


    resizeContext: function() {
       this.$("#pwayResultsId th").each(function(i, val) {
            $(".pwayHeaders th:eq(" + i + ")").width($(this).width());
        });
       this.$(".pwayHeaders").width($("#pwayResultsId").width());
       
       // Moves our table header over the copy:
       this.$("#pwayResultsId").css("margin-top", this.$("#pwayResultsId thead").height() * -1);
      this.$(".dataPane").css("top", $("#pwayHeadersContainer").height());
       this.$(".dataPane").css("height", $("#pwayResultsContainer").height());

       

    },



    render: function() {
      var output = _.template(this.templateShell, {myFriendlyMines: this.myFriendlyMines});
      this.$el.html(output);
      this.updateTableColors();
      return this;
    },

    // Show our data table:
    showTable: function(args) {

      if (pwayCollection.length < 1) {
        var noResultsTemplate = require('../templates/noresults');
        this.$("#pwayResultsContainer").html(noResultsTemplate);
      } else {

        var atableView = new TableView({collection: pwayCollection});
        var atableViewHeaders = new TableViewHeaders({collection: pwayCollection});


       this.$("#pathways-displayer-loading").remove();

       // Get the color of our previous parent container
       var parentColor = this.$el.prev('div').css('background-color');
       
       


        this.$("#pwayHeadersContainer").append(atableViewHeaders.render().el);
        this.$("#pwayResultsContainer").append(atableView.render().el);

        this.$( ".circle" ).css( "background-color", args.backgroundColor );


      }

 
      // Build our table view.
      
      this.resizeContext();

    
      $(document).keyup(function(e) {
        if (e.keyCode == 27) {
          mediator.trigger('stats:hide', null);
          }   // esc
      });

      mediator.trigger('notify:queryprogress', this.myFriendlyMines);

      // We have failures, let the user know

      var output;

      if (failures.length > 0) {
        var failureTemplate = require('../templates/failurestatus');
        this.$el.find("#statusBar").removeClass("hidden");
        this.$el.find("#statusBar").addClass("warning");
        output = _.template(failureTemplate, {failedMines: failures});
        this.$el.find("#statusBar").html(output);
      }


    },

    updateTableColors:function() {
     
      var pColor = this.$('.pwayHeaders thead tr th').css("background-color");
      this.$("#pwayHeadersContainer").css("background-color", pColor);
     
    },

    // Show our stats pane with information
    showStats:function(pway) {

      var organism = _.where(pway.aModel.get("organisms"), {taxonId: pway.taxonId});
      var dataSets = pway.aModel.get("dataSets");


      var object = {
        name: pway.aModel.get("name"),
        organism: organism,
        datasets: pway.aModel.get("dataSets")
      }

      var detailsTemplate = require('../templates/details');
      var detailsHtml = _.template(detailsTemplate, {pway: object});
   
      this.$el.find(".dataPane").addClass("active");

      var testModel = new Backbone.Model(object);
     

      var dataView = new DataPaneView({model: testModel});
     
    },

    addColumn: function(colName) {


      var index = _.where(Globals.columns, {taxonId: colName.taxonId});
      if (index.length < 1) {
        Globals.columns.push(colName);
        Globals.columns.sort(Helper.dynamicSort("sName"));
      }
    },

    hideStats: function() {
     
      this.$(".dataPane").removeClass("active");
      $("tr.highlighted").removeClass("highlighted");
      

    },

    notifyFail: function(value) {
   
     failures.push(value.mine);
    },

    clearSelected: function() {
 
      this.$("tr.highlighted").removeClass("highlighted");
    }

  });


  module.exports = AppView;