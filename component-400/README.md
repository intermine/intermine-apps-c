#component #400

Visualizes the result of an InterMine ID Resolution job.

#Usage

```html
<!doctype html>
<html>
<head>
    <link href="app.bundle.css" media="all" rel="stylesheet" type="text/css" />
    <script src="app.bundle.js"></script>
</head>
<body>
    <div id="target"></div>
    <script>
        // An example of fetching the results using JSON, yours will most likely work
        //  differently.
        $.getJSON('data.json', function(data) {
            // Require the app and execute it passing the following opts...
            require('component-400')({
                // The data payload. You can see example in `example/data.json`.
                'data': data,
                // The target string, defaults to the <body/> element.
                'target': '#target',
                // Callback once the user is happy with the selection.
                cb: function(err, selected) {
                    // Also called when there is a problem of some sort.
                    if (err) throw err;
                    // Has a list of internal InterMine IDs.
                    console.log(selected);
                },
                // Optionally provide a formatter. What you return will represent a
                //  symbol of some sort for a row of results.
                formatter: function(model) {
                    return 'NA'
                },
                // What to do when we click on one of the item/object links?
                portal: function(object, el) {
                    var type = object.object.type,
                        symbol = escape(JSON.stringify(object.object.summary.symbol).slice(1, -1)),
                        url = 'http://beta.flymine.org/beta/portal.do?externalids='+ symbol +'&class=' + type;
                    console.log(url);
                }
            });
        })
    </script>
</body>
</html>
```

##Build

```bash
$ npm install
$ grunt
```

Or if you are watching:

```bash
$ watch --color grunt build
```

##Dependencies

Fetch them using [Bower](http://bower.io/):

```bash
$ bower install
```

If you are having throuble with [mori](https://github.com/swannodette/mori) make sure you have `Java` installed.