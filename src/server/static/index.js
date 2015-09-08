var Static = require("node-static"),
    file = new Static.Server("./src/client");

require("http").createServer(function (request, response) {
    request.addListener("end", function () {
        file.serve(request, response);
    }).resume();
}).listen(80);
