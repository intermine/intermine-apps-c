mediator = require '../modules/mediator'

class FilterListItemView extends Backbone.View

	tagName: "li"

	template: require '../templates/FilterListItemTemplate'
	templateOff: require '../templates/FilterListItemOffTemplate'

	events: ->
		"click": "toggleMe"
		"mouseover": "moused"

	initialize: ->
		@model.on('change:enabled', @render)

	render2: ->
		console.log "second step"
		
	render: =>

		console.log "RENDER HAS BEEN CALLED?", @model



		if @model.get("enabled") is true
			console.log "model is true"
			$(@el).html @template {result: do @model.toJSON}
			$(@el).removeClass("off")
			mediator.trigger "filter:apply", [@model.get("name"), "type"]
		else
			console.log "model is false"
			$(@el).html @templateOff {result: do @model.toJSON}
			$(@el).addClass("off")
			mediator.trigger "filter:remove", [@model.get("name"), "type"]
		@

	moused: ->
		d3.selectAll(".mychart").style("fill", "#808080")
		d3.select("#" + @model.get("name")).style("fill", "white");

	toggleMe: ->

		if @model.get("enabled") is true

			console.log "Triggering filter:remove"

			$(@el).html @templateOff {result: do @model.toJSON}
			$(@el).addClass("off")
			@model.set({enabled: false})

			mediator.trigger "filter:remove", [@model.get("name"), "type"]

		else

			console.log "Triggering filter:apply"

			$(@el).html @template {result: do @model.toJSON}
			@model.set({enabled: true})
			$(@el).removeClass("off")

			mediator.trigger "filter:apply", [@model.get("name"), "type"]


module.exports = FilterListItemView