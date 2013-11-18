mediator = require '../modules/mediator'
View     = require '../modules/view'

class HeaderView extends View

    template: require '../templates/header'

    events:
        'click .button.save': 'save'

    constructor: ->
        super
        @el.addClass 'header section'

        # Whatever was toggled, we will probably have to change the count.
        mediator.on 'item:toggle', @render, @

    render: ->
        data = @collection.data
        @el.html @template {
            'selected': mori.count(@collection.selected), data
        }

        @

    save: -> mediator.trigger 'app:save'

module.exports = HeaderView