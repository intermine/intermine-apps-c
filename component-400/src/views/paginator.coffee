{ $ } = require '../modules/deps'

mediator = require '../modules/mediator'
View     = require '../modules/view'

class Paginator extends View

    template: require '../templates/paginator'

    events:
        'click ul.pagination a': 'onclick'

    constructor: ->
        super

        @options.total    ?= 0  # set the total number of items
        @options.perPage  ?= 5  # how many per page
        @options.current  ?= 0  # the first page to show

        # Calculate total number of pages.
        @options.pages = Math.ceil @options.total / @options.perPage

    # Render the template.
    render: ->
        # Create a range of pages we want to generate links for.
        if 10 < (p = @options.pages)
            # How much on each flank?
            h = Math.floor 10 / 2
            # Render the start, unavailable, the end.
            @options.range = [].concat [ 1...h + 1 ], [ null ], [ p - h + 1...p + 1 ]
        else
            # Business as usual.
            @options.range = [1...p + 1]

        @el.html @template @options

        # Which page range?
        b = Math.min (a = @options.current * @options.perPage) + @options.perPage, @options.total
        mediator.trigger 'page:change', @cid, a, b

        @

    # Events.
    onclick: (evt) ->
        switch fn = (li = $(evt.target).closest('li')).data('action')
            when 'switch' then @select parseInt li.data('page')
            when 'first', 'prev', 'next', 'last' then do @[fn]

        do @render

    # Select the first page.
    first: -> @select 0

    # Select the previous page.
    prev: -> @select Math.max 0, @options.current - 1

    # Select the next page.
    next: -> @select Math.min @options.pages - 1, @options.current + 1

    # Select the last page.
    last: -> @select @options.pages - 1

    # Select a specific page.
    select: (current) -> @options.current = current

module.exports = Paginator