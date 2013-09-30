AppView    = require './views/app'
Collection = require './models/collection'

module.exports = (opts) ->
    # Formatter?
    require('./modules/formatter').primary = opts.formatter if opts.formatter

    # Parse the input data.
    collection = new Collection opts.data or []

    new AppView {
        'el': opts.target or 'body'
        'cb': opts.cb or -> throw 'Provide your own callback function'
        collection
    }