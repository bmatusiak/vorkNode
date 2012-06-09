var view = exports;
//view JSON
view._json = function(vork){
    vork.mvc.contentType = 'application/json';
    vork.mvc.layout = false;
    return new Buffer(JSON.stringify(vork.mvc.controler));
            
};