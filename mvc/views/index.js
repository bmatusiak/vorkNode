var view = exports;
//view
view.index = function(vork){
var output = [];

output.push('Hello World');
output.push('<br>'+vork.mvc.req.sessionID);
      var html = vork.get.helper('html');
    return output.join(html.eol());
};