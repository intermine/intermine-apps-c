mediator = require '../modules/mediator'

class FilterSpeciesView extends Backbone.View

	tagName: "li"

	template: require '../templates/FilterSpeciesTemplate'
	# templateOff: require '../templates/FilterListItemOffTemplate'

	events: ->
		"click": "filterAll"

	# Filter our collection
	filterAll: ->
		mediator.trigger "filter:remove", [@model.get("taxonId"), "organism"]
		console.log @model.get("species") + " has been clicked"



	initialize: (attr) ->
		# Assume that we're being passed all models of the same genus!
		@options = attr
		console.log "FilterSpeciesView initialized", @

		#@model.on('change:enabled', @render)
		
	render: =>

		console.log "Rendering a FilterSpeciesView"

		# First render our heading:
		$(@el).html @template {result: do @model.toJSON}
		@



module.exports = FilterSpeciesView