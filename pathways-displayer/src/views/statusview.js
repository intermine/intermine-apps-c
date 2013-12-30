var $ = require('../modules/dependencies').$;
var mediator = require('../modules/mediator');

  var mineStatusTemplate = require('../templates/mineStatus');

  var MineStatusView = Backbone.View.extend({

      initialize: function(options) {

        console.log("MineStatusView has been created with options: " + options.name);
        this.options = options || {};
        this.render();

      },

      success: function() {

        mediator.trigger('stats:hide', {taxonId: this.options.taxonId, aModel: this.model});

      },

      render: function() {

       var compiledTemplate = _.template(mineStatusTemplate, {name: this.options.name});
       this.$el.append(compiledTemplate);
       //console.log("compiledTemplate " + compiledTemplate);
        return this.$el;
      }


  });

  module.exports = MineStatusView;