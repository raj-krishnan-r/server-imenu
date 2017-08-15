var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
  var qr = require('qr-image');
var ip = "127.0.0.1";
var port = 3000;


server.listen(port);
    console.log(ip+" : "+port);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/qr', function (req, res) {

var ssid = req.query.ssid;
var key = req.query.key;
var tableid = req.query.tableId;
var host = req.query.host;
 
var qr_svg = qr.image('imenu,'+ssid+','+key+','+host+','+tableid, { type: 'svg' });
qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
 
var svg_string = qr.imageSync('imenu,'+ssid+','+key+','+host+','+tableid, { type: 'svg',size:'5' });
res.writeHead(200,{"content-type":"text/html"});
res.end(svg_string);

});

app.get('/listings',function(req,res){
console.log("Serving menu ...");
res.writeHead(200,{'Content-type':'text/json'});
res.end('["Mango Juice","Milk Shake","Chicken Biriyani","Black Tea","Fruit Salad","Blueberry Shake","Avagado Shake"]');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
      
