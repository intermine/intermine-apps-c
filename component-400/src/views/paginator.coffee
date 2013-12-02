{ $, _ } = require '../modules/deps'

mediator = require '../modules/mediator'
View     = require '../modules/view'

# Do not forget to run `test/paginator.coffee` if you change something.
# Pages are 1 indexed.
class Paginator extends View

    template: require '../templates/paginator'

    events:
        'click a': 'onclick'
        'click div.dropdown': 'dropdown'

    constructor: ->
        super

        @options.total    ?= 0 # set the total number of items
        @options.perPage  ?= 5 # how many per page
        @options.current  ?= 1 # the first page to show

    # Render the template.
    render: ->
        # Calculate total number of pages.
        @options.pages = Math.ceil @options.total / @options.perPage

        do =>
            @options.range = []
            
            # Don't show if only a single page.
            return if @options.pages is 1
            
            # The perfect range.
            min = @options.current - 2
            max = @options.current + 2

            # Overflow? Decrease the lower bound.
            min += diff if (diff = @options.pages - max) < 0
            
            # Underflow? Increase the upper bound.
            max += diff if (diff = 1 - min) > 0

            # Finally trim and create a range.
            range = [ Math.max(1, min) .. Math.min(@options.pages, max) ]

            # Add the first and last pages.
            range.push 1
            range.push @options.pages

            # Filter out and sort.
            range = _.unique(range).sort( (a, b) -> a - b )

            # Add dividers.
            @options.range = []

            previous = range[0] - 1
            for number in range
                # Optional divider.
                if previous
                    switch
                        # A fillter.
                        when previous + 2 is number
                            @options.range.push previous + 1
                        # Ellipsis.
                        when previous + 1 < number
                            @options.range.push null

                # Add to the stack.
                @options.range.push previous = number

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
            when 'select', 'resize' then @[fn] parseInt(li.data('n'))
            when 'first', 'prev', 'next', 'last' then do @[fn]

        # Always re-render.
        do @render

        # No event chaining.
        do evt.preventDefault
        no

    # Select the first page.
    first: -> @select 0

    # Select the previous page.
    prev: -> @select Math.max 1, @options.current - 1

    # Select the next page.
    next: -> @select Math.min @options.pages, @options.current + 1

    # Select the last page.
    last: -> @select @options.pages - 1

    # Select a specific page.
    select: (current) -> @options.current = current

    # Show a different number of rows per page.
    resize: (n) ->
        # Which row are we looking at now?
        row = 1 + (@options.perPage * (@options.current - 1))

        # Change the number of pages.
        @options.perPage = n

        # Which page do we need to move to?
        @options.current = Math.ceil row / @options.perPage

    # Toggle the dropdown.
    dropdown: ->
        @el.find('.dropdown ul').toggleClass('show-dropdown')

module.exports = Paginator