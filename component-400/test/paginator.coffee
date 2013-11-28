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

    'paginator - single page': (done) ->
        total   = 3
        current = 1

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 1, view.options.pages
        assert.deepEqual [ 1 ], view.options.range
        
        do done

    'paginator - three pages': (done) ->
        total   = 15
        current = 1

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 3, view.options.pages
        assert.deepEqual [ 1..3 ], view.options.range
        
        do done

    'paginator - five pages': (done) ->
        total   = 25
        current = 3

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 5, view.options.pages
        assert.deepEqual [ 1..5 ], view.options.range
        
        do done

    'paginator - ten pages': (done) ->
        total   = 50
        current = 4

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 10, view.options.pages
        assert.deepEqual [ 2..6 ].concat([ null, 10 ]), view.options.range
        
        do done

    'paginator - last page': (done) ->
        total   = 25
        current = 4

        view = new Paginator { total, perPage, current }
        do view.render

        assert.equal 5, view.options.pages
        assert.deepEqual [ 1..5 ], view.options.range
        
        do done