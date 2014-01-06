{ _ }      = require '../modules/deps'

formatter  = require '../modules/formatter'
mediator   = require '../modules/mediator'
View       = require '../modules/view'
FlyoutView = require '../views/flyout'
Table      = require '../views/table'

Daddy = Table.TableRowView

class DuplicatesTableRowView extends Daddy

    # Provide custom template.
    template: require '../templates/duplicates/row'

    # Add extra event to toggle.
    events: _.extend {}, Daddy::events, 'click .button': 'toggle'

    # Toggle the selected state of an item.
    toggle: ->
        # Off by default.
        @model.selected ?= no
        # Toggle.
        @model.selected = !@model.selected
        # Say it.
        mediator.trigger 'item:toggle', @model.selected, @model.id
        # Render it.
        do @render

class DuplicatesTableView extends Table.OtMTableView

    # Provide custom template.
    template: require '../templates/duplicates/table'

    rowClass: DuplicatesTableRowView

    # Add object adding events.
    events:
        'click .button.add-all': 'addAll'
        'click .button.remove-all': 'removeAll'

    render: ->
        @el.addClass 'duplicates section'

        super

    # Blocking add all.
    addAll: ->
        @doAll yes

    # Blocking remove all.
    removeAll: ->
        @doAll no

    # A blocking worker to toggle all matches.
    doAll: (state) ->
        for item in @collection
            for match in item.matches
                mediator.trigger 'item:toggle', (match.selected = state), match.id
        
        # Re-render our pageful of children.
        @renderPage.apply @, @range

module.exports = DuplicatesTableView