mediator = require '../modules/mediator'

class FilterListItem extends Backbone.Model

	defaults:
		name: "generic"
		type: "not specified"
		enabled: true
		count: 0
		displayName: "tbd"
		# class: "not specified"
		# genus: "not specified"
		# fullname: "not specified"
		# species: "not specified"
		# taxonid: "not specified"

	initialize: ->

		# Tie our model to the mediator.
		mediator.on 'filter:togglecategory', @get "enabled"

		# Create our displayName
		@set({displayName: unCamelCase(@get("name"))})

	unCamelCase = (str) ->
	  
	  # insert a space between lower & upper
	  
	  # space before last upper in a sequence followed by lower
	  
	  # uppercase the first character
	  str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3").replace /^./, (str) ->
	    str.toUpperCase()

	# Toggle our ENABLED status
	toggle: ->

		if @get("enabled") is false
			@set({enabled: true})

		else
		 	@set({enabled: false})

		@get("enabled")


module.exports = FilterListItem