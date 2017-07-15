var express = require('express');
var http = require('http');
var io = require('socket.io')(http);
var config = require('cloud-env')


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080  
, ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var app = express();


console.log('Server up and running @ '+port+':'+ip);

app.get('/',function(req,res)
{

console.log('Request Recieved');

   res.sendFile(__dirname + '/htmls/connect.html');

});



io.on('connection', function(socket){
  
socket.on('Data',function(msg)
{
io.emit('retrn',msg);

});

console.log('a user connected');
});

var server = app.listen(port,ip,function(){});
io.listen(server);
