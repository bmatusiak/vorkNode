//export vork
var vork = exports;

//Depends
var fs = require("fs");
var readFileSync = require("fs").readFileSync;
var sys = require("util");
var url = require("url");

//DEBUG
var DEBUG = false;

(function(){
     
    vork.config = {};
    
    vork.get = {config: vork.config,
                basepath:__dirname,
                helper:function(helperName){if(vork.checkFile(vork.get.basepath+'/helpers/'+helperName)){
                         return require(vork.get.basepath+'/helpers/'+helperName);}}
                };
                
    vork.load = {config: function(configFile){if(vork.checkFile(vork.get.basepath+'/'+configFile)){
                         return require(vork.get.basepath+'/'+configFile);}},
                 model: function(modelFile){if(vork.checkFile(vork.get.basepath+'/models/'+modelFile)){
                            modelFile = require(vork.get.basepath+'/models/'+modelFile);
                            modelFile.init(vork.config.db);
                            return modelFile;}
                        }
                };
    
    
    vork.Sandbox = function(curMVCrquest){ 
        return {mvc:curMVCrquest,   //sandbox gets sent to all MVC objects so the oject can overide or gather info
                load:vork.load,                 //also keeps MVC object from Killing the vork object
                get:vork.get};
    };
    vork.mvc = function() {
        vork.config = vork.load.config('config');
        
        function loadAction(req){
            var DidIFail = false;
            var defaults = {};
            defaults.controler = {};
            defaults.layout = 'default';
            defaults.action = 'index';
            defaults.view = null;
            defaults.params = [];
            defaults.contentType = 'text/html';
            
            var obj = {content: null, headers: null, code: 404, req: null};
            obj.req = req;
            //var defaults = new vork.mvcDefaults();
            var filename = url.parse(req.url).pathname;
            if(filename == '/') filename = "/index";
                defaults.params = filename.substring(1, filename.length).split('/');
            
            defaults.params.reverse();
            if(defaults.params.length){
                defaults.controler = defaults.params[defaults.params.length-1];
                defaults.params.pop();
            }
            if(defaults.params.length){  
                defaults.action = defaults.params[defaults.params.length-1];
                defaults.params.pop();
            }
            defaults.params.reverse(); 
            
            var controlerName = defaults.controler;
            if(vork.checkFile(vork.get.basepath+'/controlers/'+defaults.controler)){
                defaults.controler = require('./controlers/'+defaults.controler)[defaults.action];
                defaults.controler = defaults.controler(vork.Sandbox(defaults));
                DidIFail = false;
            }else{
                defaults.controler = null  ;
                 DidIFail = true;
            }
            if(defaults.view === null) defaults.view = controlerName;
            if(vork.checkFile(vork.get.basepath+'/views/'+defaults.view) && defaults.view !== false){
                defaults.view = require('./views/'+defaults.view)[defaults.view];
                if(typeof(defaults.view) === 'function'){
                    defaults.view = defaults.view(vork.Sandbox(defaults));
                    obj.content = defaults.view;
                    DidIFail = false;
                }else DidIFail = true;
            }else{
                DidIFail = true;
                defaults.view = null;   
            }
            
            if(vork.checkFile(vork.get.basepath+'/layouts/'+defaults.layout)){
                defaults.layout = require('./layouts/'+defaults.layout)[defaults.layout];
                defaults.layout = defaults.layout(vork.Sandbox(defaults));
               obj.content = defaults.layout;
            }else{
                defaults.view = null;
            }
            
            if(DidIFail) return obj;
            
            if(obj.content){
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
        
        function load(req) {
            var obj = {content: null, headers: null, code: 404, req: null}
            obj.req = req;
            if (req.method === "GET" || req.method === "HEAD") {
                var filename = './webroot'+url.parse(req.url).pathname;
                //filename = filename.replace(' ', '\\ ')
                try{
                    obj.code = 200;
                    obj.content = readFileSync(filename);
                    obj.headers = {
                            "Content-Type": vork.mime.lookupExtension(filename),
                            "Content-Length": obj.content.length
                        };
                        if (!DEBUG) obj.headers["Cache-Control"] = "public";
                        sys.puts("static file " + filename + " loaded");
                        return obj;
                }catch(e){
                    obj.code = 400;
                    return obj;
                }
            }else{
                return obj;
            }
        }
        
        function compleateRequest(obj,res){
            res.writeHead(obj.code, obj.headers);
            res.end(obj.req.method === "HEAD" ? "" : obj.content);   
        }
        function checkRequest(obj,res){
            if(obj && obj.code === 200){
                compleateRequest(obj,res)
                return true;
            }
        }
        //constructed
        return function(req, res) {
            if(req.url == '/') req.url = '/index';
            var sTime = new Date().getTime();
            if(!checkRequest(load(req), res)){
                if(!checkRequest(loadAction(req), res)){
                    vork.notFound(req, res);
                }
            }   
            var eTime = new Date().getTime();
            
        };
    };
    
    vork.checkFile = function(file){
        try{
            fs.openSync(file+'.js','r')   
            return true;
        }catch(e){
            return false;
        }
    }
    vork.notFound = function(req, res) {
        var NOT_FOUND = "Not Found\n";
        res.writeHead(404, {
            "Content-Type": "text/plain",
            "Content-Length": NOT_FOUND.length
        });
        res.end(NOT_FOUND);
    };
    // stolen from jack- thanks
    vork.mime = {
        // returns MIME type for extension, or fallback, or octet-steam
        extname: function(path) {
            var index = path.lastIndexOf(".");
            return index < 0 ? "" : path.substring(index);
        },
        
        // returns MIME type for extension, or fallback, or octet-steam
        lookupExtension: function(ext, fallback) {
            ext = this.extname(ext);
            return this.TYPES[ext.toLowerCase()] || fallback || 'application/octet-stream';
        },
    
        // List of most common mime-types, stolen from Rack.
        TYPES: {
            ".3gp": "video/3gpp",
            ".a": "application/octet-stream",
            ".ai": "application/postscript",
            ".aif": "audio/x-aiff",
            ".aiff": "audio/x-aiff",
            ".asc": "application/pgp-signature",
            ".asf": "video/x-ms-asf",
            ".asm": "text/x-asm",
            ".asx": "video/x-ms-asf",
            ".atom": "application/atom+xml",
            ".au": "audio/basic",
            ".avi": "video/x-msvideo",
            ".bat": "application/x-msdownload",
            ".bin": "application/octet-stream",
            ".bmp": "image/bmp",
            ".bz2": "application/x-bzip2",
            ".c": "text/x-c",
            ".cab": "application/vnd.ms-cab-compressed",
            ".cc": "text/x-c",
            ".chm": "application/vnd.ms-htmlhelp",
            ".class": "application/octet-stream",
            ".com": "application/x-msdownload",
            ".conf": "text/plain",
            ".cpp": "text/x-c",
            ".crt": "application/x-x509-ca-cert",
            ".css": "text/css",
            ".csv": "text/csv",
            ".cxx": "text/x-c",
            ".deb": "application/x-debian-package",
            ".der": "application/x-x509-ca-cert",
            ".diff": "text/x-diff",
            ".djv": "image/vnd.djvu",
            ".djvu": "image/vnd.djvu",
            ".dll": "application/x-msdownload",
            ".dmg": "application/octet-stream",
            ".doc": "application/msword",
            ".dot": "application/msword",
            ".dtd": "application/xml-dtd",
            ".dvi": "application/x-dvi",
            ".ear": "application/java-archive",
            ".eml": "message/rfc822",
            ".eps": "application/postscript",
            ".exe": "application/x-msdownload",
            ".f": "text/x-fortran",
            ".f77": "text/x-fortran",
            ".f90": "text/x-fortran",
            ".flv": "video/x-flv",
            ".for": "text/x-fortran",
            ".gem": "application/octet-stream",
            ".gemspec": "text/x-script.ruby",
            ".gif": "image/gif",
            ".gz": "application/x-gzip",
            ".h": "text/x-c",
            ".hh": "text/x-c",
            ".htm": "text/html",
            ".html": "text/html",
            ".ico": "image/vnd.microsoft.icon",
            ".ics": "text/calendar",
            ".ifb": "text/calendar",
            ".iso": "application/octet-stream",
            ".jar": "application/java-archive",
            ".java": "text/x-java-source",
            ".jnlp": "application/x-java-jnlp-file",
            ".jpeg": "image/jpeg",
            ".jpg": "image/jpeg",
            ".js": "application/javascript",
            ".json": "application/json",
            ".log": "text/plain",
            ".m3u": "audio/x-mpegurl",
            ".m4v": "video/mp4",
            ".man": "text/troff",
            ".mathml": "application/mathml+xml",
            ".mbox": "application/mbox",
            ".mdoc": "text/troff",
            ".me": "text/troff",
            ".mid": "audio/midi",
            ".midi": "audio/midi",
            ".mime": "message/rfc822",
            ".mml": "application/mathml+xml",
            ".mng": "video/x-mng",
            ".mov": "video/quicktime",
            ".mp3": "audio/mpeg",
            ".mp4": "video/mp4",
            ".mp4v": "video/mp4",
            ".mpeg": "video/mpeg",
            ".mpg": "video/mpeg",
            ".ms": "text/troff",
            ".msi": "application/x-msdownload",
            ".odp": "application/vnd.oasis.opendocument.presentation",
            ".ods": "application/vnd.oasis.opendocument.spreadsheet",
            ".odt": "application/vnd.oasis.opendocument.text",
            ".ogg": "application/ogg",
            ".p": "text/x-pascal",
            ".pas": "text/x-pascal",
            ".pbm": "image/x-portable-bitmap",
            ".pdf": "application/pdf",
            ".pem": "application/x-x509-ca-cert",
            ".pgm": "image/x-portable-graymap",
            ".pgp": "application/pgp-encrypted",
            ".pkg": "application/octet-stream",
            ".pl": "text/x-script.perl",
            ".pm": "text/x-script.perl-module",
            ".png": "image/png",
            ".pnm": "image/x-portable-anymap",
            ".ppm": "image/x-portable-pixmap",
            ".pps": "application/vnd.ms-powerpoint",
            ".ppt": "application/vnd.ms-powerpoint",
            ".ps": "application/postscript",
            ".psd": "image/vnd.adobe.photoshop",
            ".py": "text/x-script.python",
            ".qt": "video/quicktime",
            ".ra": "audio/x-pn-realaudio",
            ".rake": "text/x-script.ruby",
            ".ram": "audio/x-pn-realaudio",
            ".rar": "application/x-rar-compressed",
            ".rb": "text/x-script.ruby",
            ".rdf": "application/rdf+xml",
            ".roff": "text/troff",
            ".rpm": "application/x-redhat-package-manager",
            ".rss": "application/rss+xml",
            ".rtf": "application/rtf",
            ".ru": "text/x-script.ruby",
            ".s": "text/x-asm",
            ".sgm": "text/sgml",
            ".sgml": "text/sgml",
            ".sh": "application/x-sh",
            ".sig": "application/pgp-signature",
            ".snd": "audio/basic",
            ".so": "application/octet-stream",
            ".svg": "image/svg+xml",
            ".svgz": "image/svg+xml",
            ".swf": "application/x-shockwave-flash",
            ".t": "text/troff",
            ".tar": "application/x-tar",
            ".tbz": "application/x-bzip-compressed-tar",
            ".tcl": "application/x-tcl",
            ".tex": "application/x-tex",
            ".texi": "application/x-texinfo",
            ".texinfo": "application/x-texinfo",
            ".text": "text/plain",
            ".tif": "image/tiff",
            ".tiff": "image/tiff",
            ".torrent": "application/x-bittorrent",
            ".tr": "text/troff",
            ".txt": "text/plain",
            ".vcf": "text/x-vcard",
            ".vcs": "text/x-vcalendar",
            ".vrml": "model/vrml",
            ".war": "application/java-archive",
            ".wav": "audio/x-wav",
            ".wma": "audio/x-ms-wma",
            ".wmv": "video/x-ms-wmv",
            ".wmx": "video/x-ms-wmx",
            ".wrl": "model/vrml",
            ".wsdl": "application/wsdl+xml",
            ".xbm": "image/x-xbitmap",
            ".xhtml": "application/xhtml+xml",
            ".xls": "application/vnd.ms-excel",
            ".xml": "application/xml",
            ".xpm": "image/x-xpixmap",
            ".xsl": "application/xml",
            ".xslt": "application/xslt+xml",
            ".yaml": "text/yaml",
            ".yml": "text/yaml",
            ".zip": "application/zip"
        }
    };
})();