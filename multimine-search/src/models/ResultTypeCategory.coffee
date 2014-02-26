mediator = require '../modules/mediator'

class ResultTypeCategory extends Backbone.Model

	defaults:
		name: "generic"
		type: "not specified"
		enabled: true
		count: 0

	initialize: ->

		# Tie our model to the mediator.
		mediator.on 'filter:togglecategory', @get "enabled"

	# Toggle our ENABLED status
	toggle: ->

		if @get("enabled") is false
			@set({enabled: true})

		else
		 	@set({enabled: false})

		@get("enabled")


module.exports = ResultTypeCategory