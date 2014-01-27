query =
    'select': [
        'Gene.publications.title'
        'Gene.publications.year'
        'Gene.publications.journal'
        'Gene.publications.pubMedId'
        'Gene.publications.authors.name'
    ]
    'orderBy': [
        { 'Gene.publications.firstAuthor': 'ASC' }
    ]
    'joins': [
        'Gene.publications.authors'
    ]

module.exports = new can.Map

    # Needs to be initialized.
    client: null

    # Search publications by Gene symbol.
    search: (symbol, cb) ->
        return cb 'Client is not setup' unless @client

        @client.query _.extend({}, query, {
            'where': [
                {
                    'path': 'Gene.symbol'
                    'op': 'CONTAINS'
                    'code': 'A'
                    'value': symbol
                }
            ]
        }), (err, q) ->
            return cb err if err

            q.tableRows (err, res) ->
                return cb err if err

                console.log res