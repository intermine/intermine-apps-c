$ = require 'jquery'

class View

    splitter: /^(\S+)\s*(.*)$/
    tag: 'div'
    template: -> ''

    constructor: (opts) ->
        # Expand on us.
        for k, v of opts
            switch k
                when 'model', 'collection'
                    @[k] = v
                else
                    @options ?= {}
                    @options[k] = v

        # Render to here.
        @el = $ "<#{@tag}/>"

        # Delegate events.
        for event, fn of @events then do (event, fn) =>
            [ ev, selector] = event.match(@splitter)[1...]
            @el.on ev, selector, =>
                @[fn].call @

        # Subviews go here.
        @views = []

    render: ->
        if @model
            @el.html @template JSON.parse(JSON.stringify(@model))
        else
            @el.html do @template
        
        @

module.exports = View