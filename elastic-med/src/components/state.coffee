state = require '../modules/state'

# Page title/status.
module.exports = can.Component.extend

    tag: 'app-state'

    template: require '../templates/state'

    scope: -> state

    helpers:
        isLoading: (opts) ->
            if state.attr('type') is 'load'
                opts.fn(@)
            else
                opts.inverse(@)