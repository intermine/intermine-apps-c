$        = require 'jquery'
Queue    = require 'queue'
nextTick = require 'next-tick'

formatter  = require '../modules/formatter'
mediator   = require '../modules/mediator'
View       = require '../modules/view'
FlyoutView = require '../views/flyout'

class DuplicatesView extends View

    template: require '../templates/duplicates/table'

    events:
        'click .button.add-all': 'addAll'
        'click .button.remove-all': 'removeAll'

    constructor: ->
        super
        @el.addClass 'duplicates section'

    render: ->
        @el.html do @template

        tbody = @el.find('tbody')

        for provided, matched of @collection
            for i, match of matched
                if i is '0'
                    @views.push view = new DuplicatesRowView {
                        'model': match
                        'rowspan': matched.length
                        provided
                    }
                else
                    @views.push view = new DuplicatesRowView({ 'model': match })
                
                tbody.append view.render().el

        @

    # Non blocking add all.
    addAll: (ev) ->
        @doAll('add') unless $(ev.target).hasClass('disabled')

    # Non-blocking remove all.
    removeAll: (ev) ->
        @doAll('remove') unless $(ev.target).hasClass('disabled')

    # The worker to work with "all" jobs.
    doAll: (fn) ->
        # Disable the buttons for a mo.
        (buttons = @el.find('header .button')).addClass('disabled')

        # This many jobs.
        length = i = @views.length
        # In a queue.
        q = new Queue { 'concurrency': 50 }
        
        job = (cb) =>
            # Have we reached the bottom?
            if i--
                do @views[length - i - 1][fn] # 0+
                q.push job
            else
                buttons.removeClass('disabled')
            
            # Go at it again.
            nextTick cb

        # Start the queue.
        q.push job

class DuplicatesRowView extends View

    template: require '../templates/duplicates/row'
    tag: 'tr'

    events:
        'click .button': 'toggle'
        'mouseover .has-flyout': 'toggleFlyout'
        'mouseout .has-flyout': 'toggleFlyout'

    render: ->
        { provided, rowspan, selected } = @options
        matched = formatter.primary @model
        @el.html @template { provided, matched, rowspan, selected }

        @

    # Toggle the selected state of an item.
    toggle: ->
        # Off by default.
        @options.selected ?= no
        # Toggle.
        @options.selected = !@options.selected
        # Say it.
        mediator.trigger 'item:toggle', @options.selected, @model.id
        # Render it.
        do @render

    # Select.
    add: ->
        mediator.trigger 'item:toggle', (@options.selected = yes), @model.id
        # Render it.
        do @render

    # Remove.
    remove: ->
        mediator.trigger 'item:toggle', (@options.selected = no), @model.id
        # Render it.
        do @render

    # Toggle flyout.
    toggleFlyout: (ev) ->
        switch ev.type
            when 'mouseover'
                @views.push view = new FlyoutView({ @model })
                $(ev.target).append view.render().el
            
            when 'mouseout'
                # Only flyouts are in the list.
                ( do view.dispose for view in @views )

module.exports = DuplicatesView