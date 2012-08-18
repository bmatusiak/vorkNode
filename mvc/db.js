var returndb = null;
var dbType = 'none';
 
//Fill these in...
var DATABASE = 'DATABASE';
var USERNAME = 'USERNAME';
var PASSWORD = 'PASSWORD';
var HOSTNAME = 'HOSTNAME';
 

(function() {
    switch (dbType) {
    case 'mysql':
        console.log('mysql LOADING!!');
        try{
            returndb = require('mysql').createClient({
                host:HOSTNAME,
                user: USERNAME,
                password: PASSWORD,
                database:DATABASE
            });
        }catch(e){
            console.log("We Had a Error in db.js!");
            console.log(e);
            returndb = null;
        }
        console.log("mysql Loaded!");
        break;
    case 'mongoDB':
        console.log('mongoDB LOADING!!');
        break;
    default:
        break;
    }
})();

module.exports = returndb;