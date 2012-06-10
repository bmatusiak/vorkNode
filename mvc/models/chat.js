module.exports = function(vork){
    return new Chat(vork);   
};

function Chat(vork){//calld when vork loads model for the first time
    console.log(vork.mvc.db);
    var sqlResCaller = function(callback) {
                return function (error, rows, cols){
                     if (error) {
                            console.log('ERROR: ' + error);
                            return;
                    }   
                    callback( rows, cols);
                };
        };
    this.getMessages = function(){
        var messages = {};
        vork.mvc.db.query().
        select('*').
        from('chat').
        limit(30).
        execute(sqlResCaller(function(rows, cols) {
                console.log(rows.length + ' ROWS found');
                messages = rows;
        }));
        return messages;
    };
    
    
    (function(){
        vork.mvc.db.query().
        select('CREATE IF NOT EXISTS TABLE chat ( id INT( 10 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,name VARCHAR( 32 ) NOT NULL ,message VARCHAR( 254 ) NOT NULL)').
        execute(sqlResCaller(function(rows, cols) {
                
        }));
        
        console.log("Chat Model init done");
    })();
    
};

