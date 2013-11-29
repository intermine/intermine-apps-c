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
        range = [ min..max ]

        # Add the 2 closest decades not represented in the current range (sort of).
        # Which is our closest decade?
        dec = (number) -> Math.round number / 10

        # Give us the range again.
        [ dmin, dmax ] = ranger 0, mid = dec(@options.current - 1), dec(@options.pages - 1)

        # Turn into a decade range.
        decade = (a, b) ->
            [ a..b ]
            # Map back to decades.
            .map( (num) -> num * 10 )
            # Filter out 0 (we have start) and any value appearing in the existing range.
            .filter( (num) -> not (num is 0 or min <= num <= max) )

        # The decades flanks.
        left  = decade dmin, mid
        right = decade mid, dmax

        # Generate the range flanking it with the decades and separating on a null (ellipsis) or a number.
        range = [].concat left, range, right

        # Add separators between items: null (ellipsis) for a gap or a number if gap is of 1.
        @options.range = []
        last = range[0] - 1
        for number in range
            switch
                # Number filler.
                when last + 2 is number
                    @options.range.push last + 1
                # Divider.
                when last + 2 < number < last + 10
                    @options.range.push null
            
            @options.range.push number
            last = number

        # Render our template.
        @el.html @template @options

        # Which page range? Convert page to 0 index.
        b = Math.min (a = (@options.current - 1) * @options.perPage) + @options.perPage, @options.total
        # Trigger a render.
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