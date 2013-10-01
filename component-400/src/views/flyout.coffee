$ = require 'jquery'

formatter = require '../modules/formatter'
View      = require '../modules/view'

class FlyoutView extends View

    template: require '../templates/flyout'

    constructor: ->
        super

        @el.addClass('flyout')

    render: ->
        @el.html @template { 'rows': formatter.flyout @model }
        @

module.exports = FlyoutView