module.exports = '<thead>\
		<tr>\
		<th>Pathway Name</th>\
	<% _.each(columns, function(col) { %>\
		<th><%= col.sName %></th>\
	<% }) %>\
	</tr>\
	</thead>';