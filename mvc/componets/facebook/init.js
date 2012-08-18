//var fb = require('facebook-js');
var request = require("request");
module.exports = function(globals){
    var init = {};
    
    init.ready = false;
    
    if (!globals.facebook) {
        globals.facebook = {};
        
        globals.facebook.fb_app_id = process.env.FACEBOOK_APP_ID || '460231627321844';
        globals.facebook.fb_app_secret = process.env.FACEBOOK_SECRET || '322f0e88b1ed4bea89bb1b64991ab2f0';
        globals.facebook.fb_app_token = null;
    
        globals.facebook.sessions = {};
        
        var url = 'https://graph.facebook.com/oauth/access_token?client_id='+globals.facebook.fb_app_id+'&client_secret='+globals.facebook.fb_app_secret+'&grant_type=client_credentials';
        request({
            method: "GET",
            uri: url
          },
            function(error, response, body){
                if(!error){
                    globals.facebook.fb_app_token = body.replace("access_token=","");
                    init.ready = true;
                    console.log("FB APP TOKEN : "+globals.facebook.fb_app_token); 
                }else{
                    console.log("Facebook App Token Not Good!");   
                }
            });
    }
    
    init.basepath = __dirname;
    
    init.sessionInit = function(vork){
        if(!globals.facebook.sessions[vork.req.sessionID]) globals.facebook.sessions[vork.req.sessionID] = {};
    };
    
    return init;
};