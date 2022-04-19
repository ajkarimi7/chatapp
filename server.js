const express = require('express'); 
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

//serve the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, + 'public/index.html'));
});

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected.')
    });

    socket.on('message', (message) => {
        console.log('message', message);
        //broadcast the message to everyone
        io.emit('message', message); 
    });
});

http.listen(3000, () => {
    console.log("Ayyyyyyy Listening to port 3000");
});