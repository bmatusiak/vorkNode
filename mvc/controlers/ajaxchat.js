var ajaxchat = exports;
//controler
ajaxchat.index = function(vork){
    vork.mvc.view = '_json';
    var chat = vork.load.model('chat');
    return chat.getMessages('test');
}