"use strict";


var config = {
    port: process.env.app_port || process.env.PORT || 3000,
     basepath: __dirname+'/mvc',
     vorkpath: __dirname+"/lib/vork",
     webrootPath:  __dirname + '/webroot',
     cache: false//default true for production
};

/*var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\nApp (vork-node) is running on Node.JS ' + process.version);
}).listen(process.env.app_port || 3000);
*/ 

var port = config.port;

var vork = require('./lib/vork');
vork = vork(config)

var io = require('socket.io'),
    express = require('express'),
    app = express.createServer();
 
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
    app.use(function (req, res) {
         vork.mvc(req, res);
    });
    app.use(express.static(__dirname + '/webroot'));
    app.use(express.errorHandler());
});
 
app.listen(port);
var sio = io.listen(app);
 
sio.sockets.on('connection', function (socket) {
    console.log('A socket connected! == '+ socket);
    console.log(socket);
});