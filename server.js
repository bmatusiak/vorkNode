var NoobHTTP = require('NoobHTTP');
var PORT = 8003;


var config = {
     basepath: __dirname + '/mvc'
};

var vork = require(config.basepath+"/vork")(config);
     
NoobHTTP.createServer({home: './webroot/',
            port : Number(process.env.PORT || PORT),
            on404 : function(req, res){
                        return vork.mvc(req, res);    
                    }});