"use strict";
var url = require("url");
var fs = require("fs");
var path = require("path");
var ejs = require('ejs');
 
//var path = require("path");
function Vork(options) {
    var thisVork = this;

    //Config Setup
    var configDefaults = {
        basepath: __dirname,
        DEBUG: false,
        modelsPath: 'models',
        viewsPath: 'views',
        elementsPath: 'elements',
        controlersPath: 'controlers',
        componetsPath: 'componets',
        layoutsPath: 'layouts',
        webrootPath: 'webroot',
        helpersPath: 'helpers',
        DS: '/',
        cache: true,// set to for production
        EOL: '\r\n',
        dbConfig: 'db',
        port: Number(process.env.PORT || 80),
        globals: {}
    };

    this.config = {};

    if (typeof(options) === 'object') {
        for (var property in configDefaults) {
            if (!options[property]) this.config[property] = configDefaults[property];
            else this.config[property] = options[property];
        }
    }
    
    var mvcFolders = {
        model:thisVork.config.modelsPath,
        controler:thisVork.config.controlersPath,
        view:thisVork.config.viewsPath,
        element:thisVork.config.elementsPath,
        layout:thisVork.config.layoutsPath,
        helper:thisVork.config.helpersPath,
        componet:thisVork.config.componetsPath
    };
    
    var mvcFileExt = {
        model:'js',
        controler:'js',
        view:'html',
        element:'html',
        layout:'html',
        helper:'js'
    };
    
    var loadedComponets = {};
    var componetsDirs = fs.readdirSync(thisVork.config.basepath + thisVork.config.DS + mvcFolders.componet);
    for (var i = 0; i < componetsDirs.length; i++) {
        var dir = componetsDirs[i], long_dir = thisVork.config.basepath + thisVork.config.DS + mvcFolders.componet + thisVork.config.DS + dir;
        loadedComponets[dir] = require(long_dir+"/init.js")(this.config.globals)
    }
    
    //Object Helpers
    this.tools = {
        mvcFilePath: function(type,name){
            for(var componet in loadedComponets){
                var checkFile = loadedComponets[componet].basepath + thisVork.config.DS + mvcFolders[type] + thisVork.config.DS + name + "." + mvcFileExt[type]
                if(thisVork.tools.isFile(checkFile)){
                    return checkFile;
                }
            }
            return thisVork.config.basepath + thisVork.config.DS + mvcFolders[type] + thisVork.config.DS + name + "." + mvcFileExt[type];   
        },
        cloneConfig: function(config) {
            function Clone() {}
            return (function(obj) {Clone.prototype = obj;return new Clone();})(config);
        },
        newSandbox: function(mvc){
            return new RequestSandbox(mvc);
        },
        isFile: function(file) {
            try {
                fs.closeSync(fs.openSync(file, 'r'));
                return true;
            }
            catch (e) {
                return false;
            }
        }
    };
    
    function RequestSandbox(req){
        var thisSandbox = this;
        
        this.controler = null;
        this.layout = 'default';
        this.action = 'index';
        this.view = null;
        this.params = [];
        this.contentType = 'text/html';
        this.db = null;
        this.req = req;
        this.globals = thisVork.config.globals;
        this.url = url.parse(req.url);
        
        //Parse Params
        (function(){//for codeFolding ;P
            var filename = thisSandbox.url.pathname;
            if (filename == '/') filename = "/index";
            thisSandbox.params = filename.substring(1, filename.length).split('/');
            thisSandbox.params.reverse();
            if (thisSandbox.params.length) {
                thisSandbox.controler = thisSandbox.params[thisSandbox.params.length - 1];
                thisSandbox.params.pop();
            }
            if (thisSandbox.params.length) {
                thisSandbox.action = thisSandbox.params[thisSandbox.params.length - 1];
                thisSandbox.params.pop();
            }
            thisSandbox.params.reverse();
        })();
        
        this.is = {
            file: thisVork.tools.isFile
        };
        this.get = {
            file: function(fileName){
                return fs.readFileSync(fileName, "utf8");   
            },
            config: thisVork.tools.cloneConfig(thisVork.config)
        };
        this.load = {
            //Objects
            controler: function(name,action,callback) {
                var controler = _mvcObject(thisVork.tools.mvcFilePath("controler",name),thisSandbox);
                if(typeof(controler[action]) === "function"){
                    var loaded = controler[action](callback);//actions require a callback
                    if(loaded)
                        callback(loaded);
                    //return controler[action](callback);//actions require a callback
                }else{
                    callback({});
                }
            },
            helper: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _mvcObject(thisVork.tools.mvcFilePath("helper",name),obj);
            },
            model: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _mvcObject(thisVork.tools.mvcFilePath("controler",name),obj);
            },//EJS Tempaltes
            view: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _template(thisVork.tools.mvcFilePath("view",name),obj);
            },
            element: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _template(thisVork.tools.mvcFilePath("element",name),obj);
            },
            layout: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _template(thisVork.tools.mvcFilePath("layout",name),obj);
            }
        };
        
        function _mvcObject(filePath,obj) {// controlers componets helpers models
            if (thisSandbox.is.file(filePath)) {
                var object = require(filePath);
                if (typeof(object) === 'function') 
                    object = object(obj);
                if(!thisSandbox.get.config.cache)
                    delete require.cache[filePath];
                return object;
            }
            else return null;
        }
        function  _template(templateFile,obj) {// views elements layouts
            if (thisSandbox.is.file(templateFile)) {
                return ejs.render(thisSandbox.get.file(templateFile),obj)
            }
            else return null;
        }
        
    }
}

Vork.prototype.mvc = function mvc() {
    var thisVork = this;
    function compleateRequest(obj, res) {
        
         res.send(obj.content, obj.headers, obj.code);
        /*
        res.writeHead(obj.code, obj.headers);
        res.end(obj.req.method === "HEAD" ? "" : obj.content);
        */
    }

    function checkRequest(obj, res) {
        if (obj && obj.code === 200) {
            compleateRequest(obj, res);
            return true;
        }
        if (obj && obj.code === 400) {
            compleateRequest(obj, res);
            return true;
        }
        return false;
    }
    return function(req, res, next){
        thisVork.loadAction(req,
            function(requestObj){
                if(!checkRequest(requestObj, res)) next();
            });
    };
};

Vork.prototype.loadAction = function loadAction(req,callback) {
    if (this.config.DEBUG) console.log(req.url);
    var thisVork = this;
    var sandbox = this.tools.newSandbox(req);
    //sandbox.req = req;
    
    var obj = {
        content: null,
        headers: null,
        code: 404,
        req: req
    };
    //obj.req = req;
    
    var goodControler = sandbox.is.file(this.tools.mvcFilePath("controler",sandbox.controler));
    var goodView = sandbox.is.file(this.tools.mvcFilePath("view",sandbox.view));
    if(goodControler || goodView){
        sandbox.view = ""+sandbox.controler;//save controlerName to viewName // hack to clone to string
        
        if(goodControler){//load controler
            parseControler();
        }else if(goodView){//load view
            parseView();
            parseLayout();
            compleateRequest();
        }
    }else{
        compleateRequest();
    }
    function parseControler(){
        sandbox.load.controler(sandbox.controler,sandbox.action,
            function(obj){
                sandbox.controler = obj;
                parseView();
                parseLayout();
                compleateRequest();
            });
    }
    function parseView(){
        sandbox.view = sandbox.load.view(sandbox.view);
        obj.content = sandbox.view;
    }
    function parseLayout(){
        //load layout
        if(sandbox.layout){
            sandbox.layout= sandbox.load.layout(sandbox.layout);
            obj.content = sandbox.layout;
        }
    }
    function compleateRequest(){
        var code = 200;
        if(sandbox.fail)
            code = sandbox.fail.code || 404;
        
        if (obj.content) {
            obj.headers = {
                "Content-Type": sandbox.contentType,
                "Content-Length": obj.content.length
            };
            if (!thisVork.config.DEBUG) obj.headers["Cache-Control"] = "public";
            obj.code = code;
        }
        callback(obj);
    }
};

module.exports = function(opt) {
    return new Vork(opt);
};