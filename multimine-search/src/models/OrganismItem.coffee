mediator = require '../modules/mediator'

class OrganismItem extends Backbone.Model

	defaults:
		type: "not specified"
		enabled: true
		count: 0
		class: "not specified"
		genus: "not specified"
		name: "not specified"
		species: "not specified"
		taxonId: "not specified"

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


module.exports = OrganismItem