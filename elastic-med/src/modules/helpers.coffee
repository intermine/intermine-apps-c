# A helper to generate a link to an index or a document detail page.
exports.link = (oid) ->
    # Index.
    return '#!' unless oid
    # Document.
    can.route.url 'oid': do oid