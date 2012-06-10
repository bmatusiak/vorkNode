//var NoobHTTP = require('NoobHTTP');

var config = {
     basepath: __dirname + '/mvc',
     webrootFolder:  __dirname + '/webroot'
};

var vork = require(config.basepath+"/vork")(config);

//var vork = new Vork(config);

// config now becomes vork.config

require('NoobHTTP').createServer({
          home: vork.config.webrootFolder+"/",
          port : vork.config.port,
          on404 : function(req, res){
               return vork.mvc(req, res);
          }
});

