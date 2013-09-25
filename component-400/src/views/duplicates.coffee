$ = require 'jquery'

formatter = require '../modules/formatter'
mediator  = require '../modules/mediator'
View      = require '../modules/view'

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

    # Blocking (!) add all.
    addAll: -> ( do view.add for view in @views )

    # Blocking (!) remove all.
    removeAll: -> ( do view.remove for view in @views )

class DuplicatesRowView extends View

    template: require '../templates/duplicates/row'
    tag: 'tr'

    events:
        'click .button': 'toggle'

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

module.exports = DuplicatesView