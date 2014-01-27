render  = require './modules/render'
query   = require './modules/query'
imjs    = require './modules/imjs'

layout  = require './templates/layout'

components = [
    'alert'
    'search'
    'table'
]

module.exports = (opts) ->
    # Load the components.
    ( require "./components/#{name}" for name in components )

    # Setup the client.
    imjs.attr { 'client': new intermine.Service 'root': opts.mine }

    # Setup the UI.
    $(opts.el).html render layout

    # Manually change the query to init the search?
    query(q) if q = opts.symbol