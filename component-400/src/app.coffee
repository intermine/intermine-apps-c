extend = require 'extend'
map    = require 'map'
object = require 'object'
_ = extend {}, object,
    map: require 'map'
    extend: extend

# Functionalize templates (sync).
[ table, row ] = _.map [ './table', './row' ], (tml) ->
    fn = require tml
    (context, cb) ->
        try
            html = fn.call null, context or {}
        catch err
            return cb err.message
        cb null, html

BATCH_SIZE = 20   # how many rows to process in sync
RENDER_SIZE = 100 # how many rows to render in sync

# We are passed an object/collection and a target to render to.
module.exports = (collection, target) ->
    target = document.querySelector target
    # Render the wrapping table.
    table {}, (err, html) ->
        throw err if err
        target.innerHTML = html

        # Selected identifiers.
        selected = {}

        # Render all rows by default.
        tbody = target.querySelector 'tbody'

        # All the keys.
        keys = _.keys collection
        length = keys.length

        # Adjust ceilings.
        BATCH_SIZE = length if BATCH_SIZE > length
        RENDER_SIZE = length if RENDER_SIZE > length

        # Process items in a batch.
        rows = 0
        fragment = document.createDocumentFragment()
        process = (obj) ->
            row obj, (err, html) ->
                throw err if err
                # Add html fragment.
                tr = document.createElement 'tr'
                tr.innerHTML = html
                fragment.appendChild tr
                # Render?
                if rows % RENDER_SIZE is 0 or rows + 1 is length
                    tbody.appendChild fragment
                    fragment = document.createDocumentFragment()

        batch = ->
            i = BATCH_SIZE
            while i isnt 0 and rows isnt length
                process collection[keys[rows]]                
                rows += 1
                i -= 1

            # Call again.
            setTimeout batch, 0

        # Init the processing.
        batch.call null