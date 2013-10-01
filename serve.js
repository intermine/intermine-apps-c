var express = require('express'),
    app = express()
    dir = __dirname;

app.listen(process.env.PORT);

app.use(express.directory(dir));
app.use(express.static(dir));