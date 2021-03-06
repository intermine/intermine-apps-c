{ _, $ } = require '../deps'

InterMineWidget = require './InterMineWidget'
TableView       = require './views/TableView'
type            = require '../utils/type'

class TableWidget extends InterMineWidget

    # Default widget options that will be merged with user's values.
    widgetOptions:
        'title':       yes
        'description': yes
        'matchCb':     no
        'resultsCb':   no
        'listCb':      no

    # Spec for a successful and correct JSON response.
    spec:
        response:
            "columnTitle":    type.isString
            "title":          type.isString
            "description":    type.isString
            "pathQuery":      type.isString
            "columns":        type.isString
            "pathConstraint": type.isString
            "requestedAt":    type.isString
            "list":           type.isString
            "type":           type.isString
            "notAnalysed":    type.isInteger
            "results":        type.isArray
            "wasSuccessful":  type.isBoolean
            "error":          type.isNull
            "statusCode":     type.isHTTPSuccess

    # Set the params on us and set Google load callback.
    #
    # 0. `imjs`:          intermine.Service
    # 1. `service`:       [http://aragorn:8080/flymine/service/](http://aragorn:8080/flymine/service/)
    # 2. `token`:         token for accessing user's lists
    # 3. `id`:            widgetId
    # 4. `bagName`:       myBag
    # 5. `el`:            #target
    # 6. `widgetOptions`: { "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {} }
    constructor: (@imjs, @service, @token, @id, @bagName, @el, widgetOptions = {}) ->
        # Merge `widgetOptions`.
        @widgetOptions = _.extend {}, @widgetOptions, widgetOptions
        
        @log = []

        super
        
        do @render

    # Visualize the widget.
    render: =>
        # *Loading* overlay.
        timeout = window.setTimeout((=> $(@el).append @loading = $ do require('../templates/loading')), 400)

        # Removes all of the **View**'s delegated events if there is one already.
        @view?.undelegateEvents()

        # Payload.
        data =
            'widget':     @id
            'list':       @bagName
            'token':      @token

        @log.push 'Sending data payload ' + JSON.stringify data

        # Get JSON response by calling the service.
        $.ajax
            url:      "#{@service}list/table"
            dataType: "jsonp"
            data:     data
            
            success: (response) =>
                @log.push 'Received a response ' + JSON.stringify response

                # No need for a loading overlay.
                window.clearTimeout timeout
                @loading?.remove()

                # We have response, validate.
                @validateType response, @spec.response
                # We have results.
                if response.wasSuccessful
                    # Actual name of the widget.
                    @name = response.title

                    @log.push 'Creating new TableView'

                    # New **View**.
                    @view = new TableView(
                        "widget":   @
                        "el":       @el
                        "response": response
                        "options":  @widgetOptions
                    )
            
            error: (request, status, error) => clearTimeout timeout ; @error { 'text': "#{@service}list/table" }, "AJAXTransport"

module.exports = TableWidget