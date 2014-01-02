# Elastic helper.
module.exports = new can.Map

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

    # Find documents with a similar text.
    suggest: (text, cb) ->
        return cb 'Client is not setup' unless @client

        body = 'completion': { text, 'term': { 'field': 'title' } }

        @client.suggest({ @index, body }).then (res) ->
            # JSON?
            try
                body = JSON.parse res.body
            catch e
                return cb 'Malformed response'

            # Return results for just one word.
            for { text, options } in body.completion
                return cb null, options

        # Trouble?
        , cb