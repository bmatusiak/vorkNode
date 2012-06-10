var ajaxchat = exports;
//controler
ajaxchat.index = function(vork){
    vork.mvc.view = '_json';
    var chat = vork.get.model('chat');
    return chat.getMessages('test');
}