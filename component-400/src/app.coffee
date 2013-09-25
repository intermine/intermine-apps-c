$ = require 'jquery'
_ = require 'object' # keys, values, length, isEmpty, merge

mediator       = require './modules/mediator'
HeaderView     = require './views/header'
DuplicatesView = require './views/duplicates'
NoMatchesView  = require './views/nomatches'
SummaryView    = require './views/summary'
Collection     = require './models/collection'

module.exports = (data, target, cb) ->
    # Specified callback?
    cb ?= -> throw 'Provide your own callback function'

    # Parse the input data.
    collection = new Collection data

    # DOMify.
    target = $(target).addClass('foundation')

    # Render the header.
    target.append (new HeaderView({ collection })).render().el

    { dupes, summary, dict, selected } = collection

    # Global save, call back.
    mediator.on 'save', ->
        cb null, _.keys selected
    @

    # Render the duplicates?
    target.append((new DuplicatesView({
        'collection': dupes
    })).render().el) if dupes

    # Summary overview?
    target.append((new SummaryView({
        'collection': summary
        dict
    })).render().el) if summary