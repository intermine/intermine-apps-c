mediator = require '../modules/mediator'
FilterOrganismItemView = require './FilterOrganismItemView'

class OrganismListView extends Backbone.View

	tagName: "ul"

	initialize: ->

		$(@el).mouseleave () ->
			console.log "The mouse has left me."
			mediator.trigger "charts:clear", {}

		
	render: ->

		$el = $(@el)

		console.log "Render has been called on OrganismListView", @collection
		@collection.each (nextModel) ->
			itemView = new FilterOrganismItemView({model: nextModel})
			$el.append(itemView.render().$el)

		@

module.exports = OrganismListView