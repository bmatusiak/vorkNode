module.exports = function(vork){
    return new Html(vork);   
};

function Html(vork){
    var self = this;
    self.vork = vork;
    console.log("helper html loaded!");
    function Tag() {
        var tags = require("./_tags");
        for (var i in tags) {
            var tag = tags[i];
            this[tag] = _makeTag(tag);
        }
        //console.log("html tags created")
        function _makeTag(name){
        return function(data) {
                var string = name;
                if (data) {
                    for (var i in data) {
                        if (i != "data") string += " "+i + '="' + data[i] + '"';
                    }
                    if (data.data ||  data.data === '') {
                        string = "<" + string + ">" + data.data + "</" + name + ">";
                    }
                    else {
                        //string += "/";
                        string = "<" + string + ">";
                    }
                }
                else {
                    //string += "/";
                    string = "<" + string + ">";
                }
                //console.log(string);
                return string + self.eol();
            };  
    }
    }
    
    this.tag = new Tag();
    
    this.header = function(data){
        var header = [];
        var head = [];
        if(typeof(data) != 'object')
            data = {};
            
        if(!data.title) data.title = vork.config.title;
        if(!data.docType) data.docType = 'html5';
                
        header.push(self.getDocType(data.docType));
        header.push(self.tag.html());
        if(data.css){
            for(var i in data.css){
                   head.push(self.tag.link({rel:'stylesheet',type:'text/css',href:data.css[i]}));
            }
        }
        //head.push(self.tag.script({src:'/socket.io/socket.io.js',data:''}));
        if(data.title)
            head.push(self.tag.title({data:data.title}));
        
        
        header.push(self.tag.head({data:head.join('')}));
        
        header.push(self.tag.body());
        return header.join("");
    };
    
    this.footer = function(){
        var footer = [];
        footer.push('</body>');
        footer.push('</html>');
        return footer.join("");
    };
    this.eol = function(){
        return '\r\n';
    };
    
    this.htmlEntities = function(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    
    this.getDocType = function(type){
    var docTypes = {'html5'   : '<!DOCTYPE html>',
                'xhtml1.1'     : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
                'strict'       : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
                'transitional' : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
                'frameset'     : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
                'html4.01'     : '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
                'mobile1.2'    : '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',
                'mobile1.1'    : '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.1//EN "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile11.dtd">',
                'mobile1.0'    : '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">'
            };    
            return docTypes[type]+ self.eol();
    };
}