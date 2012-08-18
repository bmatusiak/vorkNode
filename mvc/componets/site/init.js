module.exports = function(globals){
    var init = {};
    
    init.ready = false;
    
    init.basepath = __dirname;
    
    init.webroot = init.basepath+'/webroot'
    
    return init;
}