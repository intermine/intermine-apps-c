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

# We are passed an object/collection and a target to render to.
module.exports = (collection, target, cb) ->
    # Specified callback?
    cb ?= -> throw 'Provide your own callback function'

    # DOMify.
    target = $(target).addClass('foundation')

    # Render the header.
    target.append (new HeaderView()).render().el

    # Render the duplicates?
    collection = [ {}, {} ]
    target.append (new DuplicatesView({ 'collection': collection })).render().el

    # Render the no matches?
    collection = [ {}, {} ]
    target.append (new NoMatchesView({ 'collection': collection })).render().el

    # Summary overview.
    collection = [ { 'cid': 'c0' }, { 'cid': 'c1' }, { 'cid': 'c2' } ]
    target.append (new SummaryView({ 'collection': collection })).render().el