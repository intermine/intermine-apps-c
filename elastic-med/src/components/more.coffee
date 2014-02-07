ejs = require '../modules/ejs'

# The actual suggestions list.
docs = new can.List [ ]

working = can.compute no

# More documents like this.
module.exports = can.Component.extend

    tag: 'app-more'

    template: require '../templates/more'

    scope: (obj, parent, element) ->
        working yes
        # Init empty.
        docs.replace [ ]
        # Init the search.
        ejs.more parent.attr('oid'), (err, list) ->
            working no
            # Ignore errors.
            return if err

            # Update the suggestions List.
            docs.replace list

        # Observe our suggestions.
        { docs }

    helpers:
        isWorking: (opts) ->
            if do working
                opts.fn(@)
            else
                opts.inverse(@)