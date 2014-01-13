{ _, $ } = require '../modules/deps'

mediator   = require '../modules/mediator'
formatter  = require '../modules/formatter'
options    = require '../modules/options'
View       = require '../modules/view'
Paginator  = require './paginator'
FlyoutView = require './flyout'

slicer     = require '../modules/slicer'

# Which templates to use in tables?
strategy = options.get 'matchViewStrategy'
templates =
    table: require '../templates/table/table'
    thead: require "../templates/table/table-head-#{strategy}"

# For storing table & row columns.
Fields = ->
    list = []
    list.set = {}
    list.add = (key) ->
        # Are we in?
        return if list.set[key]
        obj = { key, 'name': formatter.field key }
        list.set[key] = obj # add to set
        list.push obj # push to the list
    
    # Export.
    list

# One row in a table.
class TableRowView extends View

    template: require '../templates/table/one-to-many-row'
    
    tag: 'tr'

    events:
        'mouseover .help-flyout': 'toggleFlyout'
        'mouseout .help-flyout': 'toggleFlyout'
        'click a': 'portal'

    constructor: ->
        super

        # Display strategy.
        @strategy = options.get 'matchViewStrategy'

    render: ->
        # The actual fields to show.
        fields = []

        # Show the flyout with summary?
        showFlyout = yes

        # Which is our display strategy?
        switch @strategy
            # Show all fields.
            when 'full'
                if @options.fields
                    for { key } in @options.fields
                        fields.push @model.summary[key]
                    showFlyout = no
            # Show only the "main" field and a flyout.
            when 'slim'
                fields.push formatter.primary @model

        @el.html @template
            'fields':  fields
            'input':   @model.input
            'rowspan': @options.rowspan
            'class':   @options.class
            'options': { showFlyout }

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

    template: templates

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
        @el.html do @template.table

        # Pagin.
        @el.find('.paginator').html @pagin.render().el

        @

    # The item range is provided by paginator.
    renderPage: (aRng, bRng) ->
        # Save the range if we need to re-render our page.
        @range = [ aRng, bRng ]

        # Cleanup.
        @views.pop().dispose() while @views.length

        # Collect the summary fields of these objects.
        fields = new Fields()

        # Call the (unit tested) handler.
        i = 0 # for determining even/odd status of leading row columns
        slicer.apply @, [ @collection ].concat @range, ({ input, matches }, begin, end) ->
            # Generate a slice of models.
            for j, model of matches[ begin..end ]
                # The rest.
                return @views.push view = new @rowClass({ model, fields }) unless j is '0'
                # Leading row.
                @views.push view = new @rowClass({
                    model,
                    fields,
                    # How many rows do we cover?
                    'rowspan': end - begin + 1
                    # Override Foundation alternating colors.
                    'class': [ 'even', 'odd' ][i % 2]
                    # Continuing from previous page?
                    'continuing': begin isnt 0
                    # We always pass in arrays.
                    'input': [ input ]
                })
                # Give us a set of fields.
                _.each _.keys(model.summary), fields.add
            i++

        # Render the head.
        @el.find('thead').html @template.thead { fields }

        # Render the rows.
        tbody = @el.find 'tbody'
        _.each @views, (view) ->
            tbody.append view.render().el

class ManyToOneTableRowView extends TableRowView

    template: require '../templates/table/many-to-one-row'

class ManyToOneTableView extends View

    template: templates

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
        @el.html do @template.table

        # Pagin.
        @el.find('.paginator').html @pagin.render().el

        @

    # The item range is provided by paginator.
    renderPage: (aRng, bRng) ->
        # Save the range if we need to re-render our page.
        @range = [ aRng, bRng ]

        # Cleanup.
        @views.pop().dispose() while @views.length

        # Collect the summary fields of these objects.
        fields = new Fields()

        # Create the rows.
        for model in @collection[ aRng..bRng ]
            @views.push new @rowClass({ model, fields })

            # Give us a set of fields.
            _.each _.keys(model.summary), fields.add

        # Render the head.
        @el.find('thead').html @template.thead { fields }

        # Render the rows.
        tbody = @el.find 'tbody'
        _.each @views, (view) ->
            tbody.append view.render().el

# Exports map!
exports.TableRowView = TableRowView
exports.OtMTableView = OneToManyTableView
exports.MtOTableView = ManyToOneTableView