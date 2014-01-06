//module.exports = '<h4>test</h4>';

module.exports = '<div class="innerDetailsContainer"> \
	<div class="close clickable">◀ Close</div> \
	<h4>Pathway Name</h4> \
	<%= "<a href=" + pway.organism[0].genes[0].url + "/report.do?id=" + pway.organism[0].genes[0].pathwayId + ">" %> \
	<%= pway.name %> \
	</a> \
	<h4>Organism</h4> \
	<%= "<a href=" + pway.organism[0].genes[0].url + "/report.do?id=" + pway.organism[0].objectId + ">" %> \
	<%= pway.organism[0].shortName %> \
	</a> \
	<h4>Homologous Genes</h4> \
	<ul class="genes"> \
		<% _.each(pway.organism[0].genes, function(gene) { %> \
			<li> \
			<%= "<a href=" + gene.url + "/report.do?id=" + gene.objectId + ">" %> \
				<%= gene.symbol %> \
			</a> \
			</li> \
		<% }) %> \
	</ul> \
	<h4>Data Set(s)</h4> \
	<ul> \
		<% _.each(pway.datasets, function(dataset) { %> \
			<li> \
				<%= "<a href=" + pway.organism[0].genes[0].url + "/report.do?id=" + dataset.objectId + ">" %> \
				<%= dataset.name %> \
				</a> \
			</li> \
		<% }); %> \
	</ul></div> ';