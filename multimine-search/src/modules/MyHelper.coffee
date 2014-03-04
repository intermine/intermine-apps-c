mediator = require "./mediator"

class MyHelper
	# mediator = _.extend({}, Backbone.Events)
	constructor: ->

		# @testjson = require './testjson'
		# @testjson = [@testjson]

		@totalResults = {
			facets:
				Category: {}
				organisms: {}
			results: []
		}

		@globalFilter = []

		@organismMap = {}


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
			# {name: "YeastMine", queryUrl: "http://yeastmine.yeastgenome.org/yeastmine", baseUrl: "http://yeastmine.yeastgenome.org/yeastmine/"}
			# {name: "WormMine", queryUrl: "http://www.wormbase.org/tools/wormmine", baseUrl: "http://www.wormbase.org/tools/wormmine/"}
		]
		# Q.all(( @runOne(mineUrl, term, mineName) for mineName, mineUrl of listedMines ))
		# Q.when()
		Q.all(( @runOne(mine.queryUrl, term, mine.name, mine.baseUrl) for mine in friendlyMines ))
		
		.then (finished) =>


			@calcStats finished
			# @calcStats @testjson

		.then (test) =>


			


			# Save organisms information to our results for easy filtering
			for obj in @totalResults.results
				fields = obj.fields

				if fields["organism.name"] isnt undefined
					# Search our map by organism.name
					found = _.findWhere(@organismMap, {name: fields["organism.name"]})
					obj.taxonId = found.taxonId
					obj.genus = found.genus
					obj.species = found.species
					obj.organismName = found.name

					obj.shortName = found.genus.charAt(0) + ". " + found.species


				else if fields["organism.shortName"] isnt undefined
					# Parse the species from our shortname
					res = fields["organism.shortName"].split(" ")
					parsedSpecies = res[1]
					found = _.findWhere(@organismMap, {species: parsedSpecies})
					obj.taxonId = found.taxonId
					obj.genus = found.genus
					obj.species = found.species
					obj.organismName = found.name
					obj.shortName = found.genus.charAt(0) + ". " + found.species


				else




			result =
				results: @totalResults
				organisms: @organismMap

	# Returns a promise to quicksearch a service for a term
	runOne: (mineUrl, term, mineName, mineBase) ->

		def = Q.defer()

		service = new intermine.Service root: mineUrl
		service.search(term).then (results) ->



			_.map results.results, (res) ->
				res.mineUrl=mineUrl
				res.mineName=mineName
				res.mineBase=mineBase

			def.resolve results

		def.promise

		.then (results) ->

			# Get the organism shortnames from our query
			queryOrganismArray = []

			for key, value of results.facets["organism.shortName"]
				queryOrganismArray.push key

			# Build a query to retrieve extended organism information


			if queryOrganismArray.length > 0
				organismQuery = {
				  select: ["Organism.name","Organism.taxonId","Organism.genus","Organism.species"],
				  where: {"Organism.shortName": queryOrganismArray}
				}

				# Run our organism query:
				orgresults = service.records(organismQuery);


			else

				[]

		.then (results) =>


			# Loop through the organisms in our results
			for organism in results
				if organism.taxonId of @organismMap
					# We already have this organism

				else
					# Add the organism to our organism map if it does not exist
					@organismMap[organism.taxonId] = organism

		.then () ->

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

	callThisFunction: (d, filter) ->
		


		if d.toggled == false || d.toggled == undefined
			d.toggled = true

			mediator.trigger "filter:apply", [d.data[0], filter]
		else if d.toggled == true
			d.toggled = false

			mediator.trigger "filter:remove", [d.data[0], filter]

		console.log "d.toggled has been set to ", d.toggled

		# Trigger our mediator to filter the data by type
		# mediator.trigger "medTest", d.data[0]

	buildChartOrganisms: (myvalues, filter) ->     

		# console.log "buildingChart23", JSON.stringify myvalues, null, 2
		that = @
		console.log "that", that

		angle = (d) ->
		  a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90
		  (if a > 90 then a - 180 else a)

		canvasWidth = 100
		canvasHeight = 100
		outerRadius = 50
		innerRadius = 25
		w = 75
		h = 75
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

				# toggle the slice depending on its current state#

				if d.toggled == false || d.toggled == undefined

					# console.log "value", d3.select(this).classed("SOMETHING")
					d3.select(this).classed("SOMETHING", true)
					# console.log "value2", d3.select(this).classed("SOMETHING")
					d3.select(this).select("path").transition()
						.duration(200)
						.attr("d", arcOver)
					# console.log "selected", d3.select(this)
					that.callThisFunction d, filter
				else if d.toggled == true
					console.log "SHRINKING"
					d3.select(this).select("path").transition()
						.duration(100)
						.attr("d", arc)
					that.callThisFunction d, filter



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
		).style("fill", "White").style("font", "12px Arial").text (d, i) ->
		  dataSet[i][0]

		arcs.filter((d) ->
		  d.endAngle - d.startAngle > .2
		).append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", (d) ->
		  d.outerRadius = outerRadius
		  d.innerRadius = outerRadius / 2
		  "translate(" + arc.centroid(d) + ")rotate(" + 0 + ")"
		).style("fill", "White").style("font", "bold 12px Arial").text (d) ->
		  d.data[1]


	buildBarChartNew: (dataset) ->


		w = 200
		h = 25

		dataset2 = dataset

		# dataset2 = [
		# 	[1, 1]
		# 	[2, 2]
		# 	[3, 3]
		# 	[4, 4]
		# 	[5, 5]
		# 	[6, 6]
		# 	[7, 7]
		# 	[8, 8]
		# ]

		xScale = d3.scale.ordinal().domain(d3.range(dataset2.length)).rangeRoundBands([
		  0
		  w
		], 0.05)
		yScale = d3.scale.linear().domain([
		  0
		  d3.max(dataset2, (d) ->
		    d[1]
		  )
		]).range([
		  0
		  h
		])



		key = (d) ->

		  d[0]


		#Create SVG element
		svg = d3.select("#datatypechart").append("svg").attr("width", w).attr("height", h)

		#Create bars

		#Tooltip

		#Get this bar's x/y values, then augment for the tooltip

		#Update Tooltip Position & value
		svg.selectAll("rect").data(dataset2).enter().append("rect").attr("x", (d, i) ->
		  xScale i
		).attr("y", (d) ->
		  h - yScale(d[1])
		).attr("width", xScale.rangeBand()).attr("height", (d) ->
		  yScale d[1]
		).attr("fill", "grey").on("mouseover", (d) ->
		  xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2
		  yPosition = parseFloat(d3.select(this).attr("y")) + 14
		  d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text d[1]
		  d3.select("#tooltip").classed "hidden", false
		  return
		).on "mouseout", ->
		  
		  #Remove the tooltip
		  d3.select("#tooltip").classed "hidden", true
		  return

	buildBarChart: (dataset, location) ->

		w = 200
		h = 25



		xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([
		  0
		  w
		], 0.05)
		yScale = d3.scale.linear().domain([
		  0
		  d3.max(dataset, (d) ->
		    d.value
		  )
		]).range([
		  0
		  h
		])



		key = (d) ->
		  d.key


		#Create SVG element
		svg = d3.select(location).html('').append("svg").attr("width", w).attr("height", h)

		#Create bars

		#Tooltip

		#Get this bar's x/y values, then augment for the tooltip

		#Update Tooltip Position & value
		svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", (d, i) ->
		  xScale i
		).attr("y", (d) ->
		  h - yScale(d.value)
		).attr("width", xScale.rangeBand()).attr("height", (d) ->
		  yScale d.value
		).attr("id", (d) ->
		  d.key
		).attr("class", (d) ->
		  "mychart"
		).attr("fill", "grey").on("mouseover", (d) ->
		  xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2
		  yPosition = parseFloat(d3.select(this).attr("y")) + 14
		  d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text d.value
		  d3.select("#tooltip").classed "hidden", false
		  return
		).on "mouseout", ->
		  
		  #Remove the tooltip
		  d3.select("#tooltip").classed "hidden", true
		  return

	buildLineChart: (dataset) ->



		w = 200
		h = 25



		xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([
		  0
		  w
		], 0.05)
		yScale = d3.scale.linear().domain([
		  0
		  d3.max(dataset, (d) ->
		    d.value
		  )
		]).range([
		  0
		  h
		])



		key = (d) ->
		  d.key


		#Create SVG element
		svg = d3.select("#datatypechart").append("svg").attr("width", w).attr("height", h)

		#Create bars

		#Tooltip

		#Get this bar's x/y values, then augment for the tooltip

		#Update Tooltip Position & value
		svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", (d, i) ->
		  xScale i
		).attr("y", (d) ->
		  h - yScale(d.value)
		).attr("width", xScale.rangeBand()).attr("height", (d) ->
		  yScale d.value
		).attr("fill", "grey").on("mouseover", (d) ->
		  xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2
		  yPosition = parseFloat(d3.select(this).attr("y")) + 14
		  d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text d.value
		  d3.select("#tooltip").classed "hidden", false
		  return
		).on "mouseout", ->
		  
		  #Remove the tooltip
		  d3.select("#tooltip").classed "hidden", true
		  return

	buildBarChart2: () ->

		w = 200
		h = 25
		dataset = [
		  {
		    key: 0
		    value: 5
		  }
		  {
		    key: 1
		    value: 10
		  }
		  {
		    key: 2
		    value: 13
		  }
		  {
		    key: 3
		    value: 19
		  }
		  {
		    key: 4
		    value: 21
		  }
		  {
		    key: 5
		    value: 25
		  }
		  {
		    key: 6
		    value: 22
		  }
		  {
		    key: 7
		    value: 18
		  }
		  {
		    key: 8
		    value: 15
		  }
		  {
		    key: 9
		    value: 13
		  }
		  {
		    key: 10
		    value: 11
		  }
		  {
		    key: 11
		    value: 12
		  }
		  {
		    key: 12
		    value: 15
		  }
		  {
		    key: 13
		    value: 20
		  }
		  {
		    key: 14
		    value: 18
		  }
		  {
		    key: 15
		    value: 17
		  }
		  {
		    key: 16
		    value: 16
		  }
		  {
		    key: 17
		    value: 18
		  }
		  {
		    key: 18
		    value: 23
		  }
		  {
		    key: 19
		    value: 25
		  }
		]
		xScale = d3.scale.ordinal().domain(d3.range(dataset.length)).rangeRoundBands([
		  0
		  w
		], 0.05)
		yScale = d3.scale.linear().domain([
		  0
		  d3.max(dataset, (d) ->
		    d.value
		  )
		]).range([
		  0
		  h
		])
		key = (d) ->
		  d.key


		#Create SVG element
		svg = d3.select("#organismchart").append("svg").attr("width", w).attr("height", h)

		#Create bars

		#Tooltip

		#Get this bar's x/y values, then augment for the tooltip

		#Update Tooltip Position & value
		svg.selectAll("rect").data(dataset, key).enter().append("rect").attr("x", (d, i) ->
		  xScale i
		).attr("y", (d) ->
		  h - yScale(d.value)
		).attr("width", xScale.rangeBand()).attr("height", (d) ->
		  yScale d.value
		).attr("fill", "grey").on("mouseover", (d) ->
		  xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2
		  yPosition = parseFloat(d3.select(this).attr("y")) + 14
		  d3.select("#tooltip").style("left", xPosition + "px").style("top", yPosition + "px").select("#value").text d.value
		  d3.select("#tooltip").classed "hidden", false
		  return
		).on "mouseout", ->
		  
		  #Remove the tooltip
		  d3.select("#tooltip").classed "hidden", true
		  return





module.exports = MyHelper