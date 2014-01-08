results  = require './results'
ejs      = require './ejs'

Document = require '../models/document'

# State of the application.
State = can.Map.extend

    # Loading.
    loading: ->
        state.attr
            'text': 'Searching'
            'type': 'load'
        
        # Clear results.
        do results.clear

    # We have results.
    hasResults: (total, docs) ->
        state.attr
            'type': 'info'
            'text': do ->
                # How many?
                if total > ejs.size
                    "Top results out of #{total} matches"
                else
                    if total is 1 then '1 Result' else "#{total} Results"

        # Save the results.
        results.attr { total, 'docs': new Document.List(docs) }
    
    # We have no results.
    noResults: ->
        state.attr
            'text': 'No results found'
            'type': 'info'
        
        # Clear results.
        do results.clear

    # Something went wrong.
    error: (err) ->
        text = 'Error'
        switch
            when _.isString err
                text = err
            when _.isObject err and err.message
                text = err.message

        state.attr { text, 'type': 'alert' }
        
        # Clear results.
        do results.clear

# New global state instance.
module.exports = state = new State
    'text': 'Search ready'
    'type': 'info'