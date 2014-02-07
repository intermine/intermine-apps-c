ResultView = require './ResultView'

class ResultsTableView extends Backbone.View

	tagName: "table"

	className: "ResultsTable"

	template: require '../templates/resultstable'

	initialize: ->
		super
		console.log "ResultTable Initialized with collection:", @collection

	render: ->

		# Loop through the models in our collection and
		# create a result view for each model.

		$(@el).append @template {}


		@collection.each (aModel) =>
			resultView = new ResultView({model: aModel})
			$(@el).append resultView.render().el

		# console.log "el", @el
		@


module.exports = ResultsTableView