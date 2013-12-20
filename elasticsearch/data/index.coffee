fs    = require 'fs'
ejs   = require 'elasticsearch'

host  = 'localhost:9200'
index = 'publications'
type  = 'publication'
log   = 'trace'

client = new ejs.Client { host, log }

fs.readFile __dirname + '/cancer.json', 'utf-8', (err, string) ->
    docs = []
    try docs = JSON.parse(string)

    docs.forEach (body, id) ->
        client.index { index, type, id, body }, (err) ->
            throw err if err