ejs   = require './ejs'
state = require './state'

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

module.exports = query