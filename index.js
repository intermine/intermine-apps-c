connect = require('connect')

server = connect.createServer(
    connect.favicon(),
    connect.static(__dirname + '/example')
);
server.listen(process.env.PORT);