query = require '../modules/query'
ejs   = require '../modules/ejs'

suggestions = new can.Map

    # Position in px from left.
    'px': 0

    # List of suggestions.
    'list': []

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: -> { query, suggestions }

    events:
        # Search button click does the search immediately:
        'a.button click': ->
            query.attr 'current', do @element.find('input').val
        
        # TODO: Tab autocomplete the suggestion.
        'input.text keydown': (el, evt) ->
            # Tab key?
            return unless (evt.keyCode or evt.which) is 9
            # Inject the new text.
            el.val query.attr('suggestion')
            # Prevent default event.
            do evt.preventDefault

        # Input field keypress.
        'input.text keyup': (el, evt) ->
            # Get the value; return on empty?
            return unless (value = do el.val).length
            # Exit updating query on Enter keypress.
            return query.attr('current', value) if (evt.keyCode or evt.which) is 13

            # Caret position from left.
            caret = el.prop 'selectionStart'

            # Exit if only spaces around us.
            return if value[ Math.max(caret - 1, 0)..caret ].match /^\s+$/

            # Which is the current word?
            word = ''
            try word += value[ 0...caret ].match(/([^\s]+)$/)[1] # left
            try word += value[ caret...  ].match(/(^[^\s]+)/)[1] # right

            # Determine position of caret in px.
            suggestions.attr 'px', @element
            .find('.faux')
            # ...replace with &nbsp; to get a more accurate position.
            .text(value[0...caret].replace(/\s/g, "\u00a0"))
            .outerWidth()

            # Otherwise try to autocomplete on the last word.
            ejs.suggest word, (err, suggs) ->
                # Ignore errors.
                return if err
                # Maybe only stopword so was skipped?
                return unless words = suggs[word]
                # Pluck the text saving as suggestions.
                suggestions.attr 'list', _.map words, 'text'

        # Clicking on breadcrumbs changes the current query.
        '.breadcrumbs a click': (el) ->
            query.attr 'current', do el.text