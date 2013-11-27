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
        new HeaderView
            'db': @options.db
            'el': @el.find('div.header.section')

        # Render the duplicates?
        if (collection = @options.db.duplicates).length
            view = new DuplicatesTableView {
                'el': @el.find('div.duplicates.section')
                collection
            }
            do view.render

        # Summary overview.
        new SummaryView
            'matches': @options.db.matches
            'el': @el.find('div.summary.section')

        # No matches?
        if (collection = @options.db.data.unresolved).length
            new UnresolvedView {
                'el': @el.find('div.unresolved.section')
                collection
            }

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