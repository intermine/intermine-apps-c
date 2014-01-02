query = require '../modules/query'
ejs   = require '../modules/ejs'

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: ->
        # A bit of an ugly syntax...
        'query': { 'value': query }

    events:
        # Button click:
        'a.button click': ->
            query do @element.find('input').val
        
        # Input field keypress.
        'input keyup': (el, evt) ->
            # Get the value.
            value = do el.val
            # Return on empty.
            return unless value.length
            # Update query on Enter keypress.
            return query value if (evt.keyCode or evt.which) is 13
            # On a space now?
            return if value[-1..].match /\s/
            # Otherwise try to autocomplete on the last word.
            ejs.suggest value.split(/\s+/).pop(), (err, suggestions) ->
                # Ignore errors.
                return if err
                # What do we have?
                console.log _.pluck suggestions, 'text'