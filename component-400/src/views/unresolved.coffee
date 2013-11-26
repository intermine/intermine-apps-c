View = require '../modules/view'

class UnresolvedView extends View

    template: require '../templates/unresolved'

    constructor: ->
        super
        @el.addClass 'unresolved section'

    render: ->
        @el.html @template { @collection }

        @

module.exports = UnresolvedView