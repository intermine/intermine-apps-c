#component #400

Shows a table of matches of an InterMine ID Resolution Job.

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
    require('component-400/app').call(null, data, '#target', function(err, selected) {
        // An error callback.
        if (err) throw err;
        // A list of selected identifiers.
        console.log(selected);
    });
    </script>
</body>
</html>
```

You can see a running example like so:

```bash
$ apps-b serve ./example/
```

#Build

```bash
$ npm install apps-b-builder
$ apps-b build ./src/ ./build/
```