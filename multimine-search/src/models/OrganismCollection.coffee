OrganismItem = require './OrganismItem'

class OrganismCollection extends Backbone.Collection

	model: OrganismItem

	initialize: ->

	# comparator: (item) ->
	# 	-item.get("count")

	comparator: (item) ->
		item.get("genus")
		# [item.get("count"), item.get("enabled")]

	toggleAll: (value) ->
		
		_.each @models, (model) ->

			model.set({enabled: value})




module.exports = OrganismCollection