{ _, $ } = require '../deps'

InterMineWidget = require './InterMineWidget'
EnrichmentView  = require './views/EnrichmentView'
type            = require '../utils/type'

class EnrichmentWidget extends InterMineWidget

    # Default widget options that will be merged with user's values.
    widgetOptions:
        "title":       true
        "description": true
        matchCb:          (id, type) ->
            console?.log id, type
        resultsCb:        (pq) ->
            console?.log pq
        listCb:           (pq) ->
            console?.log pq
    
    formOptions:
        # Default error correction.
        errorCorrection: "Holm-Bonferroni"
        # Default p-value.
        pValue:          "0.05"

    errorCorrections: [ "Holm-Bonferroni", "Benjamini Hochberg", "Bonferroni", "None" ]
    pValues:          [ "0.05", "0.10", "1.00" ]

    # Spec for a successful and correct JSON response.
    spec:
        response:
            "title":                           type.isString
            "description":                     type.isString
            "pathQuery":                       type.isJSON
            "pathConstraint":                  type.isString
            "error":                           type.isNull
            "list":                            type.isString
            "notAnalysed":                     type.isInteger
            "requestedAt":                     type.isString
            "results":                         type.isArray
            "label":                           type.isString
            "statusCode":                      type.isHTTPSuccess
            "type":                            type.isString
            "wasSuccessful":                   type.isBoolean
            "filters":                         type.isString
            "filterLabel":                     type.isString
            "filterSelectedValue":             type.isString
            "externalLink":                    type.isString
            "pathQueryForMatches":             type.isString
            "is_logged":                       type.isBoolean
            "current_population":              type.isStringOrNull
            "message":                         type.isString
            "extraAttribute":                  type.isStringOrNull

    ###
    Set the params on us and render.
    @param {object} intermine.Service
    @param {string} service http://aragorn.flymine.org:8080/flymine/service/
    @param {string} token Token for accessing user's lists
    @param {Array} lists All lists that we have access to
    @param {string} id widgetId
    @param {string} bagName myBag
    @param {string} el #target
    @param {object} widgetOptions { "title": true/false, "description": true/false, "matchCb": function(id, type) {}, "resultsCb": function(pq) {}, "listCb": function(pq) {}, "errorCorrection": "Holm-Bonferroni", "pValue": "0.05" }
    ###
    constructor: (@imjs, @service, @token, @lists, @id, @bagName, @el, widgetOptions = {}) ->
        # Key-values to extract from options.
        formKeys = [ 'errorCorrection', 'pValue' ]
        formOptions = {}
        # Save them on form.
        ( formOptions[k] = v for k, v of widgetOptions when k in formKeys )
        # Delete them from options.
        ( delete widgetOptions[k] for k in formKeys )

        # Merge `widgetOptions`.
        @widgetOptions = _.extend {}, @widgetOptions, widgetOptions

        # Set form options for this widget.
        @formOptions = _.extend {}, @formOptions, formOptions

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
            'correction': @formOptions.errorCorrection
            'maxp':       @formOptions.pValue
            'token':      @token

        # An extra form filter?
        for key, value of @formOptions
            # This should be handled better...
            if key not in [ 'errorCorrection', 'pValue', 'current_population', 'remember_population', 'gene_length_correction' ] then key = 'filter'
            data[key] = value

        @log.push 'Sending data payload ' + JSON.stringify data

        # Request new data.
        $.ajax
            'url':      "#{@service}list/enrichment"
            'dataType': "jsonp"
            'data':     data
            
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

                    # Pass on only lists of our type that are not empty.
                    lists = ( l for l in @lists when l.type is response.type and l.size isnt 0 )

                    @log.push 'Creating new EnrichmentView'

                    # New **View**.
                    @view = new EnrichmentView(
                        "widget":   @
                        "el":       @el
                        "template": @template
                        "response": response
                        "form":
                            "options":          @formOptions
                            "pValues":          @pValues
                            "errorCorrections": @errorCorrections
                        "options":  @widgetOptions
                        "lists": lists
                    )
            
            error: (request, status, error) => clearTimeout timeout ; @error { 'text': "#{@service}list/enrichment" }, "AJAXTransport"

module.exports = EnrichmentWidget