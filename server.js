// server.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(server);
var users = [];
//redirect / to our index.html file
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/public/index.html');
});
//brings in static files
app.use(express.static(path.join(__dirname, 'public')));
//when a user connects/disconnects
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('setUsername', function (data) {
        console.log("setting username on server")
        console.log(data);
        //if statement used to see if user already exists
        if (users.indexOf(data) > -1) {
            socket.emit('userExists', data + ' username is taken! Try some other username.');
        }
        else {
            users.push(data);
            socket.emit('userSet', {
                username: data
            });
            console.log("working");
        }
    });
    socket.on('chat message', function (msg, user) {
        io.emit('chat message', msg, user);
        console.log('message: ' + msg);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
//start our web server and socket.io server listening
server.listen(3000, function () {
    console.log('listening on *:3000');
});