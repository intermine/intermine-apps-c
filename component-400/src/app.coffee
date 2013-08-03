extend = require 'extend'
_ = extend {}, require('object'),
    map: require 'map'
    extend: extend
    each: require 'foreach'
$ = require 'dom'

# Functionalize templates (sync).
[ table, row, header ] = _.map [ './table', './row', './header' ], (tml) ->
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
    target = $ target
    # Render the wrapping table.
    table {}, (err, html) ->
        throw err if err
        target.html html

        selected = {}

        # Do we have these reasons?
        stats =
            MATCH:
                total: 0
                selected: 0
            DUPLICATE:
                total: 0
                selected: 0
            OTHER:
                total: 0
                selected: 0
            TYPE_CONVERTED:
                total: 0
                selected: 0

        # A map from reason to provided input to row number to internal id.
        megaMap =
            MATCH: []
            DUPLICATE: []
            OTHER: []
            TYPE_CONVERTED: []

        # Render all rows by default.
        tbody = target.find 'tbody'

        # All the keys.
        keys = _.keys collection
        length = keys.length

        # Adjust ceilings.
        BATCH_SIZE = length if BATCH_SIZE > length
        RENDER_SIZE = length if RENDER_SIZE > length

        # Process items in a batch.
        rows = 0
        fragment = document.createDocumentFragment()
        process = (obj, key, i) ->
            # Get some stats on this.
            for symbol, reasons of obj.identifiers
                for reason in reasons
                    stats[reason].total += 1
                    # Add to the map.
                    megaMap[reason][i] = key

            # Render row.
            row obj, (err, html) ->
                throw err if err
                # Add html fragment.
                tr = document.createElement 'tr'
                tr.innerHTML = html
                fragment.appendChild tr
                # Render?
                if rows % RENDER_SIZE is 0 or rows + 1 is length
                    tbody.append fragment
                    fragment = document.createDocumentFragment()

        # Add/remove all matching this reason.
        setAll = (reason, set) ->
            _.each megaMap[reason], (id, n) ->
                return unless id
                # Efficient single add.
                selected[id] = yes
                # Check the row in DOM.
                tbody.find('tr').at(n).find('input[type="checkbox"]').attr('checked', if set then 'checked' else null)

        # When we are done...
        renderHeader = ->
            # Render the "add all" buttons.
            header reasons: stats, (err, html) ->
                throw err if err
                (sel = target.find('.header')).html html

                # Onclick events.
                sel.find('button').each (el) ->
                    el.on 'click', ->
                        # The reason.
                        reason = el.attr 'data-reason'
                        
                        # Adding/removing all?
                        if stats[reason].total isnt stats[reason].selected
                            stats[reason].selected = stats[reason].total
                            setAll reason, yes
                        else
                            stats[reason].selected = 0
                            setAll reason, no

                        # Re-render either way.
                        renderHeader.call null

        # Init the processing.
        do batch = ->
            i = BATCH_SIZE
            while i isnt 0 and rows isnt length
                process collection[key = keys[rows]], key, rows
                rows += 1
                i -= 1

            # Call again?
            if rows isnt length
                setTimeout batch, 0
            else
                renderHeader.call null