var express = require('express');
var http = require('http').createServer(handler);
var io = require('socket.io')(http);
var config = require('cloud-env')

var fs = require('fs')





var port = process.env.OPENSHIFT_NODEJS_PORT || 8080  
, ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var app = express();



http.listen(port,ip,function()
        {console.log('Server up at port '+port+' and over IP http://'+ip+':'+port);}
                );


io.on('connection',function(socket){


console.log("A client is connected.");

});






function handler(req,res)
{

var forwardFile=__dirname+'/htmls/connect.html';
fs.readFile(forwardFile,function(err,data)
{
if(err){
res.writeHead(404);
return res.end('Request page is not found.');
}
res.writeHead(200,{'Content-Type':'text/html'});
res.end(data);
});
}






