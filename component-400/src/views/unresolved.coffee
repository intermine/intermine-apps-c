View = require '../modules/view'

class UnresolvedView extends View

    template: require '../templates/unresolved'

    render: ->
        @el.addClass 'unresolved section'

        super

module.exports = UnresolvedView