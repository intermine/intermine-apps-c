# ColorBrewer color scales.
colors = colorbrewer.YlOrRd[9]
# The "allowed" ranges for scores.
min = 0.2 ; max = 2.5
# Convert input domain to an output color range.
colorize = d3.scale.linear()
.domain(d3.range(min, max, (max - min) / (colors.length - 1)))
.range(colors)

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
        docs = _.map hits.hits, ({ _score, _source, highlight }) ->
            # Add the score.
            _source.score = _score
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
        # Calculate a color for a score.
        color: (score) ->
            # The background.
            bg = colorize Math.max min, Math.min max, do score
            # Base foreground on the lightness of the background.
            { l } = d3.hsl(bg)
            fg = if l < 0.5 then '#FFF' else '#222'
            # Return the "style" string.
            "background-color:#{bg};color:#{fg}"

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

# Search results.
Results = can.Component.extend

    tag: 'app-results'

    template: require './templates/results'

# The app herself.
App = can.Component.extend
    
    tag: 'app'

    scope: -> { state, results }

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
                # 2xx?
                return cb 'Error' unless /2../.test res.status.status
                # JSON?
                try
                    body = JSON.parse res.body
                catch e
                    return cb 'Malformed response'

                # Just the hits ma'am.
                cb null, body.hits

    # Setup the UI.
    layout = require './templates/layout'
    $(opts.el).html can.view.mustache layout

    # Manually change the query to init the search.
    query opts.query or '' # '' is the default...