state = require '../modules/state'

# An alert.
module.exports = can.Component.extend

    tag: 'app-alert'

    template: require '../templates/alert'

    scope: -> state