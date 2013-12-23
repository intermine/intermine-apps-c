# ColorBrewer color scales.
colors = colorbrewer.YlOrRd[9]
# The "allowed" ranges for scores.
min = 0.2 ; max = 2.5
# Convert input domain to an output color range.
colorize = do ->
    # Colorizing function.
    fn = d3.scale.linear()
    .domain(d3.range(min, max, (max - min) / (colors.length - 1)))
    .range(colors)
    # Return memoized function that trims score and then returns a color.
    _.memoize (score) ->
        fn Math.max min, Math.min max, score

# Will be the ejs client search handler.
search = can.compute(null)

# The default search query.
query = can.compute('')

# Number of documents to return.
size = 10

# Observe query changes to trigger a service search.
query.bind 'change', (ev, q) ->
    # Empty query?
    return unless q

    # Say we are doing the search.
    do state.initSearch

    # Is search setup?
    (do search)? q, (err, hits) ->
        # Trouble?
        return do state.badRequest if err

        # No results?
        return do state.noResults unless total = hits.total

        # Format the results.
        docs = _.map hits.hits, ({ _score, _id, _source, highlight }) ->
            # Add the score and object id.
            _source.score = _score ; _source.oid = _id
            # Map the highlights in.
            for key, value of _source when key in [ 'title', 'abstract' ]
                _source[key] = { value, 'highlights': highlight?[key] or [] }
            _source

        # Has results.
        state.hasResults(total, docs)

# Keep our results here.
results = new can.Map

    # Total number of matched documents.
    'total': 0

    # The array with top (max 10) documents.
    'docs': []

# State of the application.
State = can.Map.extend

    # Start a search.
    initSearch: ->
        state.attr('text', 'Searching &hellip;')
        # Clear results.
        results.attr('total', 0)

    # We have results.
    hasResults: (total, docs) ->
        if total > size
            state.attr('text', "Top results out of #{total} matches")
        else
            if total is 1
                state.attr('text', '1 Result')
            else
                state.attr('text', "#{total} Results")

        # Save them on results.
        results
        .attr('total', total)
        .attr('docs', docs)
    
    # We have no results.
    noResults: ->
        state.attr('text', 'No results found')
        # Clear results.
        results.attr('total', 0)
    
    # Something bad.
    badRequest: (text='Error') ->
        state.attr('text', text)
        # Clear results.
        results.attr('total', 0)

# New global state instance.
state = new State
    'text': 'Search ready'

# Search form.
Search = can.Component.extend

    tag: 'app-search'

    template: require './templates/search'

    scope: ->
        # A bit of an ugly syntax...
        'query': { 'value': query }

    events:
        # Button click:
        'a.button click': ->
            query do @element.find('input').val
        # Input field keypress.
        'input keyup': (el, evt) ->
            query do el.val if (evt.keyCode or evt.which) is 13

# A score label.
Label = can.Component.extend

    tag: 'app-label'

    template: require './templates/label'

    helpers:
        # Calculate the background color for a score.
        bg: (score) ->
            colorize do score

        # Calculate the foreground CSS class for a score.
        fg: (score) ->
            # The background.
            bg = colorize do score
            # Base foreground on the lightness of the background.
            { l } = d3.hsl(bg)
            if l < 0.5 then 'light' else 'dark'

        # Provide a "nice" score value.
        round: (score) ->
            Math.round 100 * do score

# One result.
Result = can.Component.extend

    tag: 'app-result'

    template: require './templates/result'

    helpers:
        # Published ago & format date.
        ago: (published) ->
            { year, month, day } = do published
            do moment([ year, month, day ].join(' ')).fromNow

        date: (published) ->
            { day, month, year } = do published
            [ day, month, year ].join(' ')

        # Is publication out yet?
        isPublished: (published, opts) ->
            { day, month, year } = do published
            stamp = +moment([ day, month, year ].join(' '))
            return opts.inverse(@) if (stamp or Infinity) > +new Date
            # Continue.
            opts.fn(@)

        # Author name.
        author: (ctx) ->
            # Collective name.
            return collective if collective = ctx.collectivename
            # Person name.
            ctx.forename + ' ' + ctx.lastname

        # Merge text and highlighted terms together.
        highlight: (field) ->
            # Get the values.
            field = do field
            # Skip if we have nothing to highlight.
            return field.value unless field.highlights.length
            # For each snippet...
            for snip in field.highlights
                # Strip the tags from the snippet.
                text = snip.replace /<\/?em>/g, ''
                # ...replace the original with the snippet.
                field.value = field.value.replace text, snip
            # Return the new text.
            field.value

        # Format a hint trimming it.
        hint: (text, length) ->
            return text if (text = (do text)) < length
            for word, i in (words = text.split(' '))
                length -= word.length
                return words[0..i].join(' ') + ' ...' unless length > 0

        # Link to document detail.
        link: (oid) ->
            can.route.url 'oid': do oid

# Search results.
Results = can.Component.extend

    tag: 'app-results'

    template: require './templates/results'

    scope: -> { state, results }

# The app herself.
App = can.Component.extend
    
    tag: 'app'

# Router switching between pages.
Routing = can.Control

    # Index.
    route: ->
        template = require './templates/page-index'
        @element.html can.view.mustache template

    # TODO: Document detail.
    'doc/:oid route': ({ oid }) ->
        template = require './templates/page-doc'
        @element.html can.view.mustache template

module.exports = (opts) ->
    search do ->
        { service, index, type } = opts
        # Create a new client.
        client = new $.es.Client 'hosts': service
        # Return a function doing the actual search.
        (query, cb) ->            
            client.search({
                index, type,
                'body': {
                    size,
                    'query':
                        'multi_match': {
                            query,
                            'fields': [
                                'title^2'
                                'keywords^2'
                                'abstract'
                            ]
                        }
                    'highlight':
                        'fields':
                            'title': {}
                            'abstract': {}
                }
            
            }).then (res) ->
                # JSON?
                try
                    body = JSON.parse res.body
                catch e
                    return cb 'Malformed response'

                # Just the hits ma'am.
                cb null, body.hits
            
            # Trouble?
            ,  cb

    # Setup the UI.
    layout = require './templates/layout'
    (el = $(opts.el)).html can.view.mustache layout

    # Can route.
    new Routing(el.find('.page-content'))
    do can.route.ready

    # Have we launched on the index?
    if can.route.current('')
        # Manually change the query to init the search.
        query opts.query or '' # '' is the default...