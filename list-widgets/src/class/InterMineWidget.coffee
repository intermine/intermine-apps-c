{ $, intermine } = require '../deps'

class InterMineWidget

    # Inject wrapper inside the target `div` that we have control over.
    constructor: ->
        @log = @log or [] # useless if fallback used

        @log.push 'Creating wrapping element'
        $(@el).html $ '<div/>',
            'class': "inner"
            'style': "height:572px;overflow:hidden;position:relative"
        
        @el = $(@el).find 'div.inner'

        # Monitor hashchange for debug mode.
        @log.push 'Monitoring for debug mode'
        $(window).on 'hashchange', =>
            if window.location.hash is '#debug'
                # Add a debug button.
                $(@el).append $ '<a/>',
                    'class': 'btn btn-small btn-warning'
                    'text': 'Debug'
                    'style': 'z-index:5;position:absolute;display:block;top:0;left:0'            
                    # Click handler.
                    click: =>
                        pre = $ '<pre/>', 'html': @log.join('\n\n')
                        $(@el).css('overflow', 'scroll').html(pre)

    # Validate JSON object against the spec.
    validateType: (object, spec) =>
        @log.push 'Validating ' + JSON.stringify object
        fails = []
        for key, value of object
            r = new spec[key]?(value)
            if r and not r.is()
                fails.push require('../templates/invalidjsonkey') {
                    'actual':   do r.is
                    'expected': new String(r)
                    key
                }
        
        if fails.length then @error fails, "JSONResponse"

    # The possible errors we handle.
    error: (opts={'title': 'Error', 'text': 'Generic error'}, type) =>
        # Add the name of the widget.
        opts.name = @name or @id
        
        # Which?
        switch type
            when "AJAXTransport"
                opts.title = "AJAX Request Failed"
            when "JSONResponse"
                opts.title = "Invalid JSON Response"
                opts.text = "<ol>#{opts.join('')}</ol>"

        # Show.
        $(@el).html require('../templates/error') opts

        @log.push opts.title

        # Throw an error so we do not process further.
        @fireEvent 'event': 'error', 'type': type, 'message': opts.title

    # Fire a custom event (so we can capture in headless browser).
    fireEvent: (obj) ->
        evt = document.createEvent 'Events'
        evt.initEvent 'InterMine', yes, yes
        ( evt[key] = value for key, value of obj )
        evt.source = 'ListWidgets'
        evt.widget =
            'id':  @id
            'bag': @bagName
            'el':  @el
            'service': @service
        
        window.dispatchEvent evt

    # Call the service and return results.
    queryRows: (query, cb) =>
        @log.push 'Querying for rows'

        # TODO: capture errors.
        @imjs.rows(query).then (val) =>
            do cb val


module.exports = InterMineWidget