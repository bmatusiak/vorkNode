var struction = {};
//after Server config
struction.initConfig = function(vork){
};

//When Server Starts
struction.init = function(vork){
};


//request construct
struction.construct = function(vork,start,end){
    start();
};

//request destruct
struction.destruct = function(vork,end){
    end();
};

module.exports = struction;