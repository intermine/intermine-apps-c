class ResultsView extends Backbone.View

	template: require '../templates/resultstable'

	initialize: ->
		super
		console.log "******* INIT", @collection

	test: ->
		console.log "I exist."

	render: ->
		console.log "I have been rendered."
		$(@el).append "Hello"
		# results = [{type: 1}, {type: 2}]
		# $(@el).append @template {results: do @collection.toJSON}
		@

module.exports = ResultView