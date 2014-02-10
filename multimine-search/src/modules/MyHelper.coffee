class MyHelper
	# mediator = _.extend({}, Backbone.Events)
	constructor: ->

		@testjson = require './testjson'
		@testjson = [@testjson]

		@totalResults = {
			facets:
				Category: {}
				organisms: {}
			results: []
		}

		@globalFilter = []



	calcStats: (responseArray) ->
		# console.log "() -> calcStats called with ", responseArray
		Q(	
			for response in responseArray

				for key, value of response.facets["organism.shortName"]
					@totalResults.facets.organisms[key] ?= 0
					@totalResults.facets.organisms[key] += value

				for key, value of response.facets.Category

					@totalResults.facets.Category[key] ?= 0
					@totalResults.facets.Category[key] += value

				@totalResults.results = @totalResults.results.concat response.results

		).then( (test) =>
			# console.log "calcStats @totalResults", @totalResults
		)

	# Return a promise to 
	quickSearchEverything: (term) =>

		# myMines = [
		# 	"www.mousemine.org/mousemine"
		# 	"http://intermine.modencode.org/query"
		# ]


		listedMines = 
		  MouseMine: "www.mousemine.org/mousemine"
		  ModMine: "http://intermine.modencode.org/query"

		friendlyMines = [
			{name: "MouseMine", queryUrl: "www.mousemine.org/mousemine", baseUrl: "http://www.mousemine.org/mousemine/"},
			{name: "ModMine", queryUrl: "http://intermine.modencode.org/query", baseUrl: "http://intermine.modencode.org/release-32/"},
			{name: "FlyMine", queryUrl: "http://www.flymine.org/query", baseUrl: "http://www.flymine.org/release-38.0/"},
			{name: "ZebraFishMine", queryUrl: "http://www.zebrafishmine.org", baseUrl: "http://www.zebrafishmine.org/"},
			{name: "YeastMine", queryUrl: "http://yeastmine.yeastgenome.org/yeastmine", baseUrl: "http://yeastmine.yeastgenome.org/yeastmine/"}
			# {name: "WormMine", queryUrl: "http://www.wormbase.org/tools/wormmine", baseUrl: "http://www.wormbase.org/tools/wormmine/"}
		]
		# Q.all(( @runOne(mineUrl, term, mineName) for mineName, mineUrl of listedMines ))
		# Q.when()
		Q.all(( @runOne(mine.queryUrl, term, mine.name, mine.baseUrl) for mine in friendlyMines ))
		
		.then (finished) =>

			@calcStats finished
			# @calcStats @testjson

		.then (test) =>
			# console.log "Returning final results", test
			@totalResults

	# Returns a promise to quicksearch a service for a term
	runOne: (mineUrl, term, mineName, mineBase) ->

		# console.log "**********************************************", mineName

		def = Q.defer()

		# console.log "querying mine... #{mineUrl} for #{term}"
		service = new intermine.Service root: mineUrl
		service.search(term).then (results) ->
			# console.log "Raw results: ", results 
			_.map results.results, (res) ->
				res.mineUrl=mineUrl
				res.mineName=mineName
				res.mineBase=mineBase

			def.resolve results

		def.promise


	sortData: (response) ->

		totalResults = []

		#console.log "TOTAL DATA", JSON.stringify(response, null, 2)

		for arr in response
			totalResults = totalResults.concat arr.results

		# console.log "totalResults", totalResults

		justGenes = _.where totalResults, {type: "Gene"}
		# console.log "justGenes", justGenes


	logFailure: (message) ->
		# console.log "FAILURE", message


	calcCategories: (json) ->
		map = {}
		someData = []

		# console.log "facets", json.facets.Category

		_.each json.facets.Category, (values, key, list) ->
			console.log "key", key
			aMap = {}
			aMap.legendLabel = key
			aMap.magnitude = values
			someData.push aMap

		# console.log "someData", someData

		someData

	calcOrganisms: (json) ->
		map = {}
		someData = []
		# values = _.groupBy json.facets.Category, (val, key) ->
		# 	console.log "val", key
		# 	aMap = {}
		# 	aMap.legendLabel = key
		# 	aMap.magnitude = val
		# 	somedata.push aMap
		# console.log "facets", json.facets["organism.shortName"]

		_.each json.facets["organism.shortName"], (values, key, list) ->
			# console.log "key", key
			aMap = {}
			aMap.legendLabel = key
			aMap.magnitude = values
			someData.push aMap

		# console.log "someData", someData

		someData

	buildChart: (myvalues) ->

		# console.log "buildingChart", myvalues

		angle = (d) ->
		  a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
		  (if a > 90 then a - 180 else a)

		canvasWidth = 600
		canvasHeight = 300
		outerRadius = 150
		innerRadius = 75
		w = 300
		h = 300
		r = Math.min(w, h) / 2
		labelr = r
		color = d3.scale.category20()
		dataSet = myvalues
		vis = d3.select("body").append("svg:svg").data([dataSet]).attr("width", canvasWidth).attr("height", canvasHeight).append("svg:g").attr("transform", "translate(" + 1.5 * outerRadius + "," + 1.5 * outerRadius + ")")
		arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius)
		pie = d3.layout.pie().value((d) ->
		  d.magnitude
		).sort((d) ->
		  null
		)

		arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice")

		arcs.append("svg:path").attr("fill", (d, i) ->
		  color i
		).attr "d", arc

		# arcs.append("svg:text").attr("transform", (d) ->
		#   console.log "d", d
		#   d.outerRadius = outerRadius + 750
		#   d.innerRadius = outerRadius + 745
		#   "translate(" + arc.centroid(d) + ")"

		# ).attr("text-anchor", "middle").style("fill", "Purple").style("font", "bold 12px Arial").text (d, i) ->
		#   dataSet[i].legendLabel

		arcs.append("svg:text").attr("transform", (d) ->
		  c = arc.centroid(d)
		  x = c[0]
		  y = c[1]
		  h = Math.sqrt(x * x + y * y)
		  "translate(" + (x / h * labelr) + "," + (y / h * labelr) + ")"
		).attr("dy", ".35em").attr("text-anchor", (d) ->
		  (if (d.endAngle + d.startAngle) / 2 > Math.PI then "end" else "start")
		).text (d, i) ->
		  dataSet[i].legendLabel

		arcs.filter((d) ->
		  d.endAngle - d.startAngle > .2
		).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", (d) ->
		  d.outerRadius = outerRadius
		  d.innerRadius = outerRadius / 2
		  "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"
		).style("fill", "White").style("font", "bold 12px Arial").text (d) ->
		  d.data.magnitude

	callThisFunction: (d) ->
		console.log "This was passed to me: ", d.data

	buildChartOrganisms: (myvalues) ->

		# console.log "buildingChart23", JSON.stringify myvalues, null, 2
		that = @
		console.log "that", that

		angle = (d) ->
		  a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
		  (if a > 90 then a - 180 else a)

		canvasWidth = 300
		canvasHeight = 300
		outerRadius = 75
		innerRadius = 30
		w = 160
		h = 160
		r = Math.min(w, h) / 2
		labelr = r
		color = d3.scale.category20()
		dataSet = myvalues


		arcOver = d3.svg.arc().innerRadius(innerRadius + 30).outerRadius(r + 30)

		arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(r);
				

		vis = d3.select("#filter").append("svg:svg").data([dataSet]).attr("width", canvasWidth).attr("height", canvasHeight).append("svg:g").attr("transform", "translate(" + 1.5 * outerRadius + "," + 1.5 * outerRadius + ")")
		arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius)
		# console.log "here 1"
		pie = d3.layout.pie().value((d) ->
		  d[1]
		  # d.magnitude
		)

		arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice")
			.on "click", (d)->
				console.log "value", d3.select(this).classed("SOMETHING")
				d3.select(this).classed("SOMETHING", true)
				console.log "value2", d3.select(this).classed("SOMETHING")
				d3.select(this).select("path").transition()
					.duration(200)
					.attr("d", arcOver)
				that.callThisFunction d


			.on "testing", (d)->
				d3.select(this).select("path").transition()
					.duration(100)
					.attr("d", arc)

		arcs.append("svg:path").attr("fill", (d, i) ->
		  color i
		).attr "d", arc

		# arcs.append("svg:text").attr("transform", (d) ->
		#   console.log "d", d
		#   d.outerRadius = outerRadius + 750
		#   d.innerRadius = outerRadius + 745
		#   "translate(" + arc.centroid(d) + ")"

		# ).attr("text-anchor", "middle").style("fill", "Purple").style("font", "bold 12px Arial").text (d, i) ->
		#   dataSet[i].legendLabel

		arcs.append("svg:text").attr("transform", (d) ->
		  c = arc.centroid(d)
		  x = c[0]
		  y = c[1]
		  h = Math.sqrt(x * x + y * y)
		  "translate(" + (x / h * labelr) + "," + (y / h * labelr) + ")"
		).attr("dy", ".35em").attr("text-anchor", (d) ->
		  (if (d.endAngle + d.startAngle) / 2 > Math.PI then "end" else "start")
		).style("fill", "Black").style("font", "12px Arial").text (d, i) ->
		  dataSet[i][0]

		arcs.filter((d) ->
		  d.endAngle - d.startAngle > .2
		).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", (d) ->
		  d.outerRadius = outerRadius
		  d.innerRadius = outerRadius / 2
		  "translate(" + arc.centroid(d) + ")rotate(" + 0 + ")"
		).style("fill", "White").style("font", "bold 12px Arial").text (d) ->
		  d.data[1]




module.exports = MyHelper