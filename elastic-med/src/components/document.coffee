query = require '../modules/query'

# One document.
module.exports = can.Component.extend

    tag: 'app-document'

    template: require '../templates/document'

    scope:
        # Link to the detail from abstract.
        linkToDetail: '@'
        # Show keywords, duh.
        showKeywords: '@'

    events:
        '.keywords li a click': (el, evt) ->
            # Change the query.
            query.attr 'current', do el.text
            # Redirect.
            location.hash = '#!'

    helpers:
        # Published ago & format date.
        ago: (published) ->
            { year, month, day } = do published
            do moment([ year, month, day ].join(' ')).fromNow

        date: (published) ->
            { day, month, year } = do published
            [ day, month, year ].join(' ')

        # Is publication out yet?
        isPublished: (published, opts) ->
            { day, month, year } = do published
            stamp = +moment([ day, month, year ].join(' '))
            return opts.inverse(@) if (stamp or Infinity) > +new Date
            # Continue.
            opts.fn(@)

        # Author name.
        author: (ctx) ->
            # Collective name.
            return collective if collective = ctx.collectivename
            # Person name.
            ctx.forename + ' ' + ctx.lastname

        # Merge text and highlighted terms together. Works in the results
        #  and also on the document detail page.
        highlight: (field) ->
            # Get the values.
            field = do field

            # Will this field have a highlight?
            return field unless _.isObject field

            # Skip if we have nothing to highlight.
            return field.value unless field.highlights.length
            
            # For each snippet...
            for snip in field.highlights
                # Strip the tags from the snippet.
                text = snip.replace /<\/?em>/g, ''
                # ...replace the original with the snippet.
                highlighted = field.value.replace text, snip
            
            # Return the new text.
            highlighted

        # Format a hint trimming it.
        hint: (text, length) ->
            return text if (text = (do text)) < length
            for word, i in (words = text.split(' '))
                length -= word.length
                return words[0..i].join(' ') + ' ...' unless length > 0