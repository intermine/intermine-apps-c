mediator = require '../modules/mediator'

class ResultModel extends Backbone.Model

	defaults:
		id: 0
		mineUrl: ""
		relevance: 0
		type: "Generic"
		show: true

	initialize: ->
		# console.log "ResultModel has been created with rev.", @get "relevance"
		if @get("relevance") > 1.0
			@set {relevance: 1}
		# Tie our model to the mediator.
		mediator.on 'filter:show', @filter

	filter: =>
		# console.log "Filtering model of type #{@get 'type'}"
		do @toggleVisible
	
	toggleVisible: =>
		@set {show: !@get("show")}

module.exports = ResultModel