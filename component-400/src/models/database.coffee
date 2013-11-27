{ _, mori } = require '../modules/deps'

mediator = require '../modules/mediator'

# Has all the backend data.
class Database

    constructor: (@data) ->
        @type = @data.type

        # Quick access to duplicates.
        @duplicates = @data.matches.DUPLICATE or []

        # All the matches for a summary.
        @matches = ( for reason in [ 'MATCH', 'TYPE_CONVERTED', 'OTHER' ]
            continue unless (collection = @data.matches[reason])? and collection.length
            name = dict[reason] @type
            { name, collection, reason }
        )

        # Add unresolved?
        if (collection = @data.unresolved).length
            @matches.push { 'reason': 'UNRESOLVED', collection }

        # A set of selected object identifiers.
        @selected = do mori.set

        # Everything but duplicates (or unresolved) get added into the selected set.
        extract = (obj) =>
            switch
                # Iterate over Arrays.
                when _.isArray(obj)
                    ( extract(item) for item in obj )
                # Get the id from an Object, or iterate over it.
                when _.isObject(obj)
                    return @selected = mori.conj(@selected, obj.id) if _.has(obj, 'id')
                    ( extract(value) for own key, value of obj )
        
        ( extract(value) for own key, value of @data.matches when key isnt 'DUPLICATE' )

        # Listen to peeps being selected.
        # Pass `selected` bool if an item is to be selected
        mediator.on 'item:toggle', (selected, id) ->
            # Remove or add?
            method = [ 'disj', 'conj' ][+selected]
            @selected = mori[method] @selected, id
        , @

# Translations.
dict =
    'MATCH':                 -> 'direct hit'
    'TYPE_CONVERTED': (type) -> "non-#{type} identifier"
    'OTHER':                 -> 'synonym'
    'WILDCARD':              -> 'wildcard'

module.exports = Database