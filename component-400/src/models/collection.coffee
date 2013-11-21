{ _, mori } = require '../modules/deps'

mediator = require '../modules/mediator'

class Collection

    # A type for header display. In lowercase.
    type: 'gene'

    constructor: (@data) ->
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
        mediator.on 'item:toggle', (selected, id) ->
            # Add.
            return @selected = mori.conj(@selected, id) if selected
            # Remove.
            @selected = mori.disj(@selected, id)
        , @

module.exports = Collection