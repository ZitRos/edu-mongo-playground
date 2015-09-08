var Client = module.exports = class Client {

    constructor (ws, cid, odm) {
        this.ws = ws;
        this.odm = odm;
        console.log(`New client, ID=${cid}`);
    }

    send (event, data) {
        if (this.ws) this.ws.send(JSON.stringify({ event: event, data: data }));
    }

    /**
     * @param {string} event
     * @param {*} data
     */
    received (event, data) {
        console.log(`received event ${event} with data ${data}`);
        var self = this,
            odm = this.odm,
            ev;
        ((ev = {
            newUser: function (d) {
                odm.addNewUser(d, function (err, user) {
                    self.send(
                        "message",
                        err ? err : `User ${user.getFullName()} added!`
                    );
                });
            },
            listUsers: function () {
                odm.listUsers(function (err, users) {
                    self.send(
                        err ? "message" : "displayUsers",
                        err ? "Unable to display users: " + err : users
                    );
                });
            },
            editUser: function (d) {
                odm.addNewUser(d, function (err, user) {
                    self.send(
                        "message",
                        err ? err : `User ${user.getFullName()} changed!`
                    );
                    if (!err) ev.listUsers();
                });
            },
            removeUser: function (id) {
                odm.removeUser(id, function (err) {
                    self.send(
                        "message",
                        err ? "Unable to remove this user" : "User successfully removed!"
                    );
                    if (!err) ev.listUsers();
                });
            }
        })[event] || function () { self.send("message", `Unable to process ${event}.`) })(data);
    }

};