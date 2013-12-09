View = require '../modules/view'

class TooltipView extends View

    tag: 'span'

    template: require '../templates/tooltip'

    constructor: ->
        super

        @model.text = tooltips[@model.id]

        @el.addClass('tooltip tip-top noradius')

# Tooltip text.
tooltips =
    # Multiple matches.
    '1': 'These identifiers matched more than one record in the database.<br />Click on the ADD button next to the identifier you want to include in your list.'
    # Identifier you provided column.
    'provided': 'These are the identifiers you typed in the form on the previous page.'
    # Explaining the add button.
    'add': 'Use these buttons to add (or remove) this record to your list.'
    
    # Label for both "matches" and "match".
    'matches': 'These are the records in the database that correspond to the<br/>identifier you entered on the previous page.'

    # Summary.
    '2': 'This is a summary of what is in your list.'
    # Match class.
    'match': 'An exact match was found between what you entered and what is in our database.'
    # Converted from a different type.
    'type_converted': 'These identifiers matched records in our database but were<br/>not the type of data you specified on the previous page.'
    # Synonym class.
    'other': 'These identifiers matched old identifiers.'

    # No matches.
    '4': 'Identifiers that could not be resolved.'

module.exports = TooltipView