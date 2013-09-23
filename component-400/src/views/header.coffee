$ = require 'dom'

class HeaderView

    template: require '../templates/header'

    constructor: ->
        @el = $('<div></div>').addClass 'header'

    render: ->
        @el.html @template
            'type': 'gene'
            'selected': 15
            'total': 22
            'input': 25

        @

module.exports = HeaderView