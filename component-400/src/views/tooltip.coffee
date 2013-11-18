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
    '1': 'Choose from among duplicate matches below'
    '2': 'These objects have been automatically added to your list'
    '3': 'A class of matches'

module.exports = TooltipView