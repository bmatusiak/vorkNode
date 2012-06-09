var NoobHTTP = require('NoobHTTP');
var PORT = 8003;



var vork = require("./mvc/vork")();
     
NoobHTTP.createServer({home: './webroot/',
            port : Number(process.env.PORT || PORT),
            on404 : function(req, res){
                        return vork.mvc(req, res);    
                    }});