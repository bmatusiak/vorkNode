module.exports = function(vork){
    return new Chat(vork);   
};

function Chat(vork){//calld when vork loads model for the first time
    
    this.getMessages = function(optName){
        var ret = {};
        vork.mvc.db.query().
        select('*').
        from('chat').
        limit(30).
        execute(function(error, rows, cols) {
                console.log(rows.length + ' ROWS found');
                ret.data = rows;
                ret.comment = rows.length + ' ROWS found';
        },{async:false});
        return ret;
    };
    
    this.addMessages = function(name,message){
        var res = {};
        vork.mvc.db.query().
        insert('chat',
            ['name', 'message'],
            [name, message]
        ).
        execute(sqlResCaller(function(error, result) {
                if (error) {
                        console.log('ERROR: ' + error);
                        return res;
                }
                console.log('GENERATED id: ' + result.id);
                res = result.id;
        }));
        
        return res;
    };
    
    (function(){
        var sql = 'CREATE TABLE IF NOT EXISTS chat '+
                  '(id INT( 10 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,'+
                  'name VARCHAR( 32 ) NOT NULL ,'+
                  'message VARCHAR( 254 ) NOT NULL)';
        
        vork.mvc.db.query(sql).execute();
        
        console.log("Chat Model init done");
    })();
    
};

