"use strict";

var config = {
    port:8080,
     basepath: __dirname+'/mvc',
     vorkpath: __dirname+"/lib/vork",
     webrootPath:  __dirname + '/webroot'
};

var vork = require(config.vorkpath)(config);

//var vork = new Vork(config);

require('NoobHTTP').createServer(vork.NoobConfig);

console.log('lol')



