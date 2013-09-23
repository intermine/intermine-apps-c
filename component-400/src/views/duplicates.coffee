$ = require 'jquery'

View = require '../modules/view'

class DuplicatesView extends View

    template: require '../templates/duplicates/table'

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

class DuplicatesRowView extends View

    template: require '../templates/duplicates/row'
    tag: 'tr'

    render: ->
        @el.html @template @model

        @

module.exports = DuplicatesView