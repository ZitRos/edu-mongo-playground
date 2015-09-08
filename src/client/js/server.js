var Server = function (app) {

    var self = this;

    this.ws = this.connect();
    this.app = app;

    var first = true;
    this.ws.onmessage = function (message) {
        var o;
        if (first) {
            if (message.data === "OK") {
                first = false;
                return;
            } else {
                self.ws.close();
                self.ws = null;
            }
        }
        try { o = JSON.parse(message.data); } catch (e) {  }
        if (!o || !o.event) return;
        self.received(o.event, o.data || {});
    };

    this.ws.onclose = function () {
        console.warn("Connection closed! Reconnecting...");
        self.ws = self.connect();
    };

};

Server.prototype.connect = function () {

    var ws = new WebSocket("ws://localhost:81"),
        self = this;

    ws.onopen = function () {
        self.app.controller.onConnect.call(self.app.controller);
    };

    return this.ws = ws;

};

Server.prototype.send = function (event, data) {

    if (this.ws) {
        this.ws.send(JSON.stringify({ event: event, data: data }));
    }

};

Server.prototype.received = function (event, data) {

    if (this.app.controller.clientEvents.hasOwnProperty(event)) {
        this.app.controller.clientEvents[event].call(this.app.controller, data);
    } else {
        console.warn("Unregistered event " + event);
    }

};