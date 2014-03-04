mediator = require("../modules/mediator");
ResultModel = require './ResultModel'

class ResultsCollection extends Backbone.Collection

	model: ResultModel
	globalFilter: {}


	initialize: ->
		# console.log "ResultsCollection has been initialized"
		mediator.on "filter:removeGenus", @filterRemoveGenus, @
		mediator.on "filter:removeAllGenus", @filterRemoveAllGenus, @
		mediator.on "filter:addGenus", @filterAddGenus, @
		mediator.on "filter:removeType", @filterRemoveType, @
		mediator.on "filter:removeAllTypes", @filterRemoveAllTypes, @
		mediator.on "filter:addType", @filterAddType, @
		mediator.on "filter:addAllTypes", @filterAddAllTypes, @
		mediator.on "filter:addAllGenus", @filterAddAllGenus, @

	comparator: (mod) ->
		return -mod.get "relevance"

	filterRemoveGenus: (keypair) ->
		delete @globalFilter.genus[keypair.genus]

		do @filterTest

	filterRemoveAllGenus: ->

		for prop of @globalFilter.genus
			delete @globalFilter.genus[prop]

		do @filterTest


	filterAddAllTypes: (value) ->

		typeModels = _.groupBy @models, (item) ->
		 	item.get "type"

		for key of typeModels
			@globalFilter.type.push key


		do @filterTest

	filterRemoveAllTypes: (value) ->

		@globalFilter.type = []


		do @filterTest

	filterAddType: (value) ->

		@globalFilter.type.push value

		do @filterTest

	filterRemoveType: (value) ->

		@globalFilter.type =  _.without(@globalFilter.type, value)

		do @filterTest
		

	filterAddGenus: (keypair) ->

		console.log "filterAddGenus called", keypair.genus

		# genusModels = _.where(@models, {genus: keypair.genus})

		taxonids = []

		genusModels = _.groupBy @models, (item) ->
		 	item.get "genus"

		for model in genusModels[keypair.genus]
			taxonids.push model.get "taxonId"

		@globalFilter.genus[keypair.genus] = _.uniq(taxonids)

		do @filterTest

	filterAddAllGenus: (keypair) ->

		# alert "ADD ALL GENUS CALLED"
		# genusModels = _.where(@models, {genus: keypair.genus})

		

		genusModels = _.groupBy @models, (item) ->
		 	item.get "genus"

		console.log "genusModels", genusModels

		for eachGenus of genusModels

			taxonids = []

			for model in genusModels[eachGenus]
				taxonids.push model.get "taxonId"

			@globalFilter.genus[eachGenus] = _.uniq(taxonids)


		do @filterTest

		# Get the models that contain the genus being passed in:


	buildFilter: (filterObj) ->

		obj = {}
		# Build our list of types
		types = _.countBy @models, (model) ->
			model.get "type"

		# Build our
		genusGroups = _.groupBy @models, (item) ->
			item.get "genus"


		@globalFilter.genus = {}

		for nextgenus of genusGroups
			

			if nextgenus isnt "undefined"




				# @globalFilter.genus[genus] = _.map genusGroups[genus], (model) ->
				#  	model.get "taxonId"

				taxonids = _.map genusGroups[nextgenus], (model) ->
				 	model.get "taxonId"

				 genusObj = {}
				 genusObj[nextgenus] = taxonids

				# @globalFilter.genus.push genusObj
				@globalFilter.genus[nextgenus] = _.uniq(taxonids)

   
  		# Build our list of organisms (genus and species)
		@globalFilter.type = (prop for prop of types)



	# Accepts an object that is then used to filter this collection's models.
	# Each value in the object's keys must be in an array, as each new key
	# is treated as an "AND", and each array value is treated as an "OR"
	filterTest: ->
		# alert("filterTest has been called")
		console.log "filterTest called with object: ", @globalFilter

		filtered = this.models.filter (model) =>

			# Loop through our types to see if the model matches the type
			if (model.get("type")) not in @globalFilter.type
				model.set({enabled: false})
				return false

			# Passed the type test, now filter by genus
			if (model.get("genus")) is undefined
				model.set({enabled: true})
				return true

			if (model.get("genus")) of @globalFilter.genus
				model.set({enabled: true})
				return true
			else
				model.set({enabled: false})
				return false



		console.log "filtered", filtered

		filtered


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
			# model.set({show: false})
			# console.log "model", model.set({show: false})

		# @collection.each (aModel) ->
		# 	console.log "next model", aModel

	filterType: (typevalues, organismvalues) ->

		# values = ["Publication", "Gene"]
		that = this



		results = this.models.filter (model) ->

			fields = model.get("fields")
			# org = fields["organism.shortName"]
			org = model.get("taxonId")

			if organismvalues.length > 0 and typevalues.length < 1
				# org in organismvalues
			else if organismvalues.length < 1 and typevalues.length > 0
				model.get("type") in typevalues
			else if organismvalues.length > 0 and typevalues.length > 0
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