var $ = require('../modules/dependencies').$;
var mediator = require('../modules/mediator');

  var CellTitleTemplate = require('../templates/celltitle.js');

  var PathwayCellTitleView = Backbone.View.extend({

      tagName: "td",

      events: {
        'click': 'openMe'
      },

      initialize: function(options) {

        this.options = options || {};

      },

      openMe: function() {

        mediator.trigger('stats:hide', {taxonId: this.options.taxonId, aModel: this.model});
        //this.options.parent.$el.css("background-color", "black");

      },

      render: function() {

       var compiledTemplate = _.template(CellTitleTemplate, {name: this.model.get("name")});
       this.$el.append(compiledTemplate);

        return this.$el;
      }


  });

  module.exports = PathwayCellTitleView;