$ = require 'jquery'

displayer = require '../modules/displayer'
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

    addAll: ->
        console.log 'Add all'

    removeAll: ->
        console.log 'Remove all'

class DuplicatesRowView extends View

    template: require '../templates/duplicates/row'
    tag: 'tr'

    events:
        'click .button.add': 'add'

    render: ->
        { provided, rowspan } = @options
        matched = displayer @model
        @el.html @template { provided, matched, rowspan }

        @

    add: ->
        console.log 'Add row'

module.exports = DuplicatesView