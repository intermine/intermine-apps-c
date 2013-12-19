// Will be converted to plain JS Object.
module.exports = {
    "author": "Radek <rs676@cam.ac.uk>",
    "title": "Resolve Identifiers",
    "description": "Resolve a bunch of identifiers in InterMine and return a PathQuery",
    "version": "0.2.1",
    "dependencies": {
        "css": {
            "FoundationCSS": {
                "path": "http://cdn.intermine.org/css/foundation/4.2.2/foundation.min.css"
            }
        },
        "js": {
            "jQuery": {
                "path": "http://cdn.intermine.org/js/jquery/1.10.1/jquery.min.js"
            },
            "_": {
                "path": "http://cdn.intermine.org/js/lodash/2.3.0/lodash.js"
            },
            "Backbone": {
                "path": "http://cdn.intermine.org/js/backbone.js/0.9.2/backbone-min.js",
                "depends": [
                    "jQuery",
                    "_"
                ]
            },
            "intermine.imjs": {
                "path": "http://cdn.intermine.org/js/intermine/imjs/2.9.2/im.js",
                "depends": [
                    "jQuery",
                    "_"
                ]
            },
            "async": {
                "path": "http://cdn.intermine.org/js/async/0.2.6/async.min.js",
                "depends": [ "setImmediate" ]
            },
            "setImmediate": {
                "path": "http://cdn.intermine.org/js/setImmediate/1.0.1/setImmediate.min.js"
            },
            "Foundation": {
                "path": "http://cdn.intermine.org/css/foundation/4.2.2/foundation.min.js",
                "depends": [ "jQuery" ]
            },
            "buckets": {
                "path": "http://cdn.intermine.org/js/buckets/latest/buckets.min.js"
            }
        }
    },
    // Example config.
    "config": {
        // Pass the following to the App from the client.
        'mine': 'http://www.flymine.org/query', // which mine to connect to
        'token': 'X133AbT7J0Z0HfV316Q4', // token so we can access private lists
        'type': 'many', // one OR many
        // Defaults in the forms.
        'defaults': {
            'identifiers': [ 'PPARG', 'ZEN', 'MAD', 'ftz', 'Adh' ], // one identifier taken from the head
            'type': 'Gene',
            'organism': 'D. melanogaster'
        },
        // Provided input, if any.
        'provided': {
            'identifiers': [ 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS', 'PPARG', 'MAD', 'EVIL', 'GENIUS' ],
            'type': 'Gene',
            'organism': 'D. melanogaster'
        },
        // A callback called at least once.
        cb: function(err, working, out) {
            // Has error happened?
            if (err) throw err;
            // Are you working?
            console.log('working:', working);
            // Are you done? Dump the output then.
            console.log('query:', out);
        },
        
        // Pass this from your middleware that knows about the mine it connects to.
        "pathQueries": {
            "organisms": {
                "select": [
                    "Organism.shortName",
                    "Organism.name"
                ]
            }
        }
    }
};