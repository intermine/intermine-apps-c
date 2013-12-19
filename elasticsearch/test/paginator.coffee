#!/usr/bin/env coffee
assert = require 'assert'
proxy  = do require('proxyquire').noCallThru
path   = require 'path'
_      = require 'lodash'

class View

    options: {}

    el: 'html': ->

    constructor: (opts) ->
        ( @options[k] = v for k, v of opts )

Paginator = proxy '../src/views/paginator',
    '../modules/deps': { '$': null, _ }
    '../modules/mediator':
        'trigger': ->
    '../modules/view': View
    '../templates/paginator': -> ''

perPage = 5

module.exports =

    'paginator - 1 page': (done) ->
        total   = 3
        current = 1

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 1, view.options.pages
        assert.deepEqual [], view.options.range
        
        do done

    'paginator - 3 pages': (done) ->
        total   = 15
        current = 2

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 3, view.options.pages
        assert.deepEqual [ 1..3 ], view.options.range
        
        do done

    'paginator - 5 pages on 2': (done) ->
        total   = 25
        current = 2

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 5, view.options.pages
        assert.deepEqual [ 1..5 ], view.options.range
        
        do done

    'paginator - 5 pages on 5': (done) ->
        total   = 25
        current = 5

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 5, view.options.pages
        assert.deepEqual [ 1..5 ], view.options.range
        
        do done

    'paginator - 8 pages on 4': (done) ->
        total   = 40
        current = 4

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 8, view.options.pages
        assert.deepEqual [ 1..8 ], view.options.range
        
        do done

    'paginator - 10 pages on 5': (done) ->
        total   = 50
        current = 5

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 10, view.options.pages
        assert.deepEqual [ 1, 2, 3, 4, 5, 6, 7, null, 10 ], view.options.range
        
        do done

    'paginator - 10 pages on 8': (done) ->
        total   = 50
        current = 8

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 10, view.options.pages
        assert.deepEqual [ 1, null, 6, 7, 8, 9, 10 ], view.options.range
        
        do done

    'paginator - 20 pages on 10': (done) ->
        total   = 100
        current = 10

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 20, view.options.pages
        assert.deepEqual [ 1, null, 8, 9, 10, 11, 12, null, 20 ], view.options.range
        
        do done