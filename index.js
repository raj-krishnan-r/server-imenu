var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');



var port = process.env.OPENSHIFT_NODEJS_PORT || 3001;

var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port,ip);
function handler (req, res) {

  fs.readFile(__dirname + '/htmls/connect.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  io.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
