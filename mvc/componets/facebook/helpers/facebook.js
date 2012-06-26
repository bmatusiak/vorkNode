var fb = require('facebook-js');
var request = require("request");
module.exports = function(vork){
    return new FacebookAPI(vork);   
};
function FacebookAPI(vork){
    var self = this;
    self.vork = vork;
    
    if(!vork.globals.facebook.sessions[vork.req.sessionID]) vork.globals.facebook.sessions[vork.req.sessionID] = {};
    
    self.authUrl = function(callback_url,scope) {
       return fb.getAuthorizeUrl({
            client_id: vork.globals.facebook.fb_app_id,
            redirect_uri: callback_url,
            scope: scope
        })
    };
    
    self.authUrl = function(code,callback_url,next) {
        fb.getAccessToken(
            vork.globals.facebook.fb_app_id,
            vork.globals.facebook.fb_app_secret,
            code,
            callback_url,
            function(error, access_token, refresh_token) {
                vork.globals.facebook.sessions[vork.req.sessionID].fb_token = access_token;
                next();
        });
    }
    
    self.graph = function(method,connector,data,callback) {
        fb.apiCall(method, connector,data, callback);
    };

    self.app = function(method,connector,data,callback) {
        data.access_token = vork.globals.facebook.fb_app_token;
        fb.apiCall(method, connector,data, function(error, response, body){
            callback(error, response, body);
        });
    };
    
    self.me = function(method,connector,data,callback) {
        data.access_token = vork.globals.facebook.sessions[vork.req.sessionID].fb_token;
        fb.apiCall(method, '/me/' + connector,data, callback);
    };

return self;
};