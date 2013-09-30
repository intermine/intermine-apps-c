$ = require 'jquery'

View = require '../modules/view'

class TooltipView extends View

    tag: 'span'

    template: require '../templates/tooltip'

    constructor: ->
        super

        @model.text = tooltips[@model.id]

        @el.addClass('tooltip tip-top noradius')

# Tooltip text.
tooltips =
    '1': 'Choose, do it'
    '2': 'Summarizing you know'
    '3': 'Tabitha Tabby'

module.exports = TooltipView