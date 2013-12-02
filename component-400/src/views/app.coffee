{ $ } = require '../modules/deps'

mediator = require '../modules/mediator'
View     = require '../modules/view'

HeaderView          = require './header'
DuplicatesTableView = require './duplicates'
UnresolvedView      = require './unresolved'
SummaryView         = require './summary'
HeaderView          = require './header'
TooltipView         = require './tooltip'

class AppView extends View

    autoRender: yes

    template: require '../templates/app'

    events:
        'mouseover .help': 'toggleTooltip'
        'mouseout  .help': 'toggleTooltip'

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

    # Toggle a tooltip.
    toggleTooltip: (ev) ->
        switch ev.type
            when 'mouseover'
                id = (target = $(ev.target)).data('id')
                @views.push view = new TooltipView({ 'model': { id } })
                target.append view.render().el
            
            when 'mouseout'
                # Only tooltips are in the list.
                ( do view.dispose for view in @views )

module.exports = AppView