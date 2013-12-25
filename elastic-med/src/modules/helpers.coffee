# A helper to generate a link to an index or a document detail page.
exports.link = link = (oid) ->
    # Index.
    return '#!' unless oid
    # Document.
    can.route.url 'oid': do oid

# Convert a string into a boolean value.
exports.ifs = ifs = (value, opts) ->
    value = do value if _.isFunction value
    if (value == 'true')
        opts.fn(@)
    else
        opts.inverse(@)

# Globally register as well.
Mustache.registerHelper 'link', link
Mustache.registerHelper 'ifs', ifs