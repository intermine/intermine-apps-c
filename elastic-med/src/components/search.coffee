query = require '../modules/query'
ejs   = require '../modules/ejs'

# Last word autocomplete suggestion.
suggestion = can.compute do query

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: ->
        # A bit of an ugly syntax...
        'query':      { 'value': query }
        'suggestion': { 'value': suggestion }

    events:
        # Button click:
        'a.button click': ->
            query do @element.find('input').val
        
        # Tab autocomplete.
        'input.text keydown': (el, evt) ->
            # Tab key?
            return unless (evt.keyCode or evt.which) is 9
            # Inject the new text.
            el.val do suggestion
            # Prevent default event.
            do evt.preventDefault

        # Input field keypress.
        'input.text keyup': (el, evt) ->
            # Get the value and set autocomplete to it.
            suggestion value = do el.val
            # Return on empty.
            return unless value.length
            # Update query on Enter keypress.
            return query value if (evt.keyCode or evt.which) is 13
            
            # On a space now?
            return if value[-1..].match /\s/
            # Otherwise try to autocomplete on the last word.
            ejs.suggest (last = value.split(/\s+/).pop()), (err, suggs) ->
                # Ignore errors.
                return if err
                # Maybe only stopword?
                return unless suggs[last]
                # Take the first suggestion starting as our word
                return unless sugg = do ->
                    for { text } in suggs[last]
                        return text unless text.indexOf last

                # Autocomplete our query.
                suggestion value[0...value.lastIndexOf(last)] + sugg