var Controller = function (app) {

    var self = this;

    this.app = app;

    /**
     * @type {Object.<string, HTMLElement>}
     */
    this.elems = {};
    [].slice.call(document.getElementsByTagName("*")).filter(function (e) {
        return !!e.id;
    }).forEach(function (e) {
        self.elems[e.id] = e;
    });

    this.bindTriggers();

};

Controller.prototype.onConnect = function () {

    this.app.server.send("listUsers");

};

Controller.prototype.clientEvents = {

    message: function (data) {
        this.showMessage(data);
    },

    displayUsers: function (data) {
        var self = this,
            e = self.elems["userList"],
            o = {},
            s = "<table class=\"hoverable userTable\"><thead><tr><th>Name</th><th>Surname</th><th>Nickname</th><th>Registered</th><th>E-Mail</th></tr></thead><tbody>";
        data.forEach(function (e) {
            s += "<tr userid=\""+e._id+"\"><td>" + e.name + "</td><td>" + e.surname + "</td><td>" + e.username + "</td><td>" + (new Date(e.registered)).toLocaleDateString() + "</td><td>" + e.eMail + "</td></tr>";
            o[e._id] = e;
        });
        s += "</tbody></table>";
        e.innerHTML = s;
        $(".userTable tr").on("click", function (e) {
            var id = (e.currentTarget || e.delegateTarget).getAttribute("userid");
            self.elems["hiddenEditID"].value = id;
            self.elems["edit_first_name"].value = o[id].name;
            self.elems["edit_last_name"].value = o[id].surname;
            self.elems["edit_email"].value = o[id].eMail;
            self.elems["edit_username"].value = o[id].username;
            self.elems["edit_password"].value = "";
            $("ul.tabs").tabs("select_tab", "edit");
        });
    }

};

Controller.prototype.showMessage = function (message) {

    Materialize.toast(message, 7000, "rounded");

};

Controller.prototype.bindTriggers = function () {

    var self = this;

    this.elems["newUserButton"].addEventListener("click", function () {
        self.app.server.send("newUser", {
            name: self.elems["first_name"].value,
            surname: self.elems["last_name"].value,
            username: self.elems["username"].value,
            password: self.elems["password"].value,
            eMail: self.elems["email"].value
        });
    });

    this.elems["editUserButton"].addEventListener("click", function () {
        self.app.server.send("editUser", {
            name: self.elems["edit_first_name"].value,
            surname: self.elems["edit_last_name"].value,
            username: self.elems["edit_username"].value,
            password: self.elems["edit_password"].value,
            eMail: self.elems["edit_email"].value
        });
    });

    this.elems["removeUserButton"].addEventListener("click", function () {
        self.app.server.send("removeUser", self.elems["hiddenEditID"].value);
    });

};
