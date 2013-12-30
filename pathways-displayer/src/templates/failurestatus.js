module.exports = '<span>WARNING! The following mines were unreachable: </span> \
				<ul class="inline"> \
				<% _.each(failedMines, function(mine) { %> \
					<li> \
					<%= mine %> \
					</li> \
				<% }) %> \
				</ul>';