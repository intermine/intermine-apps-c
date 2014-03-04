mediator = require '../modules/mediator'

class ResultView extends Backbone.View

	tagName: "tr"

	className: "test"

	template: require '../templates/resultsrow'

	initialize: ->
		this.model.on 'change:enabled', @toggleVisible, this

	toggleVisible: ->
		console.log "CHANGING VISIBILITY"

		$(@el).toggleClass 'hidden', !@model.get "enabled"
		
	render: ->
		#console.log "my model", do @model.toJSON
		$(@el).append @template {result: do @model.toJSON}
		@

module.exports = ResultView