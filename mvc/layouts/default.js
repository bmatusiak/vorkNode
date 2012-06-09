var layout = exports;
//layout
layout.default = function(vork){
    var html = vork.get.helper('html');
    var layout = [];
    
    layout.push(html.header());
    layout.push(vork.mvc.view);
    layout.push(html.footer());
    
    return layout.join(html.eol());
}