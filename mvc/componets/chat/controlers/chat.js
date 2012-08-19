//controler
var sys = require("util"),
    url = require("url"),
    qs = require("querystring");


module.exports = function(vork) {

    /*
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
    
    if (!vork.globals.chat) {
        vork.globals.chat = {};
        // when the daemon started
        vork.globals.chat.starttime = (new Date()).getTime();

        vork.globals.chat.mem = process.memoryUsage();
        // every 10 seconds poll for the memory.
        setInterval(function() {
            vork.globals.chat.mem = process.memoryUsage();
        }, 10 * 1000);
        
        
        vork.globals.chat.channel = new Channel();


        vork.globals.chat.sessions = {};

        vork.globals.chat.createSession = function(nick) {
            if (nick.length > 50) return null;
            if (/[^\w_\-\^!]/.exec(nick)) return null;

            for (var i in vork.globals.chat.sessions) {
                var session = vork.globals.chat.sessions[i];
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
                    vork.globals.chat.channel.appendMessage(Tsession.nick, "part");
                    delete vork.globals.chat.sessions[Tsession.id];
                }
            };

            vork.globals.chat.sessions[Tsession.id] = Tsession;
            return Tsession;
        }

        // interval to kill off old sessions
        setInterval(function() {
            var now = new Date();
            for (var id in vork.globals.chat.sessions) {
                if (!vork.globals.chat.sessions.hasOwnProperty(id)) continue;
                var session = vork.globals.chat.sessions[id];

                if (now - session.timestamp > SESSION_TIMEOUT) {
                    session.destroy();
                }
            }
        }, 1000);
    }
    */
    var controler = {};

    vork.layout = null;
        
    controler.index = function() {
        //vork.layout = null;
        //vork.view = "_json";
        return {
            Speak: 'Hello World'
        };
    };

    controler.who = function() {
        var nicks = [];
        for (var id in vork.globals.chat.sessions) {
            if (!vork.globals.chat.sessions.hasOwnProperty(id)) continue;
            var session = vork.globals.chat.sessions[id];
            nicks.push(session.nick);
        }
        //vork.layout = false;
        vork.view = "_json";
        return {
            nicks: nicks,
            rss: vork.globals.chat.mem.rss
        }
    };

    controler.join = function() {
        var nick = qs.parse(url.parse(vork.req.url).query).nick;
        if (nick === null || nick.length === 0) {
            vork.fail = {
                code: 400
            };
            vork.layout = false;
            vork.view = "_json";
            return {
                error: "Bad nick."
            };
        }
        var session = vork.globals.chat.createSession(nick);
        if (session === null) {
            vork.fail = {
                code: 400
            };
            vork.layout = false;
            vork.view = "_json";
            return {
                error: "Nick in use"
            };
        }

        //sys.puts("connection: " + nick + "@" + res.connection.remoteAddress);
        vork.globals.chat.channel.appendMessage(session.nick, "join");
        //vork.layout = false;
        vork.view = "_json";
        return {
            id: session.id,
            nick: session.nick,
            rss: vork.globals.chat.mem.rss,
            starttime: vork.globals.chat.starttime
        };
    };

    controler.part = function() {
        var id = qs.parse(url.parse(vork.req.url).query).id;
        var session;
        if (id && vork.globals.chat.sessions[id]) {
            session = vork.globals.chat.sessions[id];
            session.destroy();
        }
        //vork.layout = false;
        vork.view = "_json";
        return {
            rss: vork.globals.chat.mem.rss
        };
    };

    controler.recv = function(callback) {
        if (!qs.parse(url.parse(vork.req.url).query).since) {
            vork.fail = {
                code: 400
            };
            //vork.layout = false;
            vork.view = "_json";
            return {
                error: "Must supply since parameter"
            };
        }
        var id = qs.parse(url.parse(vork.req.url).query).id;
        var session;
        if (id && vork.globals.chat.sessions[id]) {
            session = vork.globals.chat.sessions[id];
            session.poke();
        }

        var since = parseInt(qs.parse(url.parse(vork.req.url).query).since, 10);
       //vork.layout = false;
        vork.view = "_json";
        vork.globals.chat.channel.query(since, function(messages) {
                if (session) session.poke();
                    callback({
            messages: messages,
            rss: vork.globals.chat.mem.rss
        });
            });
    };

    controler.send = function() {
        var id = qs.parse(url.parse(vork.req.url).query).id;
        var text = qs.parse(url.parse(vork.req.url).query).text;
    
        var session = vork.globals.chat.sessions[id];
        if (!session || !text) {
            vork.fail = {
                code: 400
            };
            //vork.layout = false;
            vork.view = "_json";
            return {
                error: "No such session id"
            };
        }
    
        session.poke();
    
        vork.globals.chat.channel.appendMessage(session.nick, "msg", text);
       // vork.layout = false;
        vork.view = "_json";
        return {
            rss: vork.globals.chat.mem.rss
        };
    };
    
    return controler;
};