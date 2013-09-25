_ = require 'object' # keys, values, length, isEmpty, merge

mediator = require '../modules/mediator'
View     = require '../modules/view'

HeaderView     = require './header'
DuplicatesView = require './duplicates'
NoMatchesView  = require './nomatches'
SummaryView    = require './summary'

class AppView extends View

    autoRender: yes

    constructor: ->
        super

        @el.addClass('foundation')

        # Global save, call back.
        mediator.on 'save', =>
            @options.cb null, _.keys @collection.selected
        @

    render: ->
        # Render the header.
        @el.append (new HeaderView({ 'collection': @collection })).render().el

        { dupes, summary, dict } = @collection

        # Render the duplicates?
        @el.append((new DuplicatesView({
            'collection': dupes
        })).render().el) if dupes

        # Summary overview?
        @el.append((new SummaryView({
            'collection': summary
            dict
        })).render().el) if summary

        @

module.exports = AppView