var AppView = require('./views/appview');
var SecView = require('./views/SecondaryView');

var $ = require('./modules/dependencies').$;

module.exports = function(params) {


	var view = new AppView(params);
	//if ($(params.target).length != 1) throw "Not found";
	// console.log(params.input);
	view.setElement($(params.target));
	view.render();



	

	var throttled = _.throttle(updatePosition, 1000);
	$(window).scroll(throttled);

	function updatePosition() {
		// console.log("updated position");
	}

	var sec = new SecView();



	updatePosition();

}