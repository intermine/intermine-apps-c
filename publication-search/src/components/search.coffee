query = require '../modules/query'

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: -> { 'query': { 'value': query } }

    events:
        'input keyup': (el, evt) ->
            if (evt.keyCode or evt.which) is 13
                query do el.val