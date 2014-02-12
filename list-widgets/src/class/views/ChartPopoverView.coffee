{ $, Backbone } = require '../../deps'

### Chart Widget bar onclick box.###

class ChartPopoverView extends Backbone.View

    # How many characters can we display in the description?
    descriptionLimit: 50

    # How many objects do we show before ending with an ellipsis?
    valuesLimit: 5

    events:
        "click a.match":   "matchAction"
        "click a.results": "resultsAction"
        "click a.list":    "listAction"
        "click a.close":   "close"

    initialize: (o) ->
        @[k] = v for k, v of o

        @render()

    render: =>
        # Skeleton.
        $(@el).html require('../../templates/popover/popover')
            "description":      @description
            "descriptionLimit": @descriptionLimit
            "style":            'width:300px'
            'can':
                'list':    @widget.token and @listCb
                'results': @resultsCb

        # Grab the data for this bar.
        @widget.queryRows @quickPq, @renderValues

        @

    # Render the values from imjs request.
    renderValues: (response) =>
        values = []
        for object in response
            values.push do (object) ->
                for column in object
                    return column if column and column.length > 0

        $(@el).find('div.values').html require('../../templates/popover/popover.values')
            'values':      values
            'type':        @type
            'valuesLimit': @valuesLimit
            'size':        values.length # size will be what quick pq gives us
            'can':
                'match': @matchCb

    # Onclick the individual match, execute the callback.
    matchAction: (e) =>
        @matchCb $(e.target).text(), @type
        e.preventDefault()

    # View results action callback.
    resultsAction: => @resultsCb @resultsPq

    # Create a list action.
    listAction: => @listCb @resultsPq

    # Switch off.
    close: => $(@el).remove()

module.exports = ChartPopoverView