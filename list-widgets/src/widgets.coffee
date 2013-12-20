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
    constructor: (opts...) ->
        if typeof opts[0] is 'string'
            # Assuming a service.
            @root = opts[0]
            # Do we have a token?
            @token = opts[1]
        else
            # Assuming an object.
            if opts[0].root?
                @root = opts[0].root
            else
                throw Error 'You need to set the `root` parameter pointing to the mine\'s service'
            # Do we have a token?
            @token = opts[0].token

        # Create a new imjs instance.
        @imjs = new intermine.Service { @root, @token }

        # We will probably want to get user's lists.
        @lists = @imjs.fetchLists()

    ###
    Chart Widget.
    @param {string} id Represents a widget identifier as represented in webconfig-model.xml
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {} }`
    ###
    chart: (opts...) ->
        # Load Google Visualization.
        google.load 'visualization', '1.0',
            packages: [ 'corechart' ]
            callback: =>
                new ChartWidget @imjs, @root, @token, opts...
    
    ###
    Enrichment Widget.
    @param {string} id Represents a widget identifier as represented in webconfig-model.xml
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {}, "errorCorrection": "Holm-Bonferroni", "pValue": "0.05" }`
    ###
    enrichment: (opts...) ->
        done = (lists) =>
            new EnrichmentWidget @imjs, @root, @token, lists, opts...
            
        # noLists = => $(opts[2]).html $ '<div/>',
        #     'class': "alert alert-error"
        #     'html':  "Problem fetching lists we have access to <a href='#{@root}lists'>#{@root}lists</a>"

        error = (err) =>
            $(opts[2]).html $ '<div/>',
            'class': "alert alert-error"
            'html':  "#{errstatusText} for <a href='#{@root}widgets'>#{@root}widgets</a>"

        @lists.then(done, error)

    ###
    Table Widget.
    @param {string} id Represents a widget identifier as represented in webconfig-model.xml
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {} }`
    ###
    table: (opts...) ->
        new TableWidget @imjs, @root, @token, opts...

    ###
    All available List Widgets.
    @param {string} type Class of objects e.g. Gene, Protein.
    @param {string} bagName List name to use with this Widget.
    @param {jQuery selector} el Where to render the Widget to.
    @param {Object} widgetOptions `{ "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {} }`
    ###
    all: (type="Gene", bagName, el, widgetOptions) ->
        $.ajax
            'url':      "#{@root}widgets"
            'dataType': 'jsonp'
            
            success: (response) =>
                # We have results.
                if response.widgets
                    # For all that match our object type...
                    for widget in response.widgets when type in widget.targets
                        # Create target element for individual Widget (slugify just to make sure).
                        widgetEl = widget.name
                        .replace(/[^-a-zA-Z0-9,&\s]+/ig, '')
                        .replace(/-/gi, "_")
                        .replace(/\s/gi, "-")
                        .toLowerCase()
                        # Append it.
                        $(el).append target = $('<div/>', 'id': widgetEl, 'class': "widget span6")
                        # Load it.
                        @[widget.widgetType] widget.name, bagName, target, widgetOptions
            
            error: (xhr, opts, err) => $(el).html $ '<div/>',
                'class': "alert alert-error"
                'html':  "#{xhr.statusText} for <a href='#{@root}widgets'>#{@root}widgets</a>"

module.exports = Widgets
