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
    //-------------------------------------------------
    var content = [];
    var header = [];
    var page = [];
    var sidebar = [];
    
    var cleafixTag = html.tag.br({class:"clearfix"});
    //Logo
    header.push(
        html.tag.div({
            id:'logo',
            data:html.tag.h1({
                data:html.tag.a({
                    href:'/',
                    data:'vorkNode'
                })
            })
        })
    );
    
    //Logo
    header.push(
        html.tag.div({
            id:'search',
            data:html.tag.form({
                action:vork.mvc.req.url,
                method:"post",
                data:html.tag.div({
                    data:html.tag.input({
                        class:"form-text",
                        name:"search",
                        size:"32",
                        maxlength:"64"
                    })+html.tag.input({
                        class:"form-submit",
                        type:"submit",
                        value:"Search"    
                    })
                })
            })
        })
    );
    
    //menu
    header.push(
        html.tag.div({
            id:'menu',
            data:html.tag.ul({
                data:html.tag.li({
                    data:html.tag.a({
                        href:'/',
                        data:'VorkNode'
                    })
                })+html.tag.li({
                    data:html.tag.a({
                        href:'/doc',
                        data:'Documentation'
                    })
                })+html.tag.li({
                    data:html.tag.a({
                        href:'/doc/quick',
                        data:'Quick Reference'
                    })
                })+cleafixTag
            })
        })
    );
    
    content.push(html.tag.div({id:"header",data:header.join(html.eol())}));
    
    page.push(
        html.tag.div({
            id:'content',
            data:vork.mvc.view
        })
    );
    page.push(
        html.tag.div({
            id:'sidebar',
            data:''
        })
    );
    
    page.push(cleafixTag);
    
    content.push(html.tag.div({id:"page",data:page.join(html.eol())}));
    
    layout.push(html.tag.div({id:"wrapper",data:content.join(html.eol())}));
    //layout.push(vork.mvc.view); // the view that got exported
    layout.push(html.tag.div({id:"footer",data:'Support vorkNode @ http://vorknode.herokuapp.com/'}));
    
    //-------------------------------------------------
    //layout.push(html.tag.div({id:"footer",data:'Support vorkNode @ http://vorknode.herokuapp.com/'}));
    layout.push(html.footer());
    return layout.join(html.eol());
};