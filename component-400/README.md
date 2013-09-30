#component #400

Visualizes the result of an InterMine ID Resolution job.

#Usage

```html
<!doctype html>
<html>
<head>
    <link href="/build.css" media="all" rel="stylesheet" type="text/css" />
    <script src="/build.js"></script>
</head>
<body>
    <div id="target"></div>
    <script>
        // An example of fetching the results using JSON, yours will most likely work
        //  differently.
        (require('jquery')).getJSON('/data.json', function(data) {
            // Require the app and execute it passing the following opts...
            require('component-400/app')({
                // The data payload. You can see example in `example/data.json`.
                'data': data,
                // The target string, defaults to the <body/> element.
                'target': '#target',
                // Callback once the user is happy with the selection.
                'cb': function(err, selected) {
                    // Also called when there is a problem of some sort.
                    if (err) throw err;
                    // Has a list of internal InterMine IDs.
                    console.log(selected);
                },
                // Optionally provide a formatter. What you return will represent a
                //  symbol of some sort for a row of results.
                'formatter': function(model) {
                    return 'NA'
                }
            });
        })
    </script>
</body>
</html>
```

#Build

```bash
$ npm install apps-b-builder -g
$ watch -n 1 -c apps-b build ./src/ ./build/
```