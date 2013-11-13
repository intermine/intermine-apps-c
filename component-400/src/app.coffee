mediator   = require './modules/mediator'
AppView    = require './views/app'
Collection = require './models/collection'

module.exports = (opts) ->
    throw 'Provide your own callback function' unless opts.cb

    # Plug-in our own formatter?
    require('./modules/formatter').primary = opts.formatter if opts.formatter

    # Parse the input data.
    collection = new Collection opts.data or []

    # Clicking on individual objects.
    mediator.on 'object:click', opts.portal or ( -> ), @
    # Save this list, continue.
    mediator.on 'app:save', ->
        # Convert our set into an Array.
        opts.cb null, mori.into_array collection.selected
    , @

    new AppView {
        'el': opts.target or 'body'
        collection
    }