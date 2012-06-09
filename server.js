var NoobHTTP = require('NoobHTTP');
var PORT = 8003;


var config = {
     basepath: __dirname + '/mvc',
     webrootFolder:  __dirname + '/webroot'
};

var vork = require(config.basepath+"/vork")(config);
// config now becomes vork.config

var NoobHTTPConfig = {
          home: vork.config.webrootFolder+"/",
          port : Number(process.env.PORT || PORT),
          on404 : function(req, res){
               return vork.mvc(req, res);    
          }};
          
NoobHTTP.createServer(NoobHTTPConfig);