$ = require 'jquery'
_ = require 'object' # keys, values, length, isEmpty, merge

mediator = require '../modules/mediator'
View     = require '../modules/view'

HeaderView     = require './header'
DuplicatesView = require './duplicates'
NoMatchesView  = require './nomatches'
SummaryView    = require './summary'

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
                if text = tooltips[(target = $(ev.target)).data('id')]
                    @views.push view = new Tooltip({ 'model': { text } })
                    target.after view.render().el
                    do view.reposition
            
            when 'mouseout'
                # Only tooltips are in the list.
                # ( do view.dispose for view in @views )
                no

class Tooltip extends View

    tag: 'span'

    template: require '../templates/tooltip'

    constructor: ->
        super

        @el.addClass('tooltip tip-top noradius')

    # Reposition post render.
    reposition: ->
        { top, left } = (parent = @el.parent()).offset()

        top  -= do @el.height
        left -= do @el.width

        @el.css({ top, left })

# Tooltip text.
tooltips =
    '0': 'Because I said so'
    '1': 'Choose, do it'
    '2': 'Summarizing you know'
    '3': 'Tabitha Tabby'

module.exports = AppView