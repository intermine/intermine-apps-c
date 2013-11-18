# How do we display "an object"?
# TODO: use a reusable component from Results Tables here instead
module.exports =
    
    # Show a "primary" symbol recognizable by humans.
    'primary': (model) ->
        # Go for a symbol first.
        for key in [ 'symbol', 'primaryIdentifier', 'secondIdentifier', 'name' ]
            if val = model.summary[key]
                return escape val

        # Try to return the longest string.
        val = [ 0, 'NA' ]
        for k, v of model.summary when v
            if (len = (''+v).replace(/\W/, '').length) > val[0]
                val = [ len, escape(v) ]

        # Hopefully we have something here by now.
        val[1]
    
    # A row for CSV output.
    'csv': (model, columns=yes) ->
        cols = [].concat([ 'provided' ], _.keys(model.summary))
        row  = [].concat([ model.input.join(', ') ], _.values(model.summary))
        if columns then [ cols, row ] else row

    # Provide a flyout summary of a model in question.
    'flyout': (model) ->
        format = (text) -> text.replace(/\./g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase()
        ( [ format(k), escape(v) ] for k, v of model.summary when v )

# Accept newline characters and similar.
escape = (string) -> JSON.stringify(string)[1...-1]