$ = require 'jquery'

mediator = require '../modules/mediator'
View     = require '../modules/view'

class SummaryView extends View

    template: require '../templates/summary/tabs'

    events:
        'click .button.download': 'download'

    constructor: ->
        super
        @el.addClass 'summary section'

    render: ->
        @el.html do @template

        tabs = @el.find('.tabs')
        content = @el.find('.tabs-content')

        for i, model of @collection
            # Switcher.
            @views.push view = new TabSwitcherView({ model })
            tabs.append view.render().el
            
            # Content.
            @views.push view = new TableView({ model })
            content.append view.render().el

            # Show the first one by default.
            mediator.trigger('tab:switch', model.cid) if i is '0'

        @

    download: ->
        console.log 'Download summary'

class TabSwitcherView extends View

    template: require '../templates/summary/tab'

    tag: 'dd'

    events:
        'click *': 'onclick'

    constructor: ->
        super
        # Toggle tab?
        mediator.on 'tab:switch', (cid) ->
            @el.toggleClass 'active', @model.cid is cid
        , @

    onclick: ->
        mediator.trigger 'tab:switch', @model.cid

class TabContentView extends View

    tag: 'li'

    constructor: ->
        super
        # Toggle content?
        mediator.on 'tab:switch', (cid) ->
            @el.toggleClass 'active', @model.cid is cid
        , @

class TableView extends TabContentView

    template: require '../templates/summary/table'

class ListView extends TabContentView

    template: require '../templates/summary/list'

module.exports = SummaryView