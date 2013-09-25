$ = require 'jquery'

# So we can generate ids for components.
id = 0

class View

    splitter: /^(\S+)\s*(.*)$/
    tag: 'div'
    template: -> ''

    constructor: (opts) ->
        # Give us an identifier so that others know who we are.
        @cid = 'c' + id++

        # Expand on us.
        @options = {}
        for k, v of opts
            switch k
                when 'model', 'collection'
                    @[k] = v
                else
                    @options[k] = v

        # Render to here.
        @el = $ "<#{@tag}/>"

        # Delegate events.
        for event, fn of @events then do (event, fn) =>
            [ ev, selector] = event.match(@splitter)[1...]
            @el.on ev, selector, =>
                @[fn].apply @, arguments

        # Subviews go here.
        @views = []

    render: ->
        if @model
            @el.html @template JSON.parse(JSON.stringify(@model))
        else
            @el.html do @template
        
        @

    dispose: ->
        # Remove any subviews.
        ( do view.dispose for view in @views )
        # Remove the dom element.
        do @el.remove

module.exports = View