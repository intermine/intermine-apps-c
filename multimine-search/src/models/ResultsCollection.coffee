ResultModel = require './ResultModel'

class ResultsCollection extends Backbone.Collection

	model: ResultModel

	initialize: ->
		# console.log "ResultsCollection has been initialized"

	comparator: (mod) ->
		return -mod.get "relevance"

	byType: (name) ->
		

		filtered = @filter((model) ->
			model.get("type") isnt name
		)

		# console.log "filtered", filtered
		_.each filtered, (model) ->
			console.log "model type", model.get "type"
			# model.set({show: false})
			# console.log "model", model.set({show: false})

		# @collection.each (aModel) ->
		# 	console.log "next model", aModel

	filterType: (values) ->

		console.log "filterType called with values ", values

		results = this.models.filter (model) ->
			model.get("type") is "Publication"

		results


module.exports = ResultsCollection