var layout = exports;
//layout
layout.default = function(vork){
    var html = vork.get.helper('html');
    var layout = [];
    
    var head = {};
    head.css = ['http://fonts.googleapis.com/css?family=Oswald','/css/style.css'];
    head.title = "vorkNode";
    head.meta = [{name:'description',content:''},{name:'keywords',content:''}];
    
    layout.push(html.header(head));
    
    layout.push(vork.mvc.view); // the view that got exported
    
    var footerData = 'WOOT';
    layout.push(html.tag.div({id:"footer",data:footerData}));
    layout.push('<hr>Support vorkNode @ http://vorknode.herokuapp.com/')
    
    layout.push(html.footer());
    
    return layout.join(html.eol());
};