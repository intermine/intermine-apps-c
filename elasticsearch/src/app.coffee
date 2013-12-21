# Will be the ejs client search handler.
search = can.compute(null)

# The default search query.
query = can.compute('')

# Observe query changes to trigger a service search.
query.bind 'change', (ev, q, oldQ) ->
    # Empty query?
    return unless q

    # Say we are doing the search.
    do state.initSearch

    # Is search setup?
    (do search)? q, (err, hits) ->
        # Trouble?
        return state.badRequest err if err

        # No results?
        return do state.noResults unless total = hits.total

        # Format the results.
        docs = _.map hits.hits, ({ _score, _source, highlight }) ->
            # Add the score.
            _source.score = _score
            # Map the highlights in.
            for key, value of _source when key in [ 'title', 'abstract' ]
                _source[key] = { value, 'highlights': highlight[key] or [] }
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

    # Default alert/notification.
    'alert':
        'show': no
        'type': 'default'

    # Start a search.
    initSearch: ->
        @.attr
            'alert':
                'show': yes
                'text': 'Searching &hellip;'
                'type': 'default'

        # Clear results.
        results.attr { 'total': 0 }

    badRequest: (text='Error') ->
    # Something bad.
        @.attr
            'alert': {
                'show': yes
                'type': 'warning'
                text
            }

        # Clear results.
        results.attr { 'total': 0 }        

    # We have no results.
    noResults: ->
        @.attr
            'alert':
                'show': yes
                'text': 'No results found'
                'type': 'default'

        # Clear results.
        results.attr { 'total': 0 }

    # We have results.
    hasResults: (total, docs) ->
        @.attr
            'alert':
                'show': yes
                'text': "Found #{total} results"
                'type': 'success'

        # Save them on results.
        results
        .attr('total', total)
        .attr('docs', docs)

# New global state instance.
state = new State
    'alert':
        'show': yes
        'text': 'Search ready'

# Notifications.
Notification = can.Component.extend

    tag: 'notification'

    template: require './templates/notification'

    events:
        'a.close click': ->
            state.attr { 'alert': 'show': no }

# Search form.
Search = can.Component.extend

    tag: 'search'

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

# A label.
Label = can.Component.extend

    tag: 'label'

    template: require './templates/label'

    scope:
        type: '@'
        text: '@'

# One result.
Result = can.Component.extend

    tag: 'result'

    template: require './templates/result'

    helpers:
        # For score.
        round: (score) ->
            Math.round 100 * do score

        type: (score) ->
            if do score > 0.5 then 'success' else 'secondary'

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
                range = snip.replace /<\/?em>/g, ''
                # ...replace the original with the snippet.
                field.value = field.value.replace range, snip
            # Return the new text.
            field.value

# Search results.
Results = can.Component.extend

    tag: 'results'

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
                'body':
                    'query':
                        'multi_match': {
                            query,
                            'fields': [
                                'title^2'
                                'abstract'
                            ]
                        }
                    'highlight':
                        'fields':
                            'title': {}
                            'abstract': {}
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
    query 'vaccine'