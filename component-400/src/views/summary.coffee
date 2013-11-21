{ _, csv, saveAs } = require '../modules/deps'

mediator   = require '../modules/mediator'
formatter  = require '../modules/formatter'
View       = require '../modules/view'
Table      = require './table'
Collection = require '../models/collection'

# Translations.
dict =
    'MATCH': 'direct hit'
    'TYPE_CONVERTED': 'converted type'
    'OTHER': 'synonym'
    'WILDCARD': 'wildcard'

# Show summary of all but matches and duplicates.
class SummaryView extends View

    template: require '../templates/summary/tabs'

    events:
        'click .button.download': 'download'

    constructor: ->
        super
        @el.addClass 'summary section'

    render: ->
        @el.html do @template

        tabs    = @el.find '.tabs'
        content = @el.find '.tabs-content'

        isFirst = yes
        for reason, collection of @collection when reason not in [ 'MATCH', 'DUPLICATE' ] and collection.length
            # Switcher.
            @views.push view = new TabSwitcherView { 'model': { 'name': dict[reason]  }, reason }
            tabs.append view.render().el
            
            # Content.
            @views.push view = new TabTableView({ collection, reason })
            content.append view.render().el

            # Show the first one by default.
            mediator.trigger('tab:switch', reason) and isFirst = false if isFirst

        @

    # Saves the summary into a file.
    download: ->
        columns = null ; rows = []

        for reason, collection of @collection when reason not in [ 'MATCH', 'DUPLICATE' ] and collection.length
            for item in collection
                for match in item.matches
                    [ columns, row ] = formatter.csv match, columns
                    rows.push [ item.input, reason ].concat row

        columns = [ 'input', 'reason' ].concat columns

        # Converted to a csv string.
        converted = csv _.map rows, (row) ->
            _.zipObject columns, row
        # Make into a Blob.
        blob = new Blob [ converted ], { 'type': 'text/csv;charset=utf-8' }
        # Save it.
        saveAs blob, 'summary.csv'

# One tab to switch among.
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

# Content of one tab.
class TabTableView extends Table.TableView

    tag: 'li'

    # Listen to tab switching.
    constructor: ->
        # Toggle content?
        mediator.on 'tab:switch', (reason) ->
            @el.toggleClass 'active', @options.reason is reason
        , @

        @

        super

module.exports = SummaryView