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