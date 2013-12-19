class Form extends Backbone.View

    events:
        'click button': 'submit'
        'keyup textarea[name="input"]': 'resize'

    initialize: (@config, @templates, @service) ->

    render: ->
        # Populate the template.
        $(@el).html @templates[@config.type + '.eco'] @config

        @

    # Upload a list of identifiers and make them into a list.
    submit: ->
        # Our ref.
        self = @

        # Input cleaner.
        clean = (value) ->
            value = value
            .replace(/^\s+|\s+$/g, '') # trim leading and ending whitespace
            .replace(/\s{2,}/g, ' ')   # remove multiple whitespace
            
            return [] if value is ''   # useless whitespace input

            value.split /\s/g          # split on whitespace

        # Expose the input "globally".
        out = 'input': {}

        # Work starts here.
        self.config.cb null, true

        # Get the form.
        async.waterfall [ (cb) ->
            # Get the identifiers.
            out.input.identifiers = clean $(self.el).find('form *[name="input"]').val()

            # Do we have any?
            return cb 'No identifiers have been provided' if out.input.identifiers.length is 0

            # Get the DOM data.
            out.input.organism = $(self.el).find('form select[name="organism"]').val()
            out.input.type = $(self.el).find('form select[name="type"]').val()

            # Next.
            cb null

        # Upload IDs.
        (cb) ->
            (self.service.resolveIds
                'identifiers': out.input.identifiers
                'type':        out.input.type
                'extra':       out.input.organism
            ).then (job) ->
                cb null, job

        # Poll for job results.
        (job, cb) ->
            job.poll().then (results) ->
                # Save all of the results.
                out.results = results

                # Get the good match keys.
                keys = do results.goodMatchIds

                # Skip if no matches.
                return cb null unless keys.length

                # Form a query.
                out.query =
                    'select': [
                        "#{out.input.type}.*"
                    ]
                    'constraints': [
                        { 'path': "#{out.input.type}.id", 'op': 'ONE OF', 'values': keys }
                    ]

                cb null

        # Call back with the input and output.
        ], (err) ->
            self.config.cb err, false, out

    # Potentially resize textarea field for its content.
    resize: (evt) =>
        # We can be called programatically too...
        if evt
            el = evt.target
        else
            el = $(@el).find('textarea[name="input"]')[0]

        # Keep making me bigger...
        do onesie = ->
            if el.clientHeight < el.scrollHeight
                # Add some height.
                $(el).css 'height', el.clientHeight + 10 + 'px'
                # Check once it has re-rendered.
                setTimeout onesie, 10

# This is my app definition, needs to have a set signature.
class exports.App

    # Have access to config and templates compiled in.
    constructor: (@config, @templates) ->
        # I will throw up the first chance I get. Or will I?
        @config.cb ?= -> throw 'Provide your own `cb` function'

        # Point to the mine's service.
        @service = new intermine.Service
            'root': @config.mine
            'token': @config.token
            'errorHandler': @config.cb # first param passed to errorHandler is the error

    # Render accepts a target to draw results into.
    render: (target) ->
        self = @

        target = $ target

        # Work starts here.
        self.config.cb null, true

        # Get the types.
        async.waterfall [ (cb) ->
            self.service.fetchModel (model) ->                
                # Binary search tree of classes where items are sorted based on name.
                classes = new buckets.BSTree (a, b) -> a[1].localeCompare(b[1])
                
                # Now that we have the model, convert to PathInfo for each and give us nice name.
                async.each Object.keys(model.classes), (clazz, cb) ->
                    (model.getPathInfo(clazz)).getDisplayName (name) ->
                        classes.add [ clazz, name ]
                        cb null
                , (err) ->
                    # Convert to Array.
                    self.config.classes = classes.toArray()
                    cb null

        # Get the organisms.
        (cb) ->
            query = self.config.pathQueries?.organisms
            return cb 'Missing `organisms` pathQuery' unless query

            self.service.query query, (q) ->
                q.records (obj) ->
                    # Binary search tree sorted on short name.
                    organisms = new buckets.BSTree (a, b) -> a[1].localeCompare(b[1])
                    # Fill it.
                    ( organisms.add [ item.name, item.shortName ] for item in obj )
                    # Save it.
                    self.config.organisms = organisms.toArray()
                    # Bye.
                    cb null

        ], (err) ->
            # Trouble in the paradise?
            return self.config.cb(err) if err

            # No longer working.
            self.config.cb null, false

            # New View.
            view = new Form self.config, self.templates, self.service
            
            # Render into the target el.
            target.html view.render().el
    
            # Resize it.
            do view.resize

            # Foundation custom forms.
            target.foundation('forms')