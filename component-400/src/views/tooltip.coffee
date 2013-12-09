View = require '../modules/view'

tooltips = require '../models/tooltips'

class TooltipView extends View

    tag: 'span'

    template: require '../templates/tooltip'

    constructor: ->
        super

        @model.text = tooltips[@model.id]

        @el.addClass('tooltip tip-top noradius')

module.exports = TooltipView