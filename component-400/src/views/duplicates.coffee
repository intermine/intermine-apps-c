$ = require 'dom'

class DuplicatesView

    template: require '../templates/duplicates/table'

    constructor: ({ @collection }) ->
        @el = $('<div></div>').addClass 'duplicates'
        @views = []

    render: ->
        @el.html do @template

        tbody = @el.find('tbody')
        for model in @collection
            @views.push view = new DuplicatesRowView({ 'model': model })
            tbody.append view.render().el

        @

class DuplicatesRowView

    template: require '../templates/duplicates/row'

    constructor: ({ @model }) ->
        @el = $ '<tr></tr>'    

    render: ->
        @el.html @template @model

        @

module.exports = DuplicatesView