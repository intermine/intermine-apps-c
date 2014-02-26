OrganismItem = require './OrganismItem'

class OrganismCollection extends Backbone.Collection

	model: OrganismItem

	initialize: ->
		console.log "OrganismItem has been created."

	# comparator: (item) ->
	# 	-item.get("count")

	comparator: (item) ->
		-item.get("count")
		# [item.get("count"), item.get("enabled")]

	toggleAll: (value) ->
		_.each @models, (model) ->
			console.log "stepping"
			model.set({enabled: value})

		console.log "models now", @models



module.exports = OrganismCollection