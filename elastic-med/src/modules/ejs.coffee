# Cache for useful things.
cache = new SimpleLRU 50

# Elastic helper.
module.exports = new can.Map

    # Needs to be initialized.
    client: null
    
    index: null
    
    type: null

    # Number of results to return.
    size: 10

    # Do the actual search based on query provided.
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

    # Suggest similar looking terms (used in auto-complete).
    suggest: (text, cb) ->
        return cb 'Client is not setup' unless @client

        # In cache?
        return cb(null, value) if value = cache.get(text)

        body = 'completion': { text, 'term': { 'field': 'title' } }

        @client.suggest({ @index, body }).then (res) ->
            # JSON?
            try
                body = JSON.parse res.body
            catch e
                return cb 'Malformed response'

            # Map to word-suggestions pairs.
            map = {}
            ( map[text] = options for { text, options } in body.completion )
            
            # Save to the cache.
            cache.set text, map

            return cb null, map

        # Trouble?
        , cb

    # Give us more documents like this one.
    more: (id, cb) ->
        return cb 'Client is not setup' unless @client

        @client.mlt({
            @index, @type, id,
            # Match on title.
            'mlt_fields': 'title'
            # How many terms have to match in order to consider the
            #  document a match.
            'percentTermsToMatch': 0.1
        }).then (res) ->
            # JSON?
            try
                body = JSON.parse res.body
            catch e
                return cb 'Malformed response'

            # Return remapped hits.
            cb null, _.map body.hits.hits, ({ _id, _score, _source }) ->
                _source.oid = _id ; _source.score = _score
                _source

        # Trouble?
        , cb