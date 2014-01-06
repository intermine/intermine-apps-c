# ColorBrewer color scales.
colors = colorbrewer.YlOrRd[9]
# The "allowed" ranges for scores.
min = 0.2 ; max = 2.5
# Convert input domain to an output color range.
module.exports = do ->
    # Colorizing function.
    fn = d3.scale.linear()
    .domain(d3.range(min, max, (max - min) / (colors.length - 1)))
    .range(colors)
    # Return memoized function that trims score and then returns a color.
    _.memoize (score) ->
        fn Math.max min, Math.min max, score