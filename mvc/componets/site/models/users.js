module.exports = function(vork) { //calld when vork loads model every time

    var users = {};
    
    users.user = function(id) {
    
    };


    (function() {
        var sql = 'CREATE TABLE IF NOT EXISTS users ' +
                    '(user_id INT( 10 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,' +
                    'user_name VARCHAR( 32 ) NOT NULL ,' +
                    'user_password VARCHAR( 254 ) NOT NULL)';

        vork.db.query(sql);
        console.log("Users Model init done");
    })();
    
    return users;
};