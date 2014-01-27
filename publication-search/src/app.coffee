render  = require './modules/render'
query   = require './modules/query'
imjs    = require './modules/imjs'
state   = require './modules/state'

layout  = require './templates/layout'

components = [
    'alert'
    'search'
    'table'
]

module.exports = (opts) ->
    # Load the components.
    ( require "./components/#{name}" for name in components )

    # Setup the UI.
    $(opts.el).html render layout

    # Do we have mine set?
    return state.attr { 'type': 'warning', 'text': 'Mine is not set' } unless opts.mine

    # Setup the client.
    imjs.attr { 'client': new intermine.Service 'root': opts.mine }
    
    # Manually change the query to init the search?
    query(q) if q = opts.symbol