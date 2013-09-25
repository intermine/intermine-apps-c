AppView    = require './views/app'
Collection = require './models/collection'

module.exports = (data, target, cb) ->
    # Specified callback?
    cb ?= -> throw 'Provide your own callback function'

    # Parse the input data.
    collection = new Collection data

    new AppView({ 'el': target, collection, cb })