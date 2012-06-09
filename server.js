var NoobHTTP = require('NoobHTTP');
var PORT = 8003;

     
NoobHTTP.createServer({home: './webroot/',
            port : Number(process.env.PORT || PORT),
            on404 : function(req, res){
                        return false;//needs to return default 404 headers, if true then leave this function to decide on what happens         
                    }});