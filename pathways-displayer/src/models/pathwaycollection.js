var PathwayModel = require('./pathwaymodel');

  var PathwayCollection = Backbone.Collection.extend({

    model: PathwayModel,

    add: function(models) {


      if (!_.isArray(models)) {
        models = [models];
      }

      // Step through the models and look for a duplicates by slug.
      _.each(models, function(model) {

      	//console.log("Next model: " + JSON.stringify(model, null, 2));

        //model.url = aUrl;


        var returned = this.findWhere({slug: this.toSlug(model.name)});


   

        if (returned) {
        //console.log("found");
          //returned.updateData(model); 
          //console.log('returned, ' + model.url);      
        } else {
        	//console.log(model.name);
          Backbone.Collection.prototype.add.call(this, model);
        }

      },this);
    },

    comparator: function(pway) {
        return pway.get('name');
      },

   toSlug: function(text) {
    return text.toString().toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
  }

  });

module.exports = new PathwayCollection();