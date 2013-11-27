{ mori } = require './modules/deps'

mediator = require './modules/mediator'
AppView  = require './views/app'
Database = require './models/database'

module.exports = (opts) ->
    throw 'Provide your own callback function' unless opts.cb

    # Plug-in our own formatter?
    require('./modules/formatter').primary = opts.formatter if opts.formatter

    # Init the database.
    db = new Database opts.data or []

    # Clicking on individual objects.
    mediator.on 'object:click', opts.portal or ( -> ), @
    # Save this list, continue.
    mediator.on 'app:save', ->
        # Convert our set into an Array.
        opts.cb null, mori.into_array db.selected
    , @

    new AppView { 'el': opts.target or 'body', db }