{ _, $ } = require '../modules/deps'

mediator   = require '../modules/mediator'
formatter  = require '../modules/formatter'
View       = require '../modules/view'
Paginator  = require './paginator'
FlyoutView = require './flyout'

slicer     = require '../modules/slicer'

# One row in a table.
class TableRowView extends View

    template: require '../templates/table/one-to-many-row'
    
    tag: 'tr'

    events:
        'mouseover .help-flyout': 'toggleFlyout'
        'mouseout .help-flyout': 'toggleFlyout'
        'click a': 'portal'

    render: ->
        matched = formatter.primary @model
        @el.html @template _.extend {}, @model, @options, { matched }

        @

    # Toggle flyout.
    toggleFlyout: (ev) ->
        switch ev.type
            when 'mouseover'
                @views.push view = new FlyoutView({ @model })
                $(ev.target).append view.render().el
            
            when 'mouseout'
                # Only flyouts are in the list.
                ( do view.dispose for view in @views )

    # Visit the portal (probably).
    portal: (ev) ->
        mediator.trigger 'object:click', @model, ev.target

# Paginated tables.
class OneToManyTableView extends View

    template: require '../templates/table/table'

    # Which class to use for the rows?
    rowClass: TableRowView

    constructor: ->
        super
        
        # A single identifier can match multiple objects (apparently).
        # Also cache some stats to go through a range of items faster.
        @pagin = new Paginator 'total': do =>
            i = 0
            _.reduce @collection, (sum, item) ->
                sum += (item.length = item.matches.length)
                item.range = [ i, sum - 1 ] ; i = sum
                sum
            , 0

        # Listen in on table page renders.
        mediator.on 'page:change', (cid, a, b) ->
            # Is this for us?
            return if cid isnt @pagin.cid
            # Render then (the range is inclusive).
            @renderPage.call @, a, b - 1
        , @

    render: ->
        @el.html do @template

        # Pagin.
        @el.find('.paginator').html @pagin.render().el

        @

    # The item range is provided by paginator.
    renderPage: (aRng, bRng) ->
        tbody = @el.find('tbody')

        # Save the range if we need to re-render our page.
        @range = [ aRng, bRng ]

        # Cleanup.
        ( do view.dispose for view in @views )

        # Call the (unit tested) handler.
        i = 0 # for determining even/odd status of leading row columns
        slicer.apply @, [ @collection ].concat @range, ({ input, matches }, begin, end) ->
            # Generate a slice of models.
            for j, model of matches[ begin..end ]
                if j is '0'
                    @views.push view = new @rowClass({
                        'rowspan': end - begin + 1
                        # Override Foundation alternating colors.
                        'class': [ 'even', 'odd' ][i % 2]
                        # Continuing from previous page?
                        'continuing': begin isnt 0
                        # We always pass in arrays.
                        'input': [ input ]
                        model
                    })
                else
                    @views.push view = new @rowClass({ model })
                
                tbody.append view.render().el
            i++

class ManyToOneTableRowView extends TableRowView

    template: require '../templates/table/many-to-one-row'

class ManyToOneTableView extends View

    template: require '../templates/table/table'

    # Which class to use for the rows?
    rowClass: ManyToOneTableRowView

    constructor: ->
        super

        # Multiple identifiers can match multiple objects.
        @pagin = new Paginator 'total': @collection.length
        
        # Listen in on table page renders.
        mediator.on 'page:change', (cid, a, b) ->
            # Is this for us?
            return if cid isnt @pagin.cid
            # Render then (the range is inclusive).
            @renderPage.call @, a, b - 1
        , @

    render: ->
        @el.html do @template

        # Pagin.
        @el.find('.paginator').html @pagin.render().el

        @

    # The item range is provided by paginator.
    renderPage: (aRng, bRng) ->
        tbody = @el.find('tbody')

        # Save the range if we need to re-render our page.
        @range = [ aRng, bRng ]

        # Cleanup.
        ( do view.dispose for view in @views )

        for model in @collection[ aRng..bRng ]
            @views.push view = new @rowClass({ model })
            tbody.append view.render().el

# Exports map!
exports.TableRowView = TableRowView
exports.OtMTableView = OneToManyTableView
exports.MtOTableView = ManyToOneTableView