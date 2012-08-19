//"use strict";
process.on('uncaughtException', function(err) {
  console.log('server.js caught error: ',err);
});

var config = {
    port: process.env.app_port || process.env.VCAP_APP_PORT || process.env.PORT || 3000,
    ip: process.env.IP || "0.0.0.0",
     basepath: __dirname+'/mvc',
     vorkpath: __dirname+"/lib/vork",
     webrootPath:  __dirname + '/webroot',
     cache: true//default true for production
};

var vork = require('./lib/vork')(config),
    express = require('express'),
    io = require('socket.io');
    var app = express();
    var server = require('http').createServer(app);
    var io = io.listen(server);
    
app.configure(function () {
    
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
    function addWebroot(path){
        app.use(express.static(path)); 
    }
    for(var i in vork.config.webrootPath){
        addWebroot(vork.config.webrootPath[i]);
    }
    app.use(vork.mvc());
    //app.use(express.static(config.webrootPath));
    //app.use(express.errorHandler());
});

server.listen(config.port,config.ip);
console.log("Server running at http://127.0.0.1:"+config.port+"/")
//app.listen(config.port);