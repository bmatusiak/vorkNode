module.exports = function(globals){
    var init = {};
    
    init.ready = false;
    
    init.basepath = __dirname;
    
    init.webroot = init.basepath+'/webroot'
    
    var sys = require("util");
     function Channel() {
        var messages = [],
            callbacks = [];

        this.appendMessage = function(nick, type, text) {
            var m = {
                nick: nick,
                type: type,
                // "msg", "join", "part"
                text: text,
                timestamp: (new Date()).getTime()
            };

            switch (type) {
            case "msg":
                sys.puts("<" + nick + "> " + text);
                break;
            case "join":
                sys.puts(nick + " join");
                break;
            case "part":
                sys.puts(nick + " part");
                break;
            }

            messages.push(m);

            while (callbacks.length > 0) {
                callbacks.shift().callback([m]);
            }

            while (messages.length > MESSAGE_BACKLOG)
            messages.shift();
        };

        this.query = function(since, callback) {
            var matching = [];
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                if (message.timestamp > since) matching.push(message)
            }

            if (matching.length !== 0) {
                callback(matching);
            }
            else {
                callbacks.push({
                    timestamp: new Date(),
                    callback: callback
                });
            }
        };

        // clear old callbacks
        // they can hang around for at most 30 seconds.
        setInterval(function() {
            var now = new Date();
            while (callbacks.length > 0 && now - callbacks[0].timestamp > 20 * 1000) {
                callbacks.shift().callback([]);
            }
        }, 3000);
    }
    var MESSAGE_BACKLOG = 200,
        SESSION_TIMEOUT = 60 * 1000;
    
    if (!globals.chat) {
        globals.chat = {};
        // when the daemon started
        globals.chat.starttime = (new Date()).getTime();

        globals.chat.mem = process.memoryUsage();
        // every 10 seconds poll for the memory.
        setInterval(function() {
            globals.chat.mem = process.memoryUsage();
        }, 10 * 1000);
        
        
        globals.chat.channel = new Channel();


        globals.chat.sessions = {};

        globals.chat.createSession = function(nick) {
            if (nick.length > 50) return null;
            if (/[^\w_\-\^!]/.exec(nick)) return null;

            for (var i in globals.chat.sessions) {
                var session = globals.chat.sessions[i];
                if (session && session.nick === nick) return null;
            }

            var Tsession = {
                nick: nick,
                id: Math.floor(Math.random() * 99999999999).toString(),
                timestamp: new Date(),

                poke: function() {
                    Tsession.timestamp = new Date();
                },

                destroy: function() {
                    globals.chat.channel.appendMessage(Tsession.nick, "part");
                    delete globals.chat.sessions[Tsession.id];
                }
            };

            globals.chat.sessions[Tsession.id] = Tsession;
            return Tsession;
        }

        // interval to kill off old sessions
        setInterval(function() {
            var now = new Date();
            for (var id in globals.chat.sessions) {
                if (!globals.chat.sessions.hasOwnProperty(id)) continue;
                var session = globals.chat.sessions[id];

                if (now - session.timestamp > SESSION_TIMEOUT) {
                    session.destroy();
                }
            }
        }, 1000);
    }
    
    return init;
}