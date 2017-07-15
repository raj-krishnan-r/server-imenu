var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';


app.get('/',function(req,res)
{
  res.sendFile(__dirname + '/htmls/connect.html');
});

io.on("connection",function(socket)
{

socket.on('Data',function(msg){

console.log(msg);

io.emit('retrn',msg);



});
console.log('User Connected');

socket.on('disconnect',function(){
console.log('User Disconnected');
});

});




http.listen(server_port,server_ip_address,function(){
console.log('listening on! ');

});
