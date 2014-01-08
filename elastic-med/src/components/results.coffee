results = require '../modules/results'

# A list of documents.
module.exports = can.Component.extend

    tag: 'app-results'

    template: require '../templates/results'

    # Watch docs or results.
    scope: (obj, parent, element) ->
        # Explicitely passed-in docs?
        if (docs = parent.attr('docs'))
            { docs }
        # Query results set.
        else
            results