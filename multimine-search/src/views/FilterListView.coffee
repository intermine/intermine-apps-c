mediator = require '../modules/mediator'
FilterListItemView = require './FilterListItemView'

class FilterListView extends Backbone.View

	tagName: "ul"

	initialize: ->

		$(@el).mouseleave () ->
			console.log "The mouse has left me."
			mediator.trigger "charts:clear", {}

		
	render: ->

		$el = $(@el)

		console.log "Render has been called on FilterListView", @collection
		@collection.each (nextModel) ->
			itemView = new FilterListItemView({model: nextModel})
			$el.append(itemView.render().$el)

		@

module.exports = FilterListView