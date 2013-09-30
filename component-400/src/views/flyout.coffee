$ = require 'jquery'

View = require '../modules/view'

class FlyoutView extends View

    template: require '../templates/flyout'

    constructor: ->
        super

        @el.addClass('flyout')

module.exports = FlyoutView