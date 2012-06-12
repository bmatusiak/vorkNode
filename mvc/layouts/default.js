var layout = exports;
//layout
layout.default = function(vork){
    var html = vork.get.helper('html');
    var layout = [];
    
    layout.push(html.header());
    
    layout.push(vork.mvc.view); // the view that got exported
    
    layout.push('<hr>Support vorkNode @ http://vork-node.nodester.com/')
    
    layout.push(html.footer());
    
    return layout.join(html.eol());
};