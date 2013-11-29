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
        # [ lower..middle..upper ]
        ranger = (lower, middle, upper) ->
            a = b = middle
            
            dec = ->
                # We could not decrease.
                return no if (nu = a - 1) < lower
                a -= 1 ; yes

            inc = ->
                # We could not increase.
                return no if (nu = b + 1) > upper
                b += 1 ; yes

            # How many to show on each side.
            flanks = 2
            
            # Keep adding to the page range around our number.
            while flanks--
                # Try adding or reduce.
                (break unless do dec) unless do inc
                
                # Try reducing or add.
                (break unless do inc) unless do dec

            [ a, b ]

        # Generate the inner range.
        [ iMin, iMax ] = ranger 1, @options.current, @options.pages

        # Get the inner range (will probably be extended by decades below).
        inner = [ iMin..iMax ]

        # Add the 2 closest decades not represented in the current range.
        [ oMin, oMax ] = ranger 0
        # Find the closest decade.
        , Math.round(@options.current / 10)
        # The upper limit is the highest decade.
        , Math.floor(@options.pages / 10)

        # The decades outer range.
        outer = [ oMin..oMax ]
        # Convert to decades again.
        .map( (num) -> num * 10 )
        # Remove.
        .filter( (num) -> num isnt 0 )

        # Merge sort them into a full range, removing dupes.
        range = _.unique [].concat(outer, inner).sort( (a, b) -> a - b ), yes

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