module.exports = function(vork) {
    return new Users(vork);
};

function Users(vork) { //calld when vork loads model every time

    this.user = function(id) {

    };


    (function() {
        var sql = 'CREATE TABLE IF NOT EXISTS users ' +
                    '(user_id INT( 10 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,' +
                    'user_name VARCHAR( 32 ) NOT NULL ,' +
                    'user_password VARCHAR( 254 ) NOT NULL)';

        vork.mvc.db.query(sql);
        console.log("Users Model init done");
    })();
};