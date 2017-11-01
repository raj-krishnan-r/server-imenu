var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var qr = require('qr-image');
const url = require('url');
  var mime = require('mime');
  var mysql = require('mysql');
  
var fs = require('fs');
var bodyParser = require('body-parser');

//Global Declarations
var itemslist = new Array(); 
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

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
//class of 
function menu(categorytitle)
{
  this.categorytitle=categorytitle;
  this.items=new Array();
}
function item(name,price,itemid,shortdescription,longdescription)
{
  this.name=name;
  this.price=price;
  this.itemid=itemid;
  this.shortdescription=shortdescription;
  this.longdescription=longdescription;
}

function checkExistence(it)
{
  var i=0;
  while(i<itemslist.length)
  {
    if(itemslist[i].categorytitle==it)
    {
      
      return i;
    }
    i++;
  }
  return -1;
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

app.post("/createItem",function(req,res){
  var title = (req.body.ptitle);
  var shdesc = (req.body.pshrtdesc);
  var lndes = (req.body.plngdes);
  var price = req.body.pprice;
  var catid = req.body.pcatid;
  var ing = req.body.ping; 
  var querystring = "insert into items values (0,'"+title+"','"+price+"','"+shdesc+"','"+ing+"','"+catid+"','"+lndes+"')";


  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dbase001",
    database: "imenu"
  });


  
  con.connect(function(err) {
    if (err) throw err;
    con.query(querystring, function (err, result, fields) {
      if (err) throw err;

      res.writeHead(200,{'Content-type':'text/html'});
      res.end("1");
      
     

    });
  });




});
app.get('*', function (req, res) {
  

var parameterStrippedURL = url.parse(req.url).pathname;
if(parameterStrippedURL=="/")
{
  fs.readFile(__dirname +rootDirectory+'/MainInterface.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    var contenttype = mime.lookup(__dirname +'/htmls/MainInterface.html');    
    res.writeHead(200,{"content-type":contenttype});
    res.end(data);
  });
}
else if(parameterStrippedURL=="/qr")
{
  var ssid = req.query.ssid;
  var key = req.query.key;
  var tableid = req.query.tableId;
  var host = req.query.host;
   
  //var qr_svg = qr.image('imenu,'+ssid+','+key+','+host+','+tableid, { type: 'svg' });
  //qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
   
  var svg_string = qr.imageSync('imenu,'+ssid+','+key+','+host+','+tableid, { type: 'svg',size:'5' });
  res.writeHead(200,{"content-type":"text/html"});
  var resultas = tableid+"$"+svg_string;
  
  res.end(resultas);
  

//res.end("[{tableid:"+tableid+",svg:'"+svg_string+"'}]");
}/*
else if(parameterStrippedURL=="/listings")
{

    res.writeHead(200,{'Content-type':'text/json'});
    
    res.end(dummy);
}*/
else if(parameterStrippedURL=="/listings")
{

  var reslt;
  var resultt = new Array();
  var mysql = require('mysql');
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "dbase001",
      database: "imenu"
    });
    
    con.connect(function(err) {
      if (err) throw err;
      con.query("select category.cat_title,items.* from category,items where items.cat_id in (select cat_id from category) and category.cat_id = items.cat_id;", function (err, result, fields) {
        if (err) throw err;  
     
       var i = 0;
       while(result.length>i)
       {
        var ob = result[i];
        
        if(checkExistence(ob.cat_title)>-1)
         
         {
        
          var itob = new item(ob.title,ob.price,ob.item_id,ob.description,ob.longdescription);

          itemslist[checkExistence(result[i].cat_title)].items.push(itob);
         }
         else
         {
           var men = new menu(ob.cat_title);
           var po = new item(ob.title,ob.price,ob.item_id,ob.description,ob.longdescription);
           men.items.push(po);
           itemslist.push(men);
         }




        i++; 

        //Nested loop is not ran, since it is creating problems, since the queries are excuted async.

       }
       
  //console.log(itemslist);
  res.writeHead(200,{'Content-type':'text/json'});
  res.end(JSON.stringify((itemslist)));
  itemslist=new Array();
      });
    });
































}
else if(parameterStrippedURL=="/loadCategories")
{
var reslt;
var resultt = new Array();
var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dbase001",
    database: "imenu"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM category", function (err, result, fields) {
      if (err) throw err;

      res.writeHead(200,{'Content-type':'text/json'});
      res.end(JSON.stringify(result));
      
     

    });
  });


}
else
{
  fs.readFile(__dirname +"/htmls"+ req.url,
  function (err, data) {
    
    if (err) {
//      console.log(err.code);    

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
    console.log("Table : "+data+" SocketId:"+socket.id);
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
    }
    else
      {
        var temob=new particulars(decoded.tableId,decoded.itemid,ordersplaced[jab].itemname,decoded.itemcount,ordersplaced[jab].price);
        conforders.push(temob);
      }
  }
var i = 0;
  while(i<users.length)
    {
      if(users[i].table==decoded.tableId&&users!=null)
        {
          socket.broadcast.to(users[i].socketid).emit('ackRec',data);
        }
        i++;
    
}

});
});
      

}
});
