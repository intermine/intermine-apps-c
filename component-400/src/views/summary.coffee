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

        isFirst = yes
        for reason, collection of @collection
            # Switcher.
            @views.push view = new TabSwitcherView {
                'model': { 'name': @options.dict[reason] }, reason
            }
            tabs.append view.render().el
            
            # Content.
            @views.push view = new TableView({ collection, reason })
            content.append view.render().el

            # Show the first one by default.
            mediator.trigger('tab:switch', reason) and isFirst = false if isFirst

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
        mediator.on 'tab:switch', (reason) ->
            @el.toggleClass 'active', @options.reason is reason
        , @

    onclick: ->
        mediator.trigger 'tab:switch', @options.reason

class TabContentView extends View

    tag: 'li'

    constructor: ->
        super
        # Toggle content?
        mediator.on 'tab:switch', (reason) ->
            @el.toggleClass 'active', @options.reason is reason
        , @

class TableView extends TabContentView

    template: require '../templates/summary/table'

    render: ->
        @el.html do @template

        tbody = @el.find('tbody')

        for model in @collection
            @views.push view = new TableRowView({ model })
            tbody.append view.render().el

        @

class TableRowView extends View

    template: require '../templates/summary/row'
    tag: 'tr'

    render: ->
        matched = @model.object.summary.primaryIdentifier
        @el.html @template { 'provided': @model.provided, matched }

        @

class ListView extends TabContentView

    template: require '../templates/summary/list'

module.exports = SummaryView