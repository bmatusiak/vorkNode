var html = exports;
//helper
(function(){
    html.header = function(data){
        var header = [];
        if(data == 'undefined')
            data = '';
        
        header.push(html.getDocType('html5'));
        header.push('<html>');
        header.push('<head>');
        header.push('<link rel="stylesheet" href="/css/style.css" type="text/css"/>');
        header.push('<script src="/js/jquery-1.2.6.min.js" type="text/javascript"></script>');
        header.push('<script src="/js/client.js" type="text/javascript"></script>');
        header.push('<title>node chat</title>');
        header.push('</head>');
        header.push('<body>');
        return header.join(html.eol());
    };
    
    html.footer = function(){
        var footer = [];
        footer.push('</body>');
        footer.push('</html>');
        return footer.join(html.eol());
    };
    
    html.eol = function(){
        return '\r\n';
    };
    
    html.htmlEntities = function(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
    
    html.getDocType = function(type){
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
})();