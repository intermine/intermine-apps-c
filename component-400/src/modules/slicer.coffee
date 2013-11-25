# Do not forget to run `test/slicer.coffee` if you change something.
# Ranges are 0 indexed and inclusive, e.g.: 1..2 = [ 0, 1 ]
module.exports = (collection, aRng, bRng, handler) ->
    for item in collection
        [ aUs, bUs ] = item.range

        # Do we start after or on `a`?
        if aUs >= aRng
            # Is it on?
            if aUs is aRng
                # Getting all from us?
                if bUs <= bRng
                    # Add all from us.
                    handler.call @, item, 0, item.matches.length - 1 # all
                    # Spot on?
                    break if bUs is bRng
                else
                    handler.call @, item, 0, bRng - aUs # right chop
                    # Def break.
                    break
            
            # We are starting after `a`, but are still running, so want us.
            else
                # Do we want just a piece?
                if bUs > bRng
                    # Add this many.
                    handler.call @, item, 0, bRng - aUs # right chop
                    # Do not continue.
                    break
                # Want all of us.
                else
                    handler.call @, item, 0, item.matches.length - 1 # all
                    # And then stop?
                    break if bUs is bRng

        # Are we inside then?
        else
            # Till the end?
            if bUs <= bRng
                handler.call @, item, aRng - aUs, item.matches.length - 1 # left chop
                # Stop on us?
                break if bUs is bRng
            # Not all of us then.
            else
                handler.call @, item, aRng - aUs, bRng - aUs # left & right chop
                # So quit.
                break