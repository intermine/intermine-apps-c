_ =
    extend:  require 'extend'
    map:     require 'map'

# Functionalize templates.
[ table ] = _.map [ './table', ], (tml) ->
    (context, cb) ->
        try
            cb null, require(tml) context or {}
        catch err
            cb err.message

module.exports = (data, target) ->
    table data, (err, html) ->
        throw err if err

        console.log html