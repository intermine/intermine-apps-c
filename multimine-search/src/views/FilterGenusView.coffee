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


			$(@el).html @templateOff {result: @options}
			$(@el).addClass("off")
			@enabled = false

			mediator.trigger "filter:removeGenus", {genus: @options.genus}
			#mediator.trigger "filter:newremove", {genus: @options.genus}

		else

			do @render
			$(@el).removeClass("off")
			@enabled = true
			mediator.trigger "filter:addGenus", {genus: @options.genus}


	# Filter our collection
	showChildren: ->

		content = $(@el).find('ul')


			    # open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		content.slideToggle 100, () ->





	# Exposide the children to the DOM
	filterAll: ->



	initialize: (attr) ->
		# Assume that we're being passed all models of the same genus!
		@options = attr

		mediator.on 'display:hideAllOrganisms', @toggleOff, @
		mediator.on 'display:showAllOrganisms', @toggleOn, @

	toggleOff: ->


		$(@el).html @templateOff {result: @options}
		$(@el).addClass("off")
		@enabled = false

	toggleOn: ->

		do @render
		$(@el).removeClass("off")
		@enabled = true



		# @model.on('change:enabled', @render)
		
	render: =>

		# We have models for species, so we need create lists for them.

		$(@el).html @template {result: @options, count: @options.models.length}

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



module.exports = FilterGenusView