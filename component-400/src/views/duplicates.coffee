$ = require 'jquery'

View = require '../modules/view'

class DuplicatesView extends View

    template: require '../templates/duplicates/table'

    events:
        'click .button.add-all': 'addAll'
        'click .button.remove-all': 'removeAll'

    constructor: ->
        super
        @el.addClass 'duplicates'

    render: ->
        @el.html do @template

        tbody = @el.find('tbody')
        for model in @collection
            @views.push view = new DuplicatesRowView({ 'model': model })
            tbody.append view.render().el

        @

    addAll: ->
        console.log 'Add all'

    removeAll: ->
        console.log 'Remove all'

class DuplicatesRowView extends View

    template: require '../templates/duplicates/row'
    tag: 'tr'

    render: ->
        @el.html @template @model

        @

module.exports = DuplicatesView