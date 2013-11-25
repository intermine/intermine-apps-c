#!/usr/bin/env coffee
assert = require 'assert'

slicer = require '../src/modules/slicer'

unit = (collection, aRng, bRng) ->
    result = []    

    slicer collection, aRng, bRng, (item, a, b) ->
        result = result.concat item.matches[a..b]

    result

module.exports =

    'slicer - 0 to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 0, 4), [ 1..5 ]
        do done

    'slicer - 0 to a slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 0, 3), [ 1..4 ]
        do done

    'slicer - 0 to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 0, 6), [ 1..7 ]
        do done

    'slicer - 0 to all to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 0, 8), [ 1..9 ]
        do done

    'slicer - 0 to all to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5   ], 'range': [ 0, 4  ], 'length': 5 }
            { 'matches': [ 6..9   ], 'range': [ 5, 8  ], 'length': 4 }
            { 'matches': [ 10..14 ], 'range': [ 9, 13 ], 'length': 5 }
        ], 0, 11), [ 1..12 ]
        do done

    'slicer - 0 to all to all to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5   ], 'range': [ 0, 4  ], 'length': 5 }
            { 'matches': [ 6..9   ], 'range': [ 5, 8  ], 'length': 4 }
            { 'matches': [ 10..14 ], 'range': [ 9, 13 ], 'length': 5 }
        ], 0, 13), [ 1..14 ]
        do done

    'slicer - slice to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 2, 4), [ 3..5 ]
        do done

    'slicer - slice to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 2, 3), [ 3..4 ]
        do done

    'slicer - slice to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 2, 6), [ 3..7 ]
        do done

    'slicer - slice to all to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5   ], 'range': [ 0, 4  ], 'length': 5 }
            { 'matches': [ 6..9   ], 'range': [ 5, 8  ], 'length': 4 }
            { 'matches': [ 10..14 ], 'range': [ 9, 13 ], 'length': 5 }
        ], 2, 11), [ 3..12 ]
        do done

    'slicer - none to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 7, 7), [ 8 ]
        do done

    'slicer - none to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..5 ], 'range': [ 0, 4 ], 'length': 5 }
            { 'matches': [ 6..9 ], 'range': [ 5, 8 ], 'length': 4 }
        ], 7, 8), [ 8..9 ]
        do done

    'slicer - buggyna': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1..2 ], 'range': [ 0, 1 ], 'length': 2 }
            { 'matches': [ 3..4 ], 'range': [ 2, 3 ], 'length': 2 }
            { 'matches': [ 5..6 ], 'range': [ 4, 5 ], 'length': 2 }
            { 'matches': [ 7..9 ], 'range': [ 6, 8 ], 'length': 3 }
        ], 0, 2), [ 1..3 ]
        do done