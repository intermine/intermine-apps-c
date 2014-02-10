class SecondaryView extends Backbone.View

	el: $ 'body'

	initialize: ->

		_.bindAll @
		@render()

	render: ->
		# $(@el).append '<h3>Results from quicksearch:</h3>'

module.exports = SecondaryView