$      = require 'jquery'
extend = require 'extend'

View = require '../modules/view'

class HeaderView extends View

    template: require '../templates/header'

    events:
        'click .button.save': 'save'

    constructor: ->
        super
        @el.addClass 'header section'

    render: ->
        { input, total, type } = @collection
        @el.html @template {
            'selected': do @collection.selectedLn
            input, total, type
        }

        @

    save: ->
        console.log 'Saving'

module.exports = HeaderView