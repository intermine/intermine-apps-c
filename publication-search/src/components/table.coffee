pubs = require '../modules/pubs'

# Table of publication results.
module.exports = can.Component.extend

    tag: 'app-table'

    template: require '../templates/table'

    scope: -> { pubs }