db = window.localStorage

module.exports = Document = can.Model.extend({ })

Document.List = Document.List.extend

    # localStorage key prefix.
    dbName: 'elastic-med'

    # Init localStorage keys for quick access to items.
    keys: null

    # Load flag decides if we should populate in-memory collection.
    init: (docs, load=no) ->
        # Init keys.
        item = db.getItem @dbName
        @keys = (item and item.split(',')) or []

        # Shall we load data from localStorage?
        if load and @keys.length
            for key in @keys
                @push JSON.parse db.getItem "#{@dbName}-#{key}"

        # Save data to localStorage.
        else
            # Save the documents to localStorage. Will override any
            #  previous versions if they exist.
            for doc in docs
                db.setItem "#{@dbName}-#{doc.oid}", JSON.stringify doc
                # Save the key too.
                @keys.push doc.oid unless doc.oid in @keys

            # Save all the keys at once.
            db.setItem @dbName, @keys.join(',')

        # Destroy when navigating away.
        window.onbeforeunload = =>
            do @destroy
            null

    # Clear all our documents from localStorage.
    destroy: ->
        # The items.
        ( db.removeItem "#{@dbName}-#{key}" for key in @keys )
        
        # And the keys.
        db.removeItem @dbName
        @keys = []

        @