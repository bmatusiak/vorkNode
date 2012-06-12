module.exports = function(vork){
    return new Html(vork);   
};

function Html(vork){
    var self = this;
    self.vork = vork;
    
    this.header = function(data){
        var header = [];
        if(data == 'undefined')
            data = '';
        
        header.push(self.getDocType('html5'));
        header.push('<html>');
        header.push('<head>');
        header.push('<script src="/socket.io/socket.io.js"></script>');
        if(data && data.title)
            header.push('<title>'+data.title+'</title>');
        else
            header.push('<title>HelloWorld</title>');
        header.push('</head>');
        header.push('<body>');
        return header.join(self.eol());
    };
    
    this.footer = function(){
        var footer = [];
        footer.push('</body>');
        footer.push('</html>');
        return footer.join(self.eol());
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
            return docTypes[type];
    };
}