var AppView = require('./views/appview');

var $ = require('./modules/dependencies').$;

module.exports = function(params) {

	var view = new AppView(params);
	//if ($(params.target).length != 1) throw "Not found";
	// console.log(params.input);
	view.setElement($(params.target));
	view.render();

}