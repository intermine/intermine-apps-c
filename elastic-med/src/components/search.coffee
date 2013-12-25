query = require '../modules/query'

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: ->
        # A bit of an ugly syntax...
        'query': { 'value': query }

    events:
        # Button click:
        'a.button click': ->
            query do @element.find('input').val
        # Input field keypress.
        'input keyup': (el, evt) ->
            query do el.val if (evt.keyCode or evt.which) is 13