const express = require('express');
const sequelize = require('./config/db');
const http = require('http');
const roomsRoutes = require('./routes/rooms.routes');
const {Server} = require('socket.io');
const app = express();
app.use(express.json());

const server  = http.createServer(app);
const io = new Server(server, {
    cors :{origin: "*"}
});
require('./sockets/rooms.socket')(io);
app.use('/rooms', roomsRoutes);
app.set('io', io);
const PORT = process.env.PORT || 5000;
(async () =>{
    try{
        await sequelize.sync({alter:true});
        console.log('database synced');
        app.listen(PORT, ()=>console.log('server is running on ${PORT}'));
    } catch(err){
        console.error('db connection error: ', err);
    }
})();