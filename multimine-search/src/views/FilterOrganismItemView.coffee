mediator = require '../modules/mediator'

class FilterOrganismItemView extends Backbone.View

	tagName: "li"

	template: require '../templates/FilterListItemTemplate'
	templateOff: require '../templates/FilterListItemOffTemplate'

	events: ->
		"click": "toggleMe"
		"mouseover": "moused"

	initialize: ->
		@model.on('change:enabled', @render)

	
	render: =>

		if @model.get("enabled") is true

			$(@el).html @template {result: do @model.toJSON}
			$(@el).removeClass("off")
			mediator.trigger "filter:apply", [@model.get("taxonId"), "organism"]
		else

			$(@el).html @templateOff {result: do @model.toJSON}
			$(@el).addClass("off")
			mediator.trigger "filter:remove", [@model.get("taxonId"), "organism"]
		@

	moused: ->
		d3.selectAll(".mychart").style("fill", "#808080")
		d3.select("#" + @model.get("name")).style("fill", "white");

	toggleMe: ->

		# alert(@model.get("taxonId"))
		if @model.get("enabled") is true



			$(@el).html @templateOff {result: do @model.toJSON}
			$(@el).addClass("off")
			@model.set({enabled: false})

			mediator.trigger "filter:remove", [@model.get("taxonId"), "organism"]

		else



			$(@el).html @template {result: do @model.toJSON}
			@model.set({enabled: true})
			$(@el).removeClass("off")

			mediator.trigger "filter:apply", [@model.get("taxonId"), "organism"]


module.exports = FilterOrganismItemView