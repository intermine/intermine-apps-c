mediator = require '../modules/mediator'

class ResultModel extends Backbone.Model

	defaults:
		id: 0
		mineUrl: ""
		relevance: 0
		type: "Generic"
		show: true


	initialize: ->
		# console.log "ResultModel has been created with rev.", @get "relevance"
		fields = @get "fields"

		if @get("relevance") > 1.0
			@set {relevance: 1}
		# Tie our model to the mediator.
		mediator.on 'filter:show', @filter
		
		# if fields["organism.shortName"] == null || fields["organism.shortName"] == "" || fields["organism.shortName"] == undefined
		# 	if fields["organism.name"] isnt undefined
		# 		split = fields["organism.name"].split(" ")
		# 		firstletter = split[0].substring(0, 1)
		# 		neworganism = firstletter + ". " + split[1]
		# 		console.log "split values", firstletter

		# 		fields["organism.shortName"] = neworganism

	filter: =>
		# console.log "Filtering model of type #{@get 'type'}"
		do @toggleVisible
	
	toggleVisible: =>
		@set {show: !@get("show")}

module.exports = ResultModel