var $ = require('../modules/dependencies').$;
var mediator = require('../modules/mediator');

var CellTemplate = require('../templates/pathwaycell');

var PathwayCellView = Backbone.View.extend({

      tagName: "td",
      className: "clickable",

      events: {
        'click': 'openMe'
      },

      initialize: function(options) {

        this.options = options || {};

      },

      openMe: function() {

        //this.options.parent.$el.css("background-color", "#252525");
         this.options.parent.$el.addClass("highlighted");
        mediator.trigger('stats:show', {taxonId: this.options.taxonId, aModel: this.model});
        //console.log("Cell Click Detected");

      },

      render: function() {


       var cellTemplate = _.template(CellTemplate, {})
       //console.log("cellTemplate: ", cellTemplate);

       this.$el.html(cellTemplate);

        return this.$el;
      },

      showMessage: function() {

        this.$el.html("<div>Test</div>");
      }


  });

module.exports = PathwayCellView;