colorize = require '../modules/colorize'

# A score label.
module.exports = can.Component.extend

    tag: 'app-label'

    template: require '../templates/label'

    helpers:
        # Calculate the background color for a score.
        bg: (score) ->
            colorize do score

        # Calculate the foreground CSS class for a score.
        fg: (score) ->
            # The background.
            bg = colorize do score
            # Base foreground on the lightness of the background.
            { l } = d3.hsl(bg)
            if l < 0.5 then 'light' else 'dark'

        # Provide a "nice" score value.
        round: (score) ->
            Math.round 100 * do score