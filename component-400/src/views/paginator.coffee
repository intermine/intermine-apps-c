$ = require 'jquery'

View = require '../modules/view'

class Paginator extends View

    template: require '../templates/paginator'

    events:
        'click a': 'onclick'

    constructor: ->
        super

        @options.total   ?= 0
        @options.perPage ?= 5
        @options.current ?= 0

        # Total number of pages.
        @options.pages = Math.ceil @options.total / @options.perPage

    # Select the previous page.
    prev: -> @select Math.max 0, @options.current - 1

    # Select the next page.
    next: -> @select Math.min @options.pages - 1, @options.current + 1

    # Select a specific page.
    select: (current) -> @options.current = current

    render: ->
        @el.html @template @options
        @

    onclick: (evt) ->
        switch (li = $(evt.target).closest('li')).data('action')
            when 'prev' then do @prev
            when 'next' then do @next
            when 'switch' then @select parseInt li.data('page')

        do @render

module.exports = Paginator