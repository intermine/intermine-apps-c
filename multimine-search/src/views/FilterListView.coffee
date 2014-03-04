mediator = require '../modules/mediator'
FilterListItemView = require './FilterListItemView'

class FilterListView extends Backbone.View

	tagName: "ul"

	initialize: ->

		$(@el).mouseleave () ->

			mediator.trigger "charts:clear", {}

		
	render: ->

		$el = $(@el)

		@collection.each (nextModel) ->
			itemView = new FilterListItemView({model: nextModel})
			$el.append(itemView.render().$el)

		@

module.exports = FilterListView