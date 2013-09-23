$ = require 'dom'

class NoMatchesView

    template: require '../templates/nomatches'

    constructor: ({ @collection }) ->
        @el = $('<div></div>').addClass 'nomatches'

    render: ->
        @el.html @template 'items': @collection

        @

module.exports = NoMatchesView