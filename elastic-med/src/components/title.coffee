state = require '../modules/state'

# Page title/status.
module.exports = can.Component.extend

    tag: 'app-title'

    template: require '../templates/title'

    scope: -> state