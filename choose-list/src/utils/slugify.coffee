module.exports = (text) ->
    text
    .toLowerCase()
    .replace(RegExp(" ", "g"), "-")
    .replace /[^\w-]+/g, ""