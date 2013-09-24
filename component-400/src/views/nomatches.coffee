$ = require 'jquery'

View = require '../modules/view'

class NoMatchesView extends View

    template: require '../templates/nomatches'

    constructor: ->
        super
        @el.addClass 'nomatches section'

    render: ->
        @el.html @template 'items': @collection

        @

module.exports = NoMatchesView