# App options, configurable by the user.
options =
    'showDownloadSummary': yes

module.exports =
    'set': (key, value) ->
        # All.
        return _.extend(options, key) if _.isObject key
        # One.
        options[key] = value
    
    'get': (key) ->
        # One.
        return options[key] if key
        # All.
        options