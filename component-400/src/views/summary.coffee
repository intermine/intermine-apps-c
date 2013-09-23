$ = require 'dom'

class SummaryView

    template: require '../templates/summary/tabs'

    constructor: ({ @collection }) ->
        @el = $('<div></div>').addClass 'summary'
        @views = []

    render: ->
        @el.html do @template

        for i, tab of @collection
            @views.push view = new TableView({ 'model': tab, 'active': i is '1' })
            @el.find('.tabs-content').append view.render().el

        @

class TableView

    template: require '../templates/summary/table'

    constructor: ({ @model, active }) ->
        @el = $ '<li></li>'
        @el.addClass 'active' if active

    render: ->
        @el.html do @template

        @

class ListView

    template: require '../templates/summary/list'

    constructor: ({ @model, active }) ->
        @el = $ '<li></li>'
        @el.addClass 'active' if active

    render: ->
        @el.html do @template

        @

module.exports = SummaryView