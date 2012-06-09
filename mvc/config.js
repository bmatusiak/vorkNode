var config = exports;
var mysql = require("db-mysql");

(function() {
     config.site_name = 'YourSite';
     config.site_domain = 'yoursite.com';

     config.db = 'nodeVork';
     var dbType = 'mysql';
     config.db = (function() {
          switch (dbType) {
          case 'mysql':
               console.log('MYSQL LOADING!!')
               var dbConfig = {
                    "hostname": "localhost",
                    "user": "USERNAME",
                    "password": "PASSWORD",
                    "database": config.db
               };
               var db = new mysql.Database(dbConfig);
               db.on('error', function(error) {
                    console.log('ERROR: ' + error);
               }).on('ready', function(server) {
                    console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
               }).connect(function(error) {
                    if (error) {
                         return console.log('CONNECTION error: ' + error);
                    }
                    this.query('CREATE DATABASE IF NOT EXISTS '+config.db).execute(function(error, rows, cols) {
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
})();