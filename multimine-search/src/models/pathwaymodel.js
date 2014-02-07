var mediator = require('../modules/mediator');

var PathwayModel = Backbone.Model.extend({

    initialize: function() {
      //console.log("pathway model created");
      this.shiftPathwayIdentifier();
      this.set( {slug: this.toSlug(this.get('name')) });
      this.shiftData();
    },

    defaults: function() {
      return {organisms: []};
    },

    toSlug: function(text) {
      return text.toString().toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    },

    shiftPathwayIdentifier: function() {
      var pwayId = this.get('identifier');
      var pwayObjId = this.get('objectId');
      _.each(this.attributes.genes, function(o) {
        o.pwayId = pwayId;
        o.pathwayId = pwayObjId;
      });
    },

    shiftData: function() {
      currentOrganisms = this.get("organisms");

      that = this;
      _.each(this.get('genes'), function(o) {

         mediator.trigger('column:add', {taxonId: o.organism.taxonId, sName: o.organism.shortName});

        var found = _.findWhere(currentOrganisms, {taxonId: o.organism.taxonId});
        // Did we find the organism in the pathway by taxonId?
        if (!found) {
          // push ourself onto the organism as an attribute
          var geneData = _.omit(o, 'organism');
          _.extend(geneData, {url: that.attributes.url});
          geneArray = [geneData]
          o.organism.genes = geneArray;
          currentOrganisms.push(o.organism);
        } else {
          var geneData = _.omit(o, 'organism');
          _.extend(geneData, {url: that.attributes.url});
          found.genes.push(geneData);
        }

      });
      this.set({organisms: currentOrganisms});
      this.unset('genes');
    },

    updateData: function(jsonData) {

      currentOrganisms = this.get("organisms");

      _.each(jsonData.genes, function(o) {

        mediator.trigger('column:add', {taxonId: o.organism.taxonId, sName: o.organism.shortName});

        var found = _.findWhere(currentOrganisms, {taxonId: o.organism.taxonId});
        // Did we find the organism in the pathway by taxonId?
        if (!found) {
          // copy our gene data to the organism
          var geneData = _.omit(o, 'organism');
          _.extend(geneData, {url: jsonData.url, pathwayId: jsonData.objectId});
          geneArray = [geneData]
          o.organism.genes = geneArray;
          currentOrganisms.push(o.organism);
        } else {
          var geneData = _.omit(o, 'organism');
          _.extend(geneData, {url: jsonData.url});
          found.genes.push(geneData);
        }

      });
      this.set({organisms: currentOrganisms});
      this.unset('genes');

    },

  });

module.exports = PathwayModel;

