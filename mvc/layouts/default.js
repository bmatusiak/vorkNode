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
    
    var MenuData = [{   href:'/',
                        data:'VorkNode'
                    },{ href:'/doc',
                        data:'Documentation'
                    },{ href:'/doc/quick',
                        data:'QucikStart'
                    }];
    function menuData(data){
        var url = require("url");
        url = url.parse(vork.mvc.req.url).pathname
        var string = '';
        for(var i in data){
            if(url == data[i].href){
                string += html.tag.li({
                        class:'current_page_item',
                        data:html.tag.a(data[i])
                    })
            }else{
                string += html.tag.li({
                    data:html.tag.a(data[i])
                })
            }
                
        }
        console.log(string);
        return string+cleafixTag;
    }
    //menu
    header.push(
        html.tag.div({
            id:'menu',
            data:html.tag.ul({
                data:menuData(MenuData)
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