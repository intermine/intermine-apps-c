{ _ } = require './deps'

# Escape on enforced string or empty value.
escape = (text) ->
    return '""' unless text
    '"' + new String(text).replace(/\"/g, '""') + '"'

exports.save = (rows, delimiter=' ', newline) ->
    # Detect newline character.
    unless newline
        # http://en.wikipedia.org/wiki/Newline#Representations
        switch
            # Windoze.
            when navigator.appVersion.indexOf('Win') != -1
                newline = "\r\n"
            else
                newline = "\n"

    _.map(rows, (row) ->
        _.map(row, escape).join(delimiter)
    ).join(newline)

exports.read = (data, delimiter=',') ->
    # Early bath?
    return {} unless data.length

    # Create a regular expression to parse the CSV values.
    objPattern = new RegExp(
        (
            # Delimiters.
            "(\\" + delimiter + "|\\r?\\n|\\r|^)" +

            # Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            # Standard fields.
            "([^\"\\" + delimiter + "\\r\\n]*))"
        ), "gi")
    
    # Hold the spreadsheet here.
    sheet = {}
    
    # Hold matches here.
    matches = null
    
    # Where are we in the file?
    row = 0 ; column = 0

    # Keep looping over the regular expression matches.
    while matches = objPattern.exec data
        # Get the delimiter that was found.
        [ foundDelimiter, quoted, value ] = matches[1...]
        
        # A new row if we reach an unknown delimiter.
        if foundDelimiter and (foundDelimiter isnt delimiter)
            row++ ; column = 0
        
        # Unescape any double quotes if we found a quoted value.
        if quoted then value = quoted.replace(new RegExp("\"\"", "g"), "\"")

        # Add it, no checking whether we can work it.
        if value and value.length isnt 0
            sheet[String.fromCharCode(65 + column++) + row] = value
        else
            # We can have empty cells, move index then.
            column++

    # Return the parsed data.
    sheet