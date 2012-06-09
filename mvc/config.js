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
exports = (function() {
     switch (dbType) {
     case 'mysql':
          console.log('MYSQL LOADING!!')
          var db = new mysql.Database(dbConfig);
          db.on('error', function(error) {
               console.log('ERROR: ' + error);
          }).on('ready', function(server) {
               console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
          }).connect(function(error) {
               if (error) {
                    return console.log('CONNECTION error: ' + error);
               }
               this.query('CREATE DATABASE IF NOT EXISTS ' + db).execute(function(error, rows, cols) {
                    if (error) {
                         console.log('ERROR: ' + error);
                         return;
                    }
               });
          });
          return db;
     case 'mysqlite':
          return null;
     default:
          //NO DB TYPE SELECTED
          return null;
     }
})();