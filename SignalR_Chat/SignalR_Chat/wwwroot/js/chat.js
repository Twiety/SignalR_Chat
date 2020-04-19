"use strict";
var connection = null;

$(function () {
    $('#sendMessage').prop('disabled', true);
    $('#sendGroup').prop('disabled', true);
    $('#sendCaller').prop('disabled', true);

    if (connection === null) {
        connection = new signalR.HubConnectionBuilder()
            .withUrl("/chatHub")
            .build();

        connection.on("ReceiveMessage", function (user, message) {
            var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            var encodedMsg = '<b>' + user + "</b> says " + msg;
            $("#messagesList").append(
                '<li>' + encodedMsg + '</li>'
            );
        });

        connection.start().then(function () {
            $('#sendMessage').prop('disabled', false);
            $('#sendGroup').prop('disabled', false);
            $('#sendCaller').prop('disabled', false);
        }).catch(function (err) {
            return console.error(err.toString());
        });

        $('#sendMessage').click(function (event) {
            var user = $('#userInput').val(); 
            var message = $('#messageInput').val();
            connection.invoke("SendMessage", user, message).catch(function (err) {
                return console.error(err.toString());
            });
            console.log('sendMessage: ' + user + ' ' + message);
            event.preventDefault();
        });

        $('#sendGroup').click(function (event) {
            var user = $('#userInput').val();
            var message = $('#messageInput').val();
            connection.invoke("SendMessage", 'Test', user, message).catch(function (err) {
                return console.error(err.toString());
            });
            console.log('sendGroup: Test ' + user + ' ' + message);
            event.preventDefault();
        });

        $('#sendCaller').click(function (event) {
            var user = $('#userInput').val();
            var message = $('#messageInput').val();
            connection.invoke("SendMessage", message).catch(function (err) {
                return console.error(err.toString());
            });
            console.log('sendCaller: self ' + message);
            event.preventDefault();
        });


    }
})






