import ws from "ws";
import Client from "./client";

var WebSocketServer = ws.Server,
    wss = new WebSocketServer({port: 81});

var Ws = module.exports = class Ws {

    constructor () {

        var self = this;

        this.nextClientId = 0;
        this.clients = {};

        require("../ODM/index").onCreateODM(function (odm) {
            wss.on("connection", function (ws) {
                let id = self.nextClientId,
                    client = self.clients[id] = new Client(ws, self.nextClientId++, odm);
                ws.on("message", function (message) {
                    let o;
                    try { o = JSON.parse(message); } catch (e) { console.error.call(e); }
                    if (!o || !o.event) return;
                    client.received(o.event, o.data || {});
                });
                ws.on("close", function () {
                    delete self.clients[id];
                });
                ws.send("OK");
            });
        });
    }

};