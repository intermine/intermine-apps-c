FilterListItem = require './FilterListItem'

class FilterListCollection extends Backbone.Collection

	model: FilterListItem

	initialize: ->


	# comparator: (item) ->
	# 	-item.get("count")

	comparator: (item) ->
		-item.get("count")
		# [item.get("count"), item.get("enabled")]

	toggleAll: (value) ->

		_.each @models, (model) ->
			model.set({enabled: value})


module.exports = FilterListCollection