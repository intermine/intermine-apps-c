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

        # Has results.
        state.hasResults(total, hits.hits)

# Keep our results here.
results = new can.Map

    # Total number of matched documents.
    'total': 0

    # The array with top (10) documents.
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
        results.attr { total, docs }

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

# Search results.
Results = can.Component.extend

    tag: 'results'

    template: require './templates/results'

    scope:
        # Onclick row find us similar documents.
        more: (doc, source, evt) ->

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
                        'match':
                            '_all': query
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