var NoobHTTP = require('NoobHTTP');
var PORT = 8003;


var config = {
     port: Number(process.env.PORT || PORT),
     basepath: __dirname + '/mvc',
     webrootFolder:  __dirname + '/webroot'
};

var vork = require(config.basepath+"/vork")(config);
// config now becomes vork.config

var NoobHTTPConfig = {
          home: vork.config.webrootFolder+"/",
          port : vork.config.port,
          on404 : vork.mvc(req, res)
};
          
NoobHTTP.createServer(NoobHTTPConfig);