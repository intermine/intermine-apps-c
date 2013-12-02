mediator = require '../modules/mediator'
View     = require '../modules/view'

class HeaderView extends View

    template: require '../templates/header'

    events:
        'click .button.save': 'save'

    constructor: ->
        super

        # Save original selected count (= number of found).
        @found = mori.count @options.db.selected

        # When someone got toggled, we will probably have to change the count.
        mediator.on 'item:toggle', @render, @

    render: ->
        @el.addClass 'header section'

        @el.html @template {
            # Currently selected objects.
            'selected': mori.count @options.db.selected
            # The matched type.
            'type': @options.db.type
            # Identifiers entered.
            'entered': @options.db.data.stats.identifiers.all
            # Objects found (original count of selected objects).
            @found
        }

        @

    # Trigger an event to arrayize selected objects.
    save: -> mediator.trigger 'app:save'

module.exports = HeaderView