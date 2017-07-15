var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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




http.listen(3000,function(){
console.log('listening on! ');

});
