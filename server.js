var port = 8888;

console.log('listening to localhost on port...' + port);
var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(port);
