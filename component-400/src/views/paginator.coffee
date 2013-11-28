{ $, _ } = require '../modules/deps'

mediator = require '../modules/mediator'
View     = require '../modules/view'

# Do not forget to run `test/paginator.coffee` if you change something.
# Pages are 1 indexed.
class Paginator extends View

    template: require '../templates/paginator'

    events:
        'click ul.pagination a': 'onclick'

    constructor: ->
        super

        @options.total    ?= 0 # set the total number of items
        @options.perPage  ?= 5 # how many per page
        @options.current  ?= 1 # the first page to show

        # Calculate total number of pages.
        @options.pages = Math.ceil @options.total / @options.perPage

    # Render the template.
    render: ->
        # [ a..x..b ]
        ranger = (a, x, b) ->
            # Ideal range.
            min = x - 2
            max = x + 2

            # Fill to 5.
            min += diff if (diff = b - max) < a
            max += min * -1 if min < a            

            # Trim it.
            min = Math.max min, a
            max = Math.min max, b

            [ min, max ]

        # Generate the inner range.
        [ min, max ] = ranger 1, @options.current, @options.pages

        # Get the inner range (will probably be extended by decades below).
        @options.range = [ min..max ]

        # Add the 2 closest decades not represented in the current range (sort of).
        # Which is our closest decade?
        dec = (number) -> Math.round number / 10

        # Give us the range again.
        [ dmin, dmax ] = ranger 0, dec(@options.current - 1), dec(@options.pages - 1)

        decades = [ dmin..dmax ]
        # Map back to decades.
        .map( (num) -> num * 10 )
        # Filter out 0 (we have start) and any value appearing in the existing range.
        .filter( (num) -> not (num is 0 or min <= num <= max) )

        # Generate the range flanking it with the decades and separating on a null (ellipsis).
        if (slice = decades.filter( (num) -> num < min )).length
            div = if slice[..-1] < min - 1 then [ null ] else []
            @options.range = slice.concat div, @options.range
        
        if (slice = decades.filter( (num) -> num > max )).length
            div = if slice[0] > max + 1 then [ null ] else []
            @options.range = @options.range.concat div, slice

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