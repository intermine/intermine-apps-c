mediator = require '../modules/mediator'

class FilterListItem extends Backbone.Model

	defaults:
		name: "generic"
		type: "not specified"
		enabled: true
		count: 0
		# class: "not specified"
		# genus: "not specified"
		# fullname: "not specified"
		# species: "not specified"
		# taxonid: "not specified"

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


module.exports = FilterListItem