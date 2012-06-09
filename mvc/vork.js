var url = require("url");

function Vork(options) {
     var self = this;
     
     this.config = {}

     if(typeof(options) === 'object'){
          this.config.basepath = options.basepath || __dirname;
     }

     this.tools = {
          checkFile : function(file) {
               try {
                    fs.openSync(file + '.js', 'r')
                    return true;
               }
               catch (e) {
                    return false;
               }
          }
     };
     this.get = {
          view: function(viewName, dataObj) {


          },
          layout: function(layoutName, dataObj) {


          },
          element: function(elementName, dataObj) {


          }
     };

};

Vork.prototype.mvc = function mvc(req, res) {
     var self = this;

     function compleateRequest(obj, res) {
          res.writeHead(obj.code, obj.headers);
          res.end(obj.req.method === "HEAD" ? "" : obj.content);
     }

     function checkRequest(obj, res) {
          if (obj && obj.code === 200) {
               compleateRequest(obj, res)
               return true;
          }
          return false;
     }

     return checkRequest(this.loadAction(req), res);
};

Vork.prototype.loadAction = function loadAction(req) {
     var DidIFail = false;
     var defaults = {};
     defaults.controler = {};
     defaults.layout = 'default';
     defaults.action = 'index';
     defaults.view = null;
     defaults.params = [];
     defaults.contentType = 'text/html';

     var obj = {
          content: null,
          headers: null,
          code: 404,
          req: null
     };
     obj.req = req;
     //var defaults = new vork.mvcDefaults();
     var filename = url.parse(req.url).pathname;
     if (filename == '/') filename = "/index";
     defaults.params = filename.substring(1, filename.length).split('/');

     defaults.params.reverse();
     if (defaults.params.length) {
          defaults.controler = defaults.params[defaults.params.length - 1];
          defaults.params.pop();
     }
     if (defaults.params.length) {
          defaults.action = defaults.params[defaults.params.length - 1];
          defaults.params.pop();
     }
     defaults.params.reverse();

     var controlerName = defaults.controler;
     if (this.tools.checkFile(this.config.basepath + '/controlers/' + defaults.controler)) {
          defaults.controler = require('./controlers/' + defaults.controler)[defaults.action];
          defaults.controler = defaults.controler(vork.Sandbox(defaults));
          DidIFail = false;
     }
     else {
          defaults.controler = null;
          DidIFail = true;
     }
     if (defaults.view === null) defaults.view = controlerName;
     if (this.tools.checkFile(this.config.basepath + '/views/' + defaults.view) && defaults.view !== false) {
          defaults.view = require('./views/' + defaults.view)[defaults.view];
          if (typeof(defaults.view) === 'function') {
               defaults.view = defaults.view(vork.Sandbox(defaults));
               obj.content = defaults.view;
               DidIFail = false;
          }
          else DidIFail = true;
     }
     else {
          DidIFail = true;
          defaults.view = null;
     }

     if (vork.checkFile(this.config.basepath + '/layouts/' + defaults.layout)) {
          defaults.layout = require('./layouts/' + defaults.layout)[defaults.layout];
          defaults.layout = defaults.layout(vork.Sandbox(defaults));
          obj.content = defaults.layout;
     }
     else {
          defaults.view = null;
     }

     if (DidIFail) return obj;

     if (obj.content) {
          obj.headers = {
               "Content-Type": defaults.contentType,
               "Content-Length": obj.content.length
          };
          if (!DEBUG) obj.headers["Cache-Control"] = "public";
          obj.code = 200;
          return obj;
     }
     return obj;
}


module.exports = function(options) {
     return new Vork(options);
};