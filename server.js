const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {cors: {origin: '*'}});
const redisClient = redis.createClient();

io.on('connection', (socket) => {
  console.log('-- A user connected --');

  // Manejar el evento "join" cuando un usuario se une a un chat
  socket.on('join', (chatId, username) => {
    console.log(`User ${username} joined chat ${chatId}`);
    socket.join(chatId);
  });

  // Manejar el evento "chat message" cuando un usuario envía un mensaje
  socket.on('sendMessage', (chatId, message) => {
    console.log(`A user sent message: ${message}`);
    const chatMessage = {
      chat: chatId,
      message: message
    };
    redisClient.rPush(`chat:${chatId}`, JSON.stringify(chatMessage));
    io.to(chatId).emit('receiveMessage', chatMessage);
  });

  // Manejar el evento "leave" cuando un usuario sale de un chat
  socket.on('leave', (chatId, username) => {
    console.log(`User ${username} left chat ${chatId}`);
    socket.leave(chatId);
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
