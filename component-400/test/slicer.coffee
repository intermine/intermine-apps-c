#!/usr/bin/env coffee
assert = require 'assert'

slicer = require '../src/modules/slicer'

unit = (collection, aRng, bRng) ->
    result = []    

    slicer collection, aRng, bRng, (item, a, b) ->
        result = result.concat item.matches[a...b]

    result

module.exports =

    'slicer - 0 to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 0, 5), [ 1...6 ]
        do done

    'slicer - 0 to a slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 0, 3), [ 1...4 ]
        do done

    'slicer - 0 to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 0, 7), [ 1...8 ]
        do done

    'slicer - 0 to all to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 0, 9), [ 1...10 ]
        do done

    'slicer - 0 to all to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
            { 'matches': [ 10...15 ], 'range': [ 9, 14 ], 'length': 5 }
        ], 0, 12), [ 1...13 ]
        do done

    'slicer - 0 to all to all to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
            { 'matches': [ 10...15 ], 'range': [ 9, 14 ], 'length': 5 }
        ], 0, 14), [ 1...15 ]
        do done

    'slicer - slice to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 2, 5), [ 3...6 ]
        do done

    'slicer - slice to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 2, 4), [ 3...5 ]
        do done

    'slicer - slice to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 2, 7), [ 3...8 ]
        do done

    'slicer - slice to all to all to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
            { 'matches': [ 10...15 ], 'range': [ 9, 14 ], 'length': 5 }
        ], 2, 12), [ 3...13 ]
        do done

    'slicer - none to slice': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 7, 8), [ 8...9 ]
        do done

    'slicer - none to all': (done) ->
        assert.deepEqual unit([
            { 'matches': [ 1...6 ],  'range': [ 0, 5 ], 'length': 5 }
            { 'matches': [ 6...10 ], 'range': [ 5, 9 ], 'length': 4 }
        ], 7, 9), [ 8...10 ]
        do done