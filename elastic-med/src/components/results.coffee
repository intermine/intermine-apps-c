results = require '../modules/results'

# Search results.
module.exports = can.Component.extend

    tag: 'app-results'

    template: require '../templates/results'

    scope: -> results