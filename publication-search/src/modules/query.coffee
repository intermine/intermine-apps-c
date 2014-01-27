pubs  = require './pubs'
imjs  = require './imjs'
state = require './state'

# The default search query.
query = can.compute ''

# Keep track of requests.
gid = 0

# Observe query changes to trigger a service search.
query.bind 'change', (ev, q) ->
    state.attr { 'type': 'info', 'text': 'Searching &hellip;' }
    id = ++gid

    imjs.search q, (err, res) ->
        # Too late?
        return if id < gid
        return state.attr { 'type': 'warning', 'Oops &hellip' } if err
        state.attr { 'type': 'success', 'text': "Found #{res.length} results" }
        pubs.replace res

module.exports = query