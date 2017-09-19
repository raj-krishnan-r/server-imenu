var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var qr = require('qr-image');
const url = require('url');
  var mime = require('mime');
var fs = require('fs');

//Class Templates
function user(socketid,tableid)
{
  this.socketid = socketid;
  this.table = tableid;
}
function Order (itemid,itemname,count,tableid,orderid,price)
{
this.itemid = itemid;
this.itemname = itemname;
this.count = count;
this.tableid = tableid;
this.orderid=orderid;
this.price=price;
}

function particulars(tableid,itemid,itemname,count,price)
{
this.tableid=tableid;
this.itemid=itemid;
this.itemname=itemname;
this.count=count;
this.price=price;

}

//Server Configuration reading..

fs.readFile(__dirname + '/serverconf.json',function(err,data)
{
if(err)
{
  console.log("Can't load Server Configuration file");
console.log(err);
}
else
{
var settings = JSON.parse(data);
//Reading setttings
var rootDirectory = settings.rootDirectory;
var ip = settings.ipv4;
var port = settings.port;
//Array to store user sockets and tableid
var users = new Array();
var conforders = new Array();
var ordersplaced=new Array();

//Items 
var dummy = '[{"categorytitle": "Juices","items": [{"name": "Mango Juice","price": "15","itemid": "01","shortdescription": "Some stuffs about this."}, {"name": "Oreo Shake","price": "40","itemid": "02","shortdescription": "Some stuffs about this."}, {		"name": "Avacado Shake","price":"55","itemid": "03","shortdescription": "Some stuffs about this."}, {	"name": "Blueberry Shake","price": "80","itemid": "05","shortdescription": "Some stuffs about this."}, {"name": "Apple Juice","price": "25","itemid": "06","shortdescription": "Some stuffs about this."}, {"name": "Orange Juice","price": "25","itemid":"07","shortdescription": "Some stuffs about this."}]},{"categorytitle":"Meals","items":[{	"name": "Chicken Biriyani","price": "45","itemid": "079","shortdescription": "Delicious!"}]},{"categorytitle":"Desserts","items":[{"name": "Apple Pie","price": "40","itemid": "95","shortdescription": "Delicious!"},{"name": "Baked Alaska","price": "45","itemid": "495","shortdescription": "Ice-cream and cake topped with browned meringue."},{"name": "German Chocolate Cake","price": "40","itemid": "935","shortdescription": "A layered cake filled and topped with a coconut-pecan frosting."},{"name": "Gulab Jamun","price": "20","itemid": "954","shortdescription": "Decorated with silver foil and almond chips."}]}]';

var items = JSON.parse(dummy);

server.listen(port);
console.log(ip+" : "+port);


app.get('*', function (req, res) {
  
console.log(req.url);  

var parameterStrippedURL = url.parse(req.url).pathname;
if(parameterStrippedURL=="/")
{
  console.log(__dirname +rootDirectory+'/MainInterface.html');
  fs.readFile(__dirname +rootDirectory+'/MainInterface.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    var contenttype = mime.lookup(__dirname +'/htmls/MainInterface.html');    
    res.writeHead(200,{"content-type":contenttype});
    console.log(res.getHeader("content-type"));
    res.end(data);
  });
}
else if(parameterStrippedURL=="/qr")
{
  var ssid = req.query.ssid;
  var key = req.query.key;
  var tableid = req.query.tableId;
  var host = req.query.host;
   
  var qr_svg = qr.image('imenu,'+ssid+','+key+','+host+','+tableid, { type: 'svg' });
  qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
   
  var svg_string = qr.imageSync('imenu,'+ssid+','+key+','+host+','+tableid, { type: 'svg',size:'5' });
  res.writeHead(200,{"content-type":"text/html"});
  res.end(svg_string);
}
else if(parameterStrippedURL=="/listings")
{

    console.log("Serving menu ...");
    res.writeHead(200,{'Content-type':'text/json'});
    
    res.end(dummy);
}
else
{
  fs.readFile(__dirname +"/htmls"+ req.url,
  function (err, data) {
    
    if (err) {
      console.log(err.code);    

      //Error Code analysis
if(err.code=="ENOENT")
{
        var output = "Page / file not found !";
        res.writeHead(404);
        res.end(data);
        
}
else if(err.code=="EISDIR")
{
  var output = "Directory listing is disabled by default";
  res.writeHead(500);
  res.end(data);
}
    }
    else
    {

    var contenttype = mime.lookup(__dirname +rootDirectory+ req.url);    
    res.writeHead(200,{"content-type":contenttype});
    res.end(data);
    }
  });
}

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
var ord = new Order(jsondec.itemid,jsondec.item,jsondec.count,jsondec.tableid,jsondec.orderid,jsondec.price);

ordersplaced.push(ord);

var ih=(JSON.stringify(ord));
console.log(ih);
socket.broadcast.emit('orderAck',ih);
});
socket.on('ackOrder',function(data){
  var decoded = JSON.parse(data);
  var i = 0;
  var jab = 0;
if(decoded.status!="wait"&&decoded.status!="nill"&&decoded.status!="null")
  {
  while(decoded.itemid!=ordersplaced[jab].itemid)
    {
    jab++;
    }
var insertbol = 0;
for(var i=0;i<conforders.length;i++)
  {
    if(decoded.itemid==conforders[i].itemid)
      {
insertbol=1;
break;
      }
  }
  if(insertbol==1)
    {
      conforders[i].count=parseInt(decoded.count)+parseInt(conforders[i].count);
      console.log(conforders[i].count);
    }
    else
      {
        var temob=new particulars(decoded.tableId,decoded.itemid,ordersplaced[jab].itemname,decoded.itemcount,ordersplaced[jab].price);
        conforders.push(temob);
      }
  }
var i = 0;
  while(i!=decoded.length)
    {

      if(users[i].table==decoded.tableId&&users!=null)
        {
          socket.broadcast.to(users[i].socketid).emit('ackRec',data);
        }
        i++;
        break;
    
}
});
});
      

}
});





