# Will be the ejs request handler.
req = can.compute(null)

# The default search query.
query = can.compute('')

# Observe query changes to trigger a service search.
query.bind 'change', (ev, q, oldQ) ->
    # Empty query?
    return unless q

    # Say we are doing the search.
    do state.initSearch

    # Empty search string?
    req()?.query(ejs.QueryStringQuery(q))
    # On results...
    .doSearch (res) ->
        # No results?
        return do state.noResults unless total = res.hits.total

        # Plop the actual document from the results.
        docs = _.map(res.hits.hits, '_source')

        # Has results.
        state.hasResults(total, docs)
    # Trouble?
    , (obj, type, text) ->
        state.badRequest text

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

# Search results.
Results = can.Component.extend

    tag: 'results'

    template: require './templates/results'

    scope:
        # Onclick row find us similar documents.
        more: (doc, source, evt) ->
            # Get the column key.
            key = $(evt.target).data('key')
            # Now the value.
            value = doc.attr(key)
            console.log key, value

# The app herself.
App = can.Component.extend
    
    tag: 'app'

    scope: -> { state, results }

module.exports = (opts) ->
    # Setup ejs client. We already have it setup on a page
    # from when we were storing documents with the service
    # but let us assume it is not necessarily so.
    ejs.client = ejs.jQueryClient(opts.service)

    # Set the request handlet to our index search for a people.
    req ejs.Request({ 'indices': opts.index, 'types': opts.type })

    # Setup the UI.
    layout = require './templates/layout'
    $(opts.el).html can.view.mustache layout

    # Manually change the query to init the search.
    query 'new* OR age:>35'