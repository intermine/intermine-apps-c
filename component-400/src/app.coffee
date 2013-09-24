extend = require 'extend'
_ = extend {}, require('object'), # keys, values, length, isEmpty, merge
    extend:  extend
    map:     require 'map'
    each:    require 'foreach'
    reduce:  require 'reduce'
    flatten: require 'flatten'
$ = require 'jquery'

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

    # Render the duplicates?
    target.append((new DuplicatesView({ 'collection': d })).render().el) if d = collection.dupes

    # Summary overview.
    collection = [ { 'cid': 'c0' }, { 'cid': 'c1' }, { 'cid': 'c2' } ]
    target.append (new SummaryView({ 'collection': collection })).render().el