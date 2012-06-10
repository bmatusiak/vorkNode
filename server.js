"use strict";

var config = {
     basepath: __dirname+'/mvc',
     vorkpath: __dirname+"/lib/vork",
     webrootPath:  __dirname + '/webroot'
};

var vork = require(config.vorkpath)(config);

//var vork = new Vork(config);

require('NoobHTTP').createServer(vork.NoobConfig);





