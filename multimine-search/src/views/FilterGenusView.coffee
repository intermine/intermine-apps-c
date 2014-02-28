mediator = require '../modules/mediator'
FilterSpeciesView = require './FilterSpeciesView'

class FilterGenusView extends Backbone.View

	tagName: "li"
	className: "expandable"

	template: require '../templates/FilterGenusTemplate'
	templateOff: require '../templates/FilterGenusOffTemplate'

	enabled: true

	events: ->
		"click .expand": "showChildren"
		"click": "toggle"

	toggle: ->

		if @enabled is true

			console.log "Triggering filter:remove"

			$(@el).html @templateOff {result: @options}
			$(@el).addClass("off")
			@enabled = false

			mediator.trigger "filter:newremove", {genus: @options.genus}

		else

			console.log "Triggering filter:apply"
			do @render
			$(@el).removeClass("off")
			@enabled = true


			

	# Filter our collection
	showChildren: ->
		console.log @options.collection
		content = $(@el).find('ul')
		console.log "content", content

			    # open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		content.slideToggle 100, () ->
			console.log "sliding"




	# Exposide the children to the DOM
	filterAll: ->
		console.log "this is me", @


	initialize: (attr) ->
		# Assume that we're being passed all models of the same genus!
		@options = attr
		console.log "FilterGenusView initialized", @

		#@model.on('change:enabled', @render)
		
	render: =>

		# We have models for species, so we need create lists for them.
		console.log "rendering"
		$(@el).html @template {result: @options}

		ul = $('<ul>')
		ul.addClass "content"

		for nextModel in @options.models
			speciesView = new FilterSpeciesView({model: nextModel})
			ul.append speciesView.render().$el

			# $(@el).html @template {result: @options}

		$(@el).append ul
		@



		# # Group our collection by Genus and build a nested tree
		# grouped = @options.collection.groupBy (model) ->
		# 	return model.get("genus");

		# # Now loop through our genus groups and build a view for each of them
		# for group in groups
		# 	nextGenus = new FilterGenusView({models: grouped[group], genus: group})


  #       console.log("Grouped", grouped);


		# console.log "Rendering a FilterGenusView"

		# # First render our heading:
		# $(@el).html @template {result: @options}

		# # Now create an <ul> with the children species

		# ulist = $('<ul>')
		# ulist.addClass("content")
		# console.log "ELEMENT", ulist



		# 	$(ulist).append speciesView.render().$el

		# $(@el).append ulist

		# console.log "ulist", ulist



		# $("#filter").append @el
		# # $("#filter").html @template {result: @options}
		# console.log @template {result: @options}


	moused: ->
		d3.selectAll(".mychart").style("fill", "#808080")
		d3.select("#" + @model.get("name")).style("fill", "white");

	toggleMe: ->
		console.log "clicked"


module.exports = FilterGenusView