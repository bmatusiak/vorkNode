var chat = exports;
//view
chat.init = function(db){//calld when vork loads model for the first time
    console.log(db);
    var sqlResCaller = function(callback) {
                return function (error, rows, cols){
                     if (error) {
                            console.log('ERROR: ' + error);
                            return;
                    }   
                    callback( rows, cols);
                };
        };
    chat.getMessages = function(){
        var messages = {};
        db.query().
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
        db.query().
        select('CREATE IF NOT EXISTS TABLE chat ( id INT( 10 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,name VARCHAR( 32 ) NOT NULL ,message VARCHAR( 254 ) NOT NULL)').
        execute(sqlResCaller(function(rows, cols) {
                
        }));
        
        console.log("Chat Model init done");
    })();
    
};

