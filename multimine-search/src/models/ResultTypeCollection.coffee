ResultTypeCategory = require './ResultTypeCategory'

class ResultTypeCollection extends Backbone.Collection

	model: ResultTypeCategory

	initialize: ->
		# console.log "ResultsCollection has been initialized"
		@collection.on "add", @render, @

	render: ->
		$el = $(@el)
		self = @

		@collection.each (item)->
			filter = new ResultTypeCategoryView({model: item })
			$el.append(filter.render().el)

module.exports = ResultTypeCollection