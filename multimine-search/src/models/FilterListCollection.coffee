FilterListItem = require './FilterListItem'

class FilterListCollection extends Backbone.Collection

	model: FilterListItem

	initialize: ->
		console.log "FilterListCollection has been created."

	# comparator: (item) ->
	# 	-item.get("count")

	comparator: (item) ->
		-item.get("count")
		# [item.get("count"), item.get("enabled")]

	toggleAll: (value) ->

		console.log "FilterListemCollection.toggleAll called with", value
		_.each @models, (model) ->
			model.set({enabled: value})

		console.log "models now", @models



module.exports = FilterListCollection