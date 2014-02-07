{ mori } = require './modules/deps'

mediator = require './modules/mediator'
options  = require './modules/options'

AppView  = require './views/app'
Database = require './models/database'

module.exports = (opts) ->
    throw 'Provide your own callback function' unless opts.cb

    # Add user options.
    options.set opts.options

    # Plug-in our own formatter?
    require('./modules/formatter').primary = opts.formatter if opts.formatter

    # Init the database.
    db = new Database opts.data or []

    # Clicking on individual objects.
    mediator.on 'object:click', opts.portal or ( -> ), @
    # Save this list, continue.
    mediator.on 'app:save', ->
        # Convert our set into an Array.
        opts.cb mori.into_array db.selected
    , @

    # Which element?
    el = opts.el or opts.target or 'body'

    new AppView { el, db }

    # Call me to return the currently selected items.
    -> mori.into_array db.selected