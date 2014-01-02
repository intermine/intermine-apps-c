fs    = require 'fs'
ejs   = require 'elasticsearch'
async = require 'async'
_     = require 'lodash'

host  = 'localhost:9200'
index = 'publications'
type  = 'publication'
log   = 'trace'

client = new ejs.Client { host, log }

# Register new mappings.
async.waterfall [ (cb) ->
    string = { 'type': 'string' }

    body = {}
    body[type] =
        # The default properties coming from JSON. Not "really" required.
        'properties':
            'id':
                'type': 'object'
                'properties':
                    'doi': string
                    'pii': string
                    'pubmed': string
            'journal': string
            'issue':
                'type': 'object'
                'properties':
                    'volume': string
                    'issue': string
                    'published':
                        'type': 'object'
                        'properties':
                            'year': string
                            'month': string
                            'day': string
            'title': string
            'abstract': string
            'authors':
                'properties':
                    'lastname': string
                    'forename': string
                    'initials': string
                    'affiliation': string
            'keywords': string
    
    client.indices.putMapping {
        index, type, body
    }, (err, res, status) ->
        cb err

# Load the JSON documents.
, (cb) ->
    fs.readFile __dirname + '/cancer.json', 'utf-8', (err, string) ->
        docs = []
        try docs = JSON.parse(string)
        cb null, docs

# Index them.
, (docs, cb) ->
    # Index each document in series.
    id = 0
    async.eachSeries docs, (body, cb) ->
        client.index {
            index, type, body, 'id': id++
        }, cb
    , cb

], (err) ->
    throw err if err