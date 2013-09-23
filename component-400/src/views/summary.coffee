$ = require 'jquery'

View = require '../modules/view'

class SummaryView extends View

    template: require '../templates/summary/tabs'

    render: ->
        @el.html do @template

        tabs = @el.find('.tabs')
        content = @el.find('.tabs-content')

        for i, tab of @collection
            active = i is '0'
            
            # Switcher.
            @views.push view = new TabSwitcherView({ 'model': { 'cid': 'c'+i }, active })
            tabs.append view.render().el
            
            # Content.
            @views.push view = new TableView({ 'model': tab, active })
            content.append view.render().el

        @

class TabSwitcherView extends View

    template: require '../templates/summary/tab'

    tag: 'dd'

    events:
        'click *': 'onclick'

    constructor: ({ active }) ->
        super
        @el.addClass 'active' if active

    onclick: ->
        console.log @model

class TabContentView extends View

    tag: 'li'

    constructor: ({ @model, active }) ->
        super
        @el.addClass 'active' if active

class TableView extends TabContentView

    template: require '../templates/summary/table'

class ListView extends TabContentView

    template: require '../templates/summary/list'

module.exports = SummaryView