var $ = require('../modules/dependencies').$;
var PathwayCellView = require('./pathwaycellview');
var PathwayCellTitleView = require('./celltitleview');
var Globals = require('../modules/globals');

var PathwayView = Backbone.View.extend({

    tagName: "tr",

    initialize: function (){
      
    },

    events: {

      "click": "open"

    },

    open: function() {

      //console.log("Row Click Detected");    
      
    },

    render: function() {

      // Get the models from our organisms:
      var modelOrganisms = this.model.get("organisms");
      var foundOrganism;


      var cellTitleView = new PathwayCellTitleView({
           model: this.model,
           parent: this
      });

      this.$el.append(cellTitleView.render());


      _.each(Globals.columns, function(col) {

          foundOrganism = _.where(modelOrganisms, {taxonId: col.taxonId});


          if (foundOrganism != null && foundOrganism != "" && foundOrganism.length > 0) {
            var cellView = new PathwayCellView({
              model: this.model,
              taxonId: col.taxonId,
              parent: this
            });
            this.$el.append(cellView.render());

          } else {

            this.$el.append("<td></td>");

          }

      }, this);

       return this;
    },

 


  });

module.exports = PathwayView;