var mysql = require("db-mysql");

var dbType = 'mysql';
var dbHost = 'localhost';
var dbUser = 'USERNAME';
var dbPass = 'PASSWORD';
var dbName = 'nodeVork';

var dbConfig = {
               "hostname": dbHost,
               "user": dbUser,
               "password": dbPass,
               "database": dbName
          };
          

var returndb = null;

(function() {
     switch (dbType) {
     case 'mysql':
          console.log('MYSQL LOADING!!');
          mysql.Database.prototype.iTself = function iTself(){return this;};
          var db = new mysql.Database(dbConfig);
          db.on('error', function(error) {
               console.log('ERROR: ' + error);
          }).on('ready', function(server) {
               console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
          }).connect(function(error) {
               if (error) {
                    return console.log('CONNECTION error: ' + error);
               }
          });
          returndb = db.iTself();
          break;
     case 'mysqlite':
          returndb = null;
          break;
     default:
          returndb = null;
          break;
     }
})();

module.exports = returndb;