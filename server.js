"use strict";

var config = {
    port: process.env.app_port || process.env.PORT || 3000,
     basepath: __dirname+'/mvc',
     vorkpath: __dirname+"/lib/vork",
     webrootPath:  __dirname + '/webroot',
     cache: false//default true for production
};

var vork = require('./lib/vork')(config),
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
 
app.listen(config.port);