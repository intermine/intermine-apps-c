$ = require 'jquery'

mediator  = require '../modules/mediator'
exporter  = require '../modules/exporter'
displayer = require '../modules/displayer'
View      = require '../modules/view'
Paginator = require './paginator'

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
        do exporter

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

    constructor: ->
        super

        @pagin = new Paginator({ 'total': @collection.length })

        # Listen in on table page renders.
        mediator.on 'page:change', (cid, a, b) ->
            # Is this for us?
            return if cid isnt @pagin.cid
            # Render then.
            @renderPage.call @, a, b
        , @

    render: ->
        @el.html do @template

        # Pagin.
        @el.find('.paginator').html @pagin.render().el

        @

    # The item range is provided by paginator.
    renderPage: (a, b) ->
        tbody = @el.find('tbody')

        # Cleanup.
        ( do view.dispose for view in @views )

        # Which range?
        for model in @collection[ a...b ]
            @views.push view = new TableRowView({ model })
            tbody.append view.render().el

class TableRowView extends View

    template: require '../templates/summary/row'
    tag: 'tr'

    render: ->
        matched = displayer @model
        @el.html @template { 'provided': @model.provided, matched }

        @

class ListView extends TabContentView

    template: require '../templates/summary/list'

module.exports = SummaryView