var config = exports;
var mysql = require("db-mysql");

(function(){
    config.site_name = 'YourSite';
    config.site_domain = 'yoursite.com';
    
    var dbType = 'mysql';
    config.db = (function(){
           switch(dbType){
               case 'mysql':
                   console.log('MYSQL LOADING!!')
                   var db = new mysql.Database({"hostname": "localhost",
                            "user": "root",
                            "password": "M4tusiak",
                            "database": "test"});
                    db.on('error', function(error) {
                                console.log('ERROR: ' + error);
                                }).on('ready', function(server) {
                                    console.log('Connected to ' + server.hostname + ' (' + server.version + ')');
                                }).connect(function(error) {
                                                if (error) {
                                                    return console.log('CONNECTION error: ' + error);
                                                }
                                                this.query('CREATE DATABASE IF NOT EXISTS test').execute(function(error, rows, cols) {
                                                if (error) {
                                                        console.log('ERROR: ' + error);
                                                        return;
                                                }
                                        });
                                });
                    return db;
                case 'mysqlite':
                    return null;
                default://NO DB TYPE SELECTED
                    return null;
           }
    })();
})();