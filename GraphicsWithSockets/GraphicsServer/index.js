"use strict";

let fs = require('fs');
let WebSocketServer = new require('ws');

let portNumber = process.env.PORT || 5005;
let  webSocketServer = new WebSocketServer.Server({
    port: portNumber
});

let clients = {};
let nameCounter = 1;

console.log("PORT: " + portNumber);
console.log("___________________________\n");


webSocketServer.on("connection", function(ws) {
    let id = "id_" + nameCounter;
    nameCounter++;
    clients[id] = ws;
    console.log("новое соединение " + id);

    ws.on("close", function() {
        console.log('соединение закрыто ' + id);
        try {
            delete clients[id];
        } catch (err) {
            // err
        }
    });

    ws.on("message", function(message) {
        console.log("получено сообщение " + message + " от " + id);
    });
});

let myInterval = setInterval(() => {
    fs.readFile('myFile.txt', 'utf8', function(err, data) {
        try {
            let message = data.toString();

            if(message.length > 0) {
                console.log(message);
            } else {
                message = "@@@@";
            }

            for (let key in clients) {
                try {
                    clients[key].send(message);
                } catch (err) {
                    // err
                }
            }

            fs.writeFile('myFile.txt', "", function(err) {
                // end of writing to file
            });

        } catch (err) {
            // err
        }
    });
}, 50);