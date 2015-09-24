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
            // Returns a function that can be called to retrieve the currently selected items.
            require('component-400')({
                // The data payload. You can see example in `./example/data.json`.
                'data': data,
                // The target element selector, defaults to <body/>.
                'el': '#target',
                // Callback once the user is happy with the selection.
                cb: function(selected) {
                    // Has a list of internal InterMine IDs.
                    console.log('selected', selected);
                },
                // What to do when we click on one of the item/object links?
                portal: function(object, el) {
                    console.log('portal', object);
                },
                // User interface options.
                'options': {
                    // Show/hide a button to download the summary?
                    'showDownloadSummary': true,
                    // How do we show the matches?
                    // [full] - show all summary fields in the table
                    // [slim] - show only a symbol and provide more info in a popover
                    'matchViewStrategy': 'full'
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
###Troubleshooting

If you are having trouble with [mori](https://github.com/swannodette/mori) make sure you have `Java` installed.

If you get an error saying `mori is not defined` in the browser console, try:
 * go to component-400/vendor/mori
 * run `./scripts/build.sh`
 * run `grunt` again (from the root component 400 folder). This this should now work. 
