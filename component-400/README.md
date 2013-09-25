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

#Build

```bash
$ npm install apps-b-builder -g
$ watch -n 1 -c apps-b build ./src/ ./build/
```