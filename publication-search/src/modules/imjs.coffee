query =
    'select': [
        'Publication.title'
        'Publication.year'
        'Publication.journal'
        'Publication.pubMedId'
        'Publication.authors.name'
        'Publication.bioEntities.symbol'
        'Publication.bioEntities.id'
    ]
    'orderBy': [
        { 'Publication.title': 'ASC' }
    ]
    'joins': [
        'Publication.authors'
    ]

module.exports = new can.Map

    # Needs to be initialized.
    client: null

    # Search publications by bio entity symbol.
    search: (symbol, cb) ->
        return cb 'Client is not setup' unless @client

        @client.query _.extend({}, query, {
            'where': [
                {
                    'path': 'Publication.bioEntities.symbol'
                    'op':   'CONTAINS'
                    'value': symbol
                }
            ]
        }), (err, q) ->
            return cb err if err
            # Run the query.
            q.tableRows (err, res) ->
                return cb err if err

                # Re-map to a useful format.
                remap = (rows) ->
                    type = null
                    _.extend _.zipObject(_.map rows, (row) ->
                        # Add our type.
                        type = row.class if row.column is 'Publication.bioEntities.id'
                        # Tuple of column - value.
                        [
                            row.column.split('.').pop()
                            if row.rows then _.map(row.rows, remap) else row.value
                        ]
                    ), { type }

                cb null, _.map res, remap