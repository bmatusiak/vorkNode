var returndb = null;
var dbType = 'mongoDB';
 
//Fill these in... for sql
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
        var dbURI = process.env.MONGOLAB_URI || "mongodb://vorkjsreader:reader@ds031087.mongolab.com:31087/vorkjs";
        var mongoose = require('mongoose');
        mongoose.connect(dbURI);
	console.log("mongoDB database selected")
        returndb = mongoose;
        break;
    default:
        break;
    }
})();

module.exports = returndb;