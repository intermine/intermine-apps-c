{ $ } = require '../modules/deps'

mediator = require '../modules/mediator'
View     = require '../modules/view'

tooltips = require '../models/tooltips'

HeaderView          = require './header'
DuplicatesTableView = require './duplicates'
UnresolvedView      = require './unresolved'
SummaryView         = require './summary'
HeaderView          = require './header'

class AppView extends View

    autoRender: yes

    template: require '../templates/app'

    events:
        # Tooltip text.
        'mouseover .help': 'addTooltip'

    render: ->
        super

        # Render the header.
        @el.append (new HeaderView({
            'db': @options.db
        })).render().el

        # Render the duplicates?
        if (collection = @options.db.duplicates).length
            @el.append (new DuplicatesTableView({
                collection
            })).render().el

        # Summary overview.
        @el.append (new SummaryView({
            'matches': @options.db.matches
        })).render().el

        # No matches?
        if (collection = @options.db.data.unresolved).length
            @el.append (new UnresolvedView({
                collection
            })).render().el

        @

    # Add tooltip text for hint.css
    addTooltip: (ev) ->
        target = $ ev.target
        
        target.addClass 'hint--bounce'
        
        # Populate the text.
        ev.target.setAttribute 'data-hint', tooltips[target.data('id')]

module.exports = AppView