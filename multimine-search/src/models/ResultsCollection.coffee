ResultModel = require './ResultModel'

class ResultsCollection extends Backbone.Collection

	model: ResultModel
	globalFilter: {}


	initialize: ->
		# console.log "ResultsCollection has been initialized"



	comparator: (mod) ->
		return -mod.get "relevance"

	buildFilter: (filterObj) ->

		obj = {}
		# Build our list of types
		types = _.countBy @models, (model) ->
			model.get "type"

		# Build our
		genusGroups = _.groupBy @models, (item) ->
			item.get "genus"

		console.log "genusGroup", genusGroups

		for genus of genusGroups
			console.log "genus", genus

			if genus isnt "undefined"
				console.log "string undefined"

				test = _.map genusGroups[genus], (model) ->
					model.get "taxonId"
				console.log "test", _.uniq(test)
   
  		# Build our list of organisms (genus and species)
		@globalFilter.type = (prop for prop of types)



		console.log "done with filter", @globalFilter


		


	# Accepts an object that is then used to filter this collection's models.
	# Each value in the object's keys must be in an array, as each new key
	# is treated as an "AND", and each array value is treated as an "OR"
	filter: (filterObj) ->
		# alert("myFilter has been called with")
		console.log "filter called with object: ", filterObj
		filtered = this.models.filter (model) ->

			console.log "filtering using", filterObj

			for key, value of filterObj
				
				# console.log "key: #{key}, value: #{value}"
				if (model.get(key)) not in value

					console.log "disposing model", model
					return false

			true

					#console.log "found", model.get(key)

		filtered

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

	filterType: (typevalues, organismvalues) ->

		console.log "filterType called with type values ", typevalues
		console.log "filterType called with organism values ", organismvalues
		# values = ["Publication", "Gene"]
		that = this



		results = this.models.filter (model) ->

			fields = model.get("fields")
			# org = fields["organism.shortName"]
			org = model.get("taxonId")

			if organismvalues.length > 0 and typevalues.length < 1
				console.log "case 1"
				# org in organismvalues
			else if organismvalues.length < 1 and typevalues.length > 0
				model.get("type") in typevalues
			else if organismvalues.length > 0 and typevalues.length > 0
				console.log "HELLO", org
				if org is undefined
					model.get("type") in typevalues
				else
					org in organismvalues and model.get("type") in typevalues
			# if organismvalues.length > 0 and typevalues.length > 0
			# 	console.log "case1"
			# 	model.get("type") in typevalues and fields["organism.shortName"] in organismvalues
			# else if organismvalues isnt null and typevalues is null
			# 	console.log "case 2"
			# 	model.get("type") in typevalues
			# else if organismvalues is null and typevalues isnt null
			# 	console.log "case 3"
			# 	fields["organism.shortName"] in organismvalues
	




			# #console.log "ATTRIBUTES", model.get("fields")[organism.shortName]
			# # console.log "VALUES", values
			# # model.get("type") is "Publication"
			# model.get("type") in typevalues

			

		results



	#  model.set('show', model.get('type') in allowed) for model in collection.models )


module.exports = ResultsCollection