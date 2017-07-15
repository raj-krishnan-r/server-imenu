var express = require('express');
var http = require('http');
var io = require('socket.io')(http);
var config = require('cloud-env')




var server_port = config.PORT || 8080;
var server_ip_address = config.IP || '127.0.0.1';


var port = process.env.OPENSHIFT_NODEJS_PORT || 8080  
, ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var app = express();


app.get('/',function(req,res)
{



console.log('Request Recieved');

   res.sendFile(__dirname + '/htmls/connect.html');



});

io.on('connection',function(socket){
socket.on('Data',function(msg)
{
io.emit('retrn',msg);
});


});

app.listen(port,ip,function(){

console.log('Server up and running @ '+port+':'+ip);


});



