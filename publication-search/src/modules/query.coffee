pubs = require './pubs'
imjs = require './imjs'

# The default search query.
query = can.compute ''

# Observe query changes to trigger a service search.
query.bind 'change', (ev, q) ->
    imjs.search 'brca', (err, res) ->
        return if err

module.exports = query