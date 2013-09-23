$ = require 'jquery'

View = require '../modules/view'

class HeaderView extends View

    template: require '../templates/header'

    constructor: ->
        super
        @el.addClass 'header'

    render: ->
        @el.html @template
            'type': 'gene'
            'total': 22
            'input': 25
            'selected': 15

        @

module.exports = HeaderView