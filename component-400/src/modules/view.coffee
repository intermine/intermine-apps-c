{ $ } = require './deps'

# So we can generate ids for components.
id = 0

class View

    # Automatically render?
    autoRender: no

    # Event delegation pattern.
    splitter: /^(\S+)\s*(.*)$/
    
    # Default DOM element.
    tag: 'div'
    
    # Default template function.
    template: -> ''

    constructor: (opts) ->
        # Give us an identifier so that others know who we are.
        @cid = 'c' + id++

        # Expand on us.
        @options = {}
        for k, v of opts
            switch k
                when 'collection', 'model'
                    @[k] = v
                when 'el'
                    @el = $ v
                else
                    @options[k] = v

        # New element?
        @el = $("<#{@tag}/>") unless @el instanceof $

        # Delegate events.
        for event, fn of @events then do (event, fn) =>
            [ ev, selector] = event.match(@splitter)[1...]
            @el.on ev, selector, =>
                @[fn].apply @, arguments

        # Subviews go here.
        @views = []

        # Auto-render?
        do @render if @autoRender

    # Override me.
    render: ->
        switch
            when @collection
                @el.html @template 'collection': JSON.parse(JSON.stringify(@collection))
            when @model
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