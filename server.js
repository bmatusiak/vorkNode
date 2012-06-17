"use strict";


var config = {
    port: process.env.app_port || process.env.PORT || 3000,
     basepath: __dirname+'/mvc',
     vorkpath: __dirname+"/lib/vork",
     webrootPath:  __dirname + '/webroot',
     cache: false//default true for production
};

var port = config.port;

var vork = require('./lib/vork');
vork = vork(config)

var //io = require('socket.io'),
    express = require('express'),
    app = express.createServer();
 
app.configure(function () {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
    app.use(vork.mvc());
    app.use(express.static(config.webrootPath));
    app.use(express.errorHandler());
});
 
app.listen(port);
/*
var sio = io.listen(app);
 
sio.sockets.on('connection', function (socket) {
    console.log('A socket connected! == '+ socket);
    socket.on('message', function (data) {
        socket.emit('Message Revieved');
        console.log('A message! == '+ data);
    });
    socket.on('disconnect', function (data) {console.log('A socket disconnected! == '+ socket);});
});*/