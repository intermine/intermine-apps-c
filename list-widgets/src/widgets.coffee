{ $, google } = require './deps'

ChartWidget      = require './class/ChartWidget'
EnrichmentWidget = require './class/EnrichmentWidget'
TableWidget      = require './class/TableWidget'

# Public interface for the various InterMine Widgets.
class Widgets

    ###
    New Widgets client.
    @param {string} service A string pointing to service endpoint e.g. http://aragorn:8080/flymine/service/
    @param {string} token A string for accessing user's lists.
    or
    @param {Object} opts Config just like imjs consumes e.g. `{ "root": "", "token": "" }`
    ###
    constructor: (arg0, arg1) ->
        if typeof arg0 is 'string'
            # Assuming a service.
            @root = arg0
            # Do we have a token?
            @token = arg1
            serviceOpts = {@root, @token}
        else
            # Assuming an object.
            { @root, @token } = serviceOpts = arg0
            unless @root
                throw new Error 'You need to set the `root` parameter pointing to the mine\'s service'

        # Create a new imjs instance.
        @imjs = new intermine.Service serviceOpts

        # We will probably want to get user's lists.
        @lists = @imjs.fetchLists()

    ###
    Chart Widget.
    @param {string} id Represents a widget identifier as represented in webconfig-model.xml
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {} }`
    ###
    chart: (id, bagName, el, widgetOptions) ->
        # Load Google Visualization.
        google.charts.load 'current',
            packages: [ 'corechart' ]
            callback: =>
                # Passed in an object?
                { id, bag, bagName, el, widgetOptions, opts } = id if _.isObject id

                # New syntax?
                widgetOptions = opts if opts

                # Passed in a list?
                bagName = bag.name if bag and _.isObject bag

                new ChartWidget @imjs, @root, @token, id, bagName, el, widgetOptions

    ###
    Enrichment Widget.
    @param {string} id Represents a widget identifier as represented in webconfig-model.xml
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {}, "errorCorrection": "Holm-Bonferroni", "pValue": "0.05" }`
    ###
    enrichment: (id, bagName, el, widgetOptions) ->
        @lists.then (lists) =>
            # Passed in an object?
            { id, bag, bagName, el, widgetOptions, opts } = id if _.isObject id

            # New syntax?
            widgetOptions = opts if opts

            # Passed in a list?
            bagName = bag.name if bag and _.isObject bag

            new EnrichmentWidget @imjs, @root, @token, lists, id, bagName, el, widgetOptions

        , (err) =>
            $(opts[2]).html $ '<div/>',
            'class': "alert alert-error"
            'html':  "#{errstatusText} for <a href='#{@root}widgets'>#{@root}widgets</a>"

    ###
    Table Widget.
    @param {string} id Represents a widget identifier as represented in webconfig-model.xml
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {} }`
    ###
    table: (id, bagName, el, widgetOptions) ->
        # Passed in an object?
        { id, bag, bagName, el, widgetOptions, opts } = id if _.isObject id

        # New syntax?
        widgetOptions = opts if opts

        # Passed in a list?
        bagName = bag.name if bag and _.isObject bag

        new TableWidget @imjs, @root, @token, id, bagName, el, widgetOptions

    ###
    All available List Widgets.
    @param {string} type Class of objects e.g. Gene, Protein.
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {} }`
    ###
    all: (type="Gene", bagName, el, widgetOptions) ->
        # Passed in an object?
        { type, bag, bagName, el, widgetOptions, opts } = type if _.isObject type

        # New syntax?
        widgetOptions = opts if opts

        # Trouble.
        error = (content) =>
            $(el).html $ '<div/>',
                'class': "alert alert-error"
                'html':  "#{content} for <a href='#{@root}widgets'>#{@root}widgets</a>"

        # When all is said and done.
        show = (widgets, type) =>
            # For all that match our object type...
            for w in widgets when type in w.targets
                # Create target element for individual Widget (slugify just to make sure).
                widgetEl = w.name
                .replace(/[^-a-zA-Z0-9,&\s]+/ig, '')
                .replace(/-/gi, "_")
                .replace(/\s/gi, "-")
                .toLowerCase()
                # Append it.
                $(el).append target = $('<div/>',
                    'id': widgetEl
                    'class': "widget span6"
                )
                # Load it.
                @[w.widgetType] w.name, bagName, target, widgetOptions

        $.ajax
            'url':      "#{@root}widgets"
            'dataType': 'jsonp'

            success: (res) =>
                return error 'No widgets have been configured' unless res.widgets

                # Have type, move along.
                return show res.widgets, type if type

                # Do we have a bag object?
                return show res.widgets, bag.type if bag and _.isObject bag

                # Fetch the list then.
                unless type then @imjs.fetchList bagName, (err, bag) ->
                    return error err if err
                    show res.widgets, bag.type

            error: (xhr, opts, err) -> error xhr.statusText

module.exports = Widgets
