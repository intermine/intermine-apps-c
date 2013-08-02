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
    <script>require('component-400/app').call(null, data, '#target');</script>
</body>
</html>
```

#Build

```bash
$ npm install apps-b-builder
$ apps-b-builder ./src/ ./build/
```

#Example

Expose the `/example` dir on an HTTP server or use [Connect](http://www.senchalabs.org/connect/) for that:

```bash
$ npm install connect
$ PORT=1234 node index.js
```