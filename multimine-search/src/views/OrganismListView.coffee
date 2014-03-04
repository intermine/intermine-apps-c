mediator = require '../modules/mediator'
FilterOrganismItemView = require './FilterOrganismItemView'

class OrganismListView extends Backbone.View

	tagName: "ul"
	childViews: []

	initialize: ->

		# alert "init"


		$(@el).mouseleave () ->
			mediator.trigger "charts:clear", {}

		
	render: ->


		$el = $(@el)
		@collection.each (nextModel) ->
			itemView = new FilterOrganismItemView({model: nextModel})
			@childViews.push itemView
			$el.append(itemView.render().$el)

		@

module.exports = OrganismListView