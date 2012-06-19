"use strict";
var url = require("url");
var fs = require("fs");
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
        layoutsPath: 'layouts',
        webrootPath: 'webroot',
        helpersPath: 'helpers',
        DS: '/',
        cache: true,// set to for production
        EOL: '\r\n',
        dbConfig: 'db',
        port: Number(process.env.PORT || 80)
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
        helper:thisVork.config.helpersPath
    };
    
    var mvcFileExt = {
        model:'js',
        controler:'js',
        view:'html',
        element:'html',
        layout:'html',
        helper:'js'
    };
    
    //Object Helpers
    this.tools = {
        mvcFilePath: function(type,name){
            return thisVork.config.basepath + thisVork.config.DS + mvcFolders[type] + thisVork.config.DS + name + "." + mvcFileExt[type];   
        },
        clone: function(obj) {
            function Clone() {}
            return (function(obj) {Clone.prototype = obj;return new Clone();})(obj);
        },
        newSandbox: function(mvc){
            return new RequestSandbox(mvc);
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
        
        //Parse Params
        (function(){//for codeFolding ;P
            var urlObj = url.parse(req.url);
            var filename = urlObj.pathname;
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
            file: function(file) {
                try {
                    fs.openSync(file, 'r');
                    return true;
                }
                catch (e) {
                    return false;
                }
            }
        };
        this.get = {
            file: function(fileName){
                return fs.readFileSync(fileName, "utf8");   
            },
            config: thisVork.tools.clone(thisVork.config)
        };
        this.load = {
            controler: function(name,action,obj) {
                var controler = _mvcObject(thisVork.tools.mvcFilePath("controler",name),thisSandbox);
                return controler[action](obj);
            },
            helper: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _mvcObject(thisVork.tools.mvcFilePath("helper",name),obj);
            },
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
            },
            model: function(name,obj) {
                if(!obj) obj = thisSandbox;
                return _mvcObject(thisVork.tools.mvcFilePath("controler",name),obj)
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
        res.writeHead(obj.code, obj.headers);
        res.end(obj.req.method === "HEAD" ? "" : obj.content);
    }

    function checkRequest(obj, res) {
        if (obj && obj.code === 200) {
            compleateRequest(obj, res);
            return true;
        }
        return false;
    }
    return function(req, res, next){
        try{
            if(!checkRequest(thisVork.loadAction(req), res)){
                    next();
            }
        }catch(e){
            console.log(e);
            next();
        }
    };
};

Vork.prototype.loadAction = function loadAction(req) {
    var sandbox = this.tools.newSandbox(req);
    //sandbox.req = req;
    
    var obj = {
        content: null,
        headers: null,
        code: 404,
        req: req
    };
    //obj.req = req;

    if(sandbox.is.file(this.tools.mvcFilePath("controler",sandbox.controler)) || sandbox.is.file(this.tools.mvcFilePath("view",sandbox.view))){
        sandbox.view = ""+sandbox.controler;//save controlerName to viewName // hack to clone to string
        //load controler
        sandbox.controler = sandbox.load.controler(sandbox.controler,sandbox.action);
        
        //load view
        sandbox.view = sandbox.load.view(sandbox.view);
        obj.content = sandbox.view;
        
        //load layout
        if(sandbox.layout){
            sandbox.layout= sandbox.load.layout(sandbox.layout);
            obj.content = sandbox.layout;
        }
    }
    

    if (obj.content) {
        obj.headers = {
            "Content-Type": sandbox.contentType,
            "Content-Length": obj.content.length
        };
        if (!this.config.DEBUG) obj.headers["Cache-Control"] = "public";
        obj.code = 200;
        return obj;
    }
    return obj;
};

module.exports = function(opt) {
    return new Vork(opt);
};