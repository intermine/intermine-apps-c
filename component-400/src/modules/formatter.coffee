_ = require 'object' # keys, values, length, isEmpty, merge

# How do we display "an object"?
module.exports =
    
    # Show a "primary" symbol recognizable by humans.
    'primary': (model) ->
        model.object.summary.primaryIdentifier
    
    # A row for CSV output.
    'csv': ({ provided, object }, columns=yes) ->
        cols = [].concat([ 'provided', 'type' ], _.keys(object.summary))
        rows = [].concat([ provided, object.type ], _.values(object.summary))
        if columns then [ cols, rows ] else rows