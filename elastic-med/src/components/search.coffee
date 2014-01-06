query = require '../modules/query'
ejs   = require '../modules/ejs'

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: -> { query }

    events:
        # Search button click does the search immediately:
        'a.button click': ->
            query.attr 'current', do @element.find('input').val
        
        # Tab autocomplete the suggestion.
        'input.text keydown': (el, evt) ->
            # Tab key?
            return unless (evt.keyCode or evt.which) is 9
            # Inject the new text.
            el.val query.attr('suggestion')
            # Prevent default event.
            do evt.preventDefault

        # Input field keypress.
        'input.text keyup': (el, evt) ->
            # Get the value and set autocomplete to it.
            query.attr 'suggestion', value = do el.val
            # Return on empty.
            return unless value.length
            # Update query on Enter keypress.
            return query.attr('current', value) if (evt.keyCode or evt.which) is 13
            
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
                query.attr 'suggestion', value[0...value.lastIndexOf(last)] + sugg

        # Clicking on breadcrumbs changes current (and suggested) query.
        '.breadcrumbs a click': (el) ->
            query.attr 'current', do el.text