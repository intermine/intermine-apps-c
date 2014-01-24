render  = require './modules/render'

module.exports = ->
    template = require './templates/layout'
    $('body').html render template