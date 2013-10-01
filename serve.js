var connect = require('connect')
  , dir = __dirname
  , app = connect()
  , buffet = require('buffet')({ 'root': dir })

app.use(buffet);
app.use(buffet.notFound);

var server = require('http').createServer(app);
server.listen(process.env.PORT, function () {
    console.log('Serving ' + dir);
});