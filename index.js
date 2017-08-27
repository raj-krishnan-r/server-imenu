var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
  var qr = require('qr-image');
var fs = require('fs');
var ip = "127.0.0.1";
var port = 3000;


//Class Templates
function user(socketid,tableid)
{
  this.socketid = socketid;
  this.table = tableid;
}
function Order (itemid,itemname,count,tableid,orderid)
{
this.itemid = itemid;
this.itemname = itemname;
this.count = count;
this.tableid = tableid;
this.orderid=orderid;
}

//Array to store user sockets and tableid
var users = new Array();



server.listen(port);
    console.log(ip+" : "+port);
app.get('/', function (req, res) {

fs.readFile(__dirname + '/htmls/MainInterface.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200,{"content-type":"text/html"});
    res.end(data);
  });


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
res.end('[{"name":"Mango Juice","price":"15","itemid":"01","shortdescription":"Some stuffs about this."},{"name":"Oreo Shake","price":"40","itemid":"02","shortdescription":"Some stuffs about this."},{"name":"Avacado Shake","price":"55","itemid":"03","shortdescription":"Some stuffs about this."},{"name":"Blueberry Shake","price":"80","itemid":"05","shortdescription":"Some stuffs about this."},{"name":"Apple Juice","price":"25","itemid":"06","shortdescription":"Some stuffs about this."},{"name":"Orange Juice","price":"25","itemid":"07","shortdescription":"Some stuffs about this."}]');
});

io.on('connection', function (socket) {
console.log("A client connected");

socket.on('registerUser',function(data){
//Looking for table id existence
{
  var i =0
  var flag = 0;
while(i!=users.length)
  {
    if(users[i].table==data)
      {
        console.log("Table already registerd !");
        console.log("Attempting to alter previous socket id...");
        users[i].socketid=socket.id;
        console.log("Socketid altered");
        flag=1;
        break;
      }
              i++;

  }
    if(flag==0)
  users.push(new user(socket.id,data));
}
  console.log("Alloted socket : "+socket.id+" Total users : "+users.length);
});
socket.on('order',function(data){
var ord = new Order();
var jsondec = JSON.parse(data);

var ord = new Order(jsondec.itemid,jsondec.item,jsondec.count,jsondec.tableid,jsondec.orderid);
var ih=(JSON.stringify(ord));
socket.broadcast.emit('orderAck',ih);
});
socket.on('ackOrder',function(data){
  var decoded = JSON.parse(data);
  var i = 0;
  while(i!=decoded.length)
    {
      if(users[i].table==decoded.tableId)
        {
          socket.broadcast.to(users[i].socketid).emit('ackRec',data);
        }
        i++;
        break;
    }

});


});
      
