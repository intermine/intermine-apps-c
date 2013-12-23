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

# Elastic helper.
ejs = new can.Map

    # Needs to be initialized.
    client: null
    
    index: null
    
    type: null

    # Number of results to return.
    size: 10

    # Return a function doing the actual search.
    search: (query, cb) ->
        return cb 'Client is not setup' unless @client

        @client.search({
            @index, @type,
            'body': {
                @size,
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

            docs = _.map body.hits.hits, ({ _score, _id, _source, highlight }) ->
                # Add the score and object id.
                _source.score = _score ; _source.oid = _id
                # Map the highlights in.
                for key, value of _source when key in [ 'title', 'abstract' ]
                    _source[key] = { value, 'highlights': highlight?[key] or [] }
                _source

            # Return just the total count & the docs.
            cb null, { docs, 'total': body.hits.total }
        
        # Trouble?
        ,  cb

    # Get a JSON document from index based on its id.
    get: (id, cb) ->
        return cb 'Client is not setup' unless @client

        @client.get({ @index, @type, id }).then (res) ->
            # JSON?
            try
                body = JSON.parse res.body
            catch e
                return cb 'Malformed response'

            # Just the document source as a Map.
            cb null, new can.Map _.extend body._source, { 'oid': body._id }
        
        # Trouble?
        ,  cb

# The default search query.
query = can.compute('')

# Observe query changes to trigger a service search.
query.bind 'change', (ev, q) ->
    # Empty query?
    return unless q

    # Say we are doing the search.
    do state.loading

    # Use the client to do the search.
    ejs.search q, (err, { total, docs }) ->
        # Trouble?
        return state.error err if err

        # No results?
        return do state.noResults unless total

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

    # Loading.
    loading: ->
        state.attr('text', 'Loading results &hellip;')
        # Clear results.
        results.attr('total', 0)

    # We have results.
    hasResults: (total, docs) ->
        if total > ejs.attr('size')
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
    error: (err) ->
        text = 'Error'
        switch
            when _.isString err
                text = err
            when _.isObject err and err.message
                text = err.message

        state.attr('text', text)
        # Clear results.
        results.attr('total', 0)

# New global state instance.
state = new State 'text': 'Search ready'

# A helper to generate a link to an index or a document detail page.
link = (oid) ->
    # Index.
    return '#!' unless oid
    # Document.
    can.route.url 'oid': do oid

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

# One document.
Document = can.Component.extend

    tag: 'app-document'

    template: require './templates/document'

    # http://canjs.com/docs/can.Component.prototype.scope.html#section_Valuespassedfromattributes
    scope:
        # Show abstract in the document?
        showAbstract: '@'
        # TODO: Show keywords?
        showKeywords: no

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

        # Merge text and highlighted terms together. Works in the results
        #  and also on the document detail page.
        highlight: (field) ->
            # Get the values.
            field = do field

            # Will this field have a highlight?
            return field unless _.isObject field

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

        link: link

# Page title/status.
Title = can.Component.extend

    tag: 'app-title'

    template: require './templates/title'

    scope: -> state

# Search results.
Results = can.Component.extend

    tag: 'app-results'

    template: require './templates/results'

    scope: -> results

# The app herself.
App = can.Component.extend
    
    tag: 'app'

    helpers: { link }

# Router switching between pages.
Routing = can.Control

    # Index.
    route: ->
        template = require './templates/page-index'
        @element.html can.view.mustache template

    # Document detail.
    'doc/:oid route': ({ oid }) ->
        template = require './templates/page-doc'

        # Find the document.
        doc = null
        # Is it in results?
        if (docs = results.attr('docs')).length
            docs.each (obj) ->
                # Found already?
                return if doc
                # Match on oid.
                doc = obj if obj.attr('oid') is oid

        # Found in results cache.
        return @element.html can.view.mustache(template) doc if doc

        # Say we are doing the search.
        do state.loading
        
        # Get the document from the index.
        ejs.get oid, (err, doc) =>
            # Trouble? Not found etc.
            return state.error err if err

            @element.html can.view.mustache(template) doc

module.exports = (opts) ->
    { service, index, type } = opts
    # Init the client.
    ejs.attr { index, type, 'client': new $.es.Client 'hosts': service }

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