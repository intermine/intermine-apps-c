var $ = require('../modules/dependencies').$;
var mediator = require("../modules/mediator");
var pwayCollection = require('../models/pathwaycollection.js');
var templateTableHeaders = require('../templates/tableheaders');
var PathwayView = require('./pathwayview');
var Globals = require('../modules/globals');
//var TableBody = require('../templates/results');

var TableView = Backbone.View.extend({

  //tagName: 'pathwaysappcontainer',
  tagName: "table",
  className: "pwayHeaders",

  initialize: function() {



    //console.log('table view initialized');
  },
  render: function() {
    Globals.test = Globals.test ? Globals.test++ : 1;
    var template = _.template(templateTableHeaders);
    var compiledTemplate = template({columns: Globals.columns});
    //console.log("compiledTemplate: " + compiledTemplate);
    this.$el.append(compiledTemplate);
    //this.collection.each(this.renderOne);
    return this;
  },

});

module.exports = TableView;
