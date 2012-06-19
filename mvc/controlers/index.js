//controler
module.exports = function(vork){
    var controler = {};
    
    
    controler.index = function(callback){
        callback({Speak:'Hello World'}); 
    };

return controler;
};