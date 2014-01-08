query = require '../modules/query'
ejs   = require '../modules/ejs'

suggestions = new can.Map

    # Position in px from left.
    'px': 0

    # List of suggestions.
    'list': []

    # Pluck text from ejs words and inactivate all.
    setList: (words) ->
        _.map words, ({ text }, i) ->
            { text, 'active': not i } # activate the first item

# Callback for suggestions list deactivating an item.
findActive = (s, i) ->
    return unless active = s.active # not active
    s.attr 'active', no # deactivate
    yes # found it

# Autocomplete provided word at the current caret.
autocomplete = (word, el) ->
    # The input field value.
    value = do el.val

    # Caret position from left.
    caret = parseInt el.prop 'selectionStart'

    # Find the beginning of the word to replace.
    value[ 0...caret ].replace /([^\s]+)$/, (match, p, offset, string) ->
        # Move caret to the left by match-many.
        caret -= match.length

    # Make the replacement.
    value = value[ 0...caret ] + value[ caret...  ].replace /(^[^\s]+)/, word

    # Move the caret to the end of the new word.
    caret += word.length

    # Show the new string.
    el.val value
    
    # Selection of 0.
    el[0].setSelectionRange caret, caret

# Trigger suggestions on our word?
suggest = (el, evt) ->
    # Get the value; return on empty?
    return unless (value = do el.val).length
    
    # Exit updating query on Enter keypress.
    return query.attr('current', value) if (key = (evt.keyCode or evt.which)) is 13

    # Do not do anything if we are a Tab or up or down arrow.
    return if key in [ 9, 38, 40 ]

    # Caret position from left.
    caret = el.prop 'selectionStart'

    # Exit clearing suggestions if only spaces around us.
    if value[ Math.max(caret - 1, 0)..caret ].match /^\s+$/
        return suggestions.attr('list', [])

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
    ejs.suggest word, (err, res) ->
        # Ignore errors.
        return if err
        # Maybe only stopword so was skipped?
        return unless words = res[word]
        # Save as suggestions.
        suggestions.attr 'list', words

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: -> { query, suggestions }

    events:
        # Search button click does the search immediately:
        'a.button click': ->
            query.attr 'current', do @element.find('input').val
        
        # Onhover suggestion highlight it.
        '.suggestions li mouseover': (el, evt) ->
            # No suggestions? How is that even possible???
            return unless (list = suggestions.list).length

            # Remove active status.
            _.find list, findActive

            # Activate our item.
            text = do el.find('a').text
            _.find list, (s, i) ->
                # No match.
                return unless s.text is text
                # Activate.
                s.attr 'active', yes

        # Click a suggestion = autocomplete on this.
        '.suggestions li click': (el, evt) ->
            # Our input field.
            input = @element.find 'input.text'

            # Do the replacement.                    
            autocomplete (do el.find('a').text), input

            # Do not care about our list anymore.
            suggestions.attr 'list', []

            # Give our input field focus again.
            do input.focus

        # Tab and arrow keys for suggestions.
        'input.text keydown': (el, evt) ->
            # An up or down arrow event?
            arrow = (key) ->
                # No suggestions?
                return unless (list = suggestions.list).length
                # Which direction?
                switch key
                    # Up.
                    when 38
                        # Which item are we on now?
                        current = _.findIndex(list, findActive) or 0 # default to the first item
                        # Move one up or jump to the end.
                        current = list.length - 1 if (current -= 1) < 0
                    when 40
                        # Which item are we on now?
                        current = _.findIndex(list, findActive)
                        current = list.length - 1 if _.isUndefined current # default to the last item
                        # Move one down or jump to the beginning.
                        current = 0 if (current += 1) is list.length

                # Activate the item.
                list[current].attr 'active', yes

                # The buck stops here.
                do evt.preventDefault

            # Which key has been pressed down?
            switch key = (evt.keyCode or evt.which)
                # Tab key autocompletes the active word.
                when 9
                    # No suggestions?
                    return unless (list = suggestions.list).length
                                    
                    # Which is the currently active word?
                    return unless item = _.find(list, findActive)

                    # Get the value to replace with.
                    word = item.text

                    # Do the replacement.                    
                    autocomplete word, el

                    # Do not care about our list anymore.
                    suggestions.attr 'list', []

                    # The buck stops here.
                    do evt.preventDefault

                # Up or down arrow keys move around the suggestions list.
                when 38, 40 then arrow key

                # Escape key clears the suggestions.
                when 27
                    suggestions.attr 'list', []
                    # ...and removes the focus.
                    do el.blur

        # Input field keypress triggers suggestions search.
        'input.text keyup': suggest

        # Clicking on input field should trigger suggestions search too.
        'input.text click': suggest

        # Clicking on breadcrumbs changes the current query.
        '.breadcrumbs a click': (el) ->
            query.attr 'current', do el.text
