mediator = require '../modules/mediator'

class Collection

    # Translations.
    dict:
        'MATCH': 'direct hit'
        'TYPE_CONVERTED': 'converted type'
        'OTHER': 'synonym'

    constructor: (data) ->
        # Number of input identifiers provided.
        @input = {}
        # Number of identifiers we have found.
        @total = 0
        # Reason to a list of objects.
        @summary = {}
        # Provided identifier to a list of objects.
        @dupes = {}
        # A set of selected object identifiers.
        @selected = {}
        # Type.
        @type = null

        for id, object of data
            @total += 1
            for provided, reasons of object.identifiers
                @input[provided] = null
                for reason in reasons
                    @type ?= object.type.toLowerCase()
                    switch reason
                        when 'DUPLICATE'
                            @addDupe { provided, id, object }
                        else
                            @addSummary { reason, provided, id, object }

        # Convert object to length.
        @input = _.keys(@input).length

        # Listen to peeps being selected.
        mediator.on 'item:toggle', (selected, id) ->
            if selected then @selected[id] = yes else delete @selected[id]
        , @

    addDupe: ({ provided, id, object }) ->
        @dupes[provided] ?= []
        @dupes[provided].push { id, object }

    addSummary: ({ reason, provided, id, object }) ->
        # Group by reason.
        @summary[reason] ?= []
        @summary[reason].push { provided, id, object }
        # Add to selected.
        @selected[id] = yes

    # Get the size of selected objects.
    selectedLn: -> _.keys(@selected).length

module.exports = Collection