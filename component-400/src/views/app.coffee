$ = require 'jquery'
_ = require 'object' # keys, values, length, isEmpty, merge

mediator = require '../modules/mediator'
View     = require '../modules/view'

HeaderView     = require './header'
DuplicatesView = require './duplicates'
NoMatchesView  = require './nomatches'
SummaryView    = require './summary'
HeaderView     = require './header'
TooltipView    = require './tooltip'

class AppView extends View

    autoRender: yes

    events:
        'mouseover .has-tip': 'toggleTooltip'
        'mouseout .has-tip':  'toggleTooltip'

    constructor: ->
        super

        @el.addClass('foundation')

        # Global save, call back.
        mediator.on 'save', =>
            @options.cb null, _.keys @collection.selected
        @

    render: ->
        # Render the header.
        @el.append (new HeaderView({ 'collection': @collection })).render().el

        { dupes, summary, dict } = @collection

        # Render the duplicates?
        @el.append((new DuplicatesView({
            'collection': dupes
        })).render().el) if dupes

        # Summary overview?
        @el.append((new SummaryView({
            'collection': summary
            dict
        })).render().el) if summary

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