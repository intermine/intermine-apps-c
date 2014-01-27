query = require '../modules/query'

# Search form.
module.exports = can.Component.extend

    tag: 'app-search'

    template: require '../templates/search'

    scope: -> { 'query': { 'value': query } }