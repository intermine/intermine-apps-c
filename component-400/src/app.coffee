extend = require 'extend'
_ = extend {}, require('object'),
    map: require 'map'
    extend: extend
    each: require 'foreach'
$ = require 'dom'

# A dictionary of English terms for computer speak.
dict =
    MATCH: [ 'match', 'matches' ]
    DUPLICATE: [ 'duplicate', 'duplicates' ]
    OTHER: [ 'other thing', 'other things' ]
    TYPE_CONVERTED: [ 'converted type', 'converted types' ]

# Functionalize templates (sync).
[ table, row, header ] = _.map [ 'table', 'row', 'header' ], (tml) ->
    fn = require "./templates/#{tml}"
    (context={}, cb) ->
        # Always have the dict available.
        context.dict = dict
        # Try it.
        try
            html = fn context
        catch err
            return cb err.message
        cb null, html

BATCH_SIZE = 20   # how many rows to process in sync
RENDER_SIZE = 100 # how many rows to render in sync

# We are passed an object/collection and a target to render to.
module.exports = (collection, target, cb) ->
    # Specified callback?
    cb ?= -> throw 'Provide your own callback function'

    # DOMify.
    target = $(target).addClass('foundation')

    # Render the wrapping table.
    table {}, (err, html) ->
        return cb(err) if err
        
        # An object of selected internal IDs.
        selected = {}

        # Insert into DOM.
        target.html html

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
        process = (obj, id, i) ->
            ourReasons = {}
            
            # Get some stats on this.
            for symbol, reasons of obj.identifiers
                for reason in reasons
                    stats[reason].total += 1
                    # Add to the map.
                    megaMap[reason][i] = id
                    # Add to quick-access reasons of ours.
                    ourReasons[reason] = yes

            # Arrayize our reasons.
            ourReasons = ( k for k, v of ourReasons )

            # Render row.
            row obj, (err, html) ->
                return cb(err) if err
                
                # Add html fragment.
                tr = document.createElement 'tr'
                tr.innerHTML = html
                fragment.appendChild tr
                
                # Single row click event.
                (tr = $(tr)).on 'click', ->
                    # Invert the status in the selected map object.
                    unless selected[id]
                        selected[id] = yes
                        # Adjust the selected count(s) in stats object.
                        ( stats[r].selected += 1 for r in ourReasons )
                        # Change the class too...
                        tr.addClass('selected')
                    else
                        delete selected[id]
                        # Adjust the selected count(s) in stats object.
                        ( stats[r].selected -= 1 for r in ourReasons )
                        # Change the class too...
                        tr.removeClass('selected')
                    
                    # Re-render the stats object, it may have changed.
                    do renderHeader
                
                # Render?
                if rows % RENDER_SIZE is 0 or rows + 1 is length
                    tbody.append fragment
                    fragment = document.createDocumentFragment()

        # Add/remove all matching this reason.
        setAll = (reason, set) ->
            _.each megaMap[reason], (id, n) ->
                return unless id
                # Find the row.
                tr = tbody.find('tr').at(n)
                # Efficient add/remove (compared to an array).
                if set
                    selected[id] = yes
                    # Select the row in DOM.
                    tr.addClass('selected')
                else
                    delete selected[id]
                    # Unselect the row in DOM.
                    tr.removeClass('selected')

        # When we are done...
        renderHeader = ->
            # Render the "add all" buttons.
            header reasons: stats, (err, html) ->
                return cb(err) if err
                (sel = target.find('.header')).html html

                # Call back with ids event (the master event).
                target.find('.done').on 'click', ->
                    cb null, ( k for k, v of selected )

                # Onclick button events.
                sel.find('a.button').each (el) ->
                    el.on 'click', ->
                        # The reason.
                        reason = el.attr 'data-reason'
                        # The action.
                        action = el.attr 'data-action'
                        
                        # Adding/removing all?
                        switch action
                            when 'add'
                                stats[reason].selected = stats[reason].total
                                setAll reason, yes
                            when 'remove'
                                stats[reason].selected = 0
                                setAll reason, no
                            else
                                # Oopsy daisy...

                        # Re-render either way.
                        do renderHeader

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
                do renderHeader