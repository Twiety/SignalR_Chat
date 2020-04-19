"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendMessage").disabled = true;
document.getElementById("sendGroup").disabled = true;
document.getElementById("sendCaller").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

connection.start().then(function () {
    document.getElementById("sendMessage").disabled = false;
    document.getElementById("sendGroup").disabled = false;
    document.getElementById("sendCaller").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendMessage").addEventListener("click", function (event) {
    console.log('sendMessage');
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("sendGroup").addEventListener("click", function (event) {
    console.log('sendGroup');
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessageToGroup", "Test", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("sendCaller").addEventListener("click", function (event) {
    console.log('sendCaller');
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessageToCaller", message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});