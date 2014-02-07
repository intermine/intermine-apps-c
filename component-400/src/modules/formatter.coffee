{ _ } = require './deps'

# How do we display "an object"?
# TODO: use a reusable component from Results Tables here instead
module.exports =
    
    # Show a "primary" symbol recognizable by humans.
    'primary': (model) ->
        # Go for a symbol first.
        for key in [ 'symbol', 'primaryIdentifier', 'secondIdentifier', 'name' ]
            return val if val = model.summary[key]

        # Try to return the longest string.
        val = [ 0, 'NA' ]
        for k, v of model.summary when v
            if (len = (''+v).replace(/\W/, '').length) > val[0]
                val = [ len, v ]

        # Hopefully we have something here by now.
        val[1]
    
    # A row for CSV output.
    'csv': (model, columns) ->
        # Generate columns from the first object that comes by.
        columns = _.keys model.summary unless columns
        # Give us values from the summary object given a set of columns.
        row = ( (if (value = model.summary[column]) then value else '') for column in columns )
        
        # Ret.
        [ columns, row ]

    # Provide a flyout summary of a model in question.
    'flyout': (model) ->
        ( [ @field(k), v ] for k, v of model.summary when v )

    # Format a field.
    # TODO: use webconfig for this.
    'field': (text) ->
        text.replace(/\./g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase()