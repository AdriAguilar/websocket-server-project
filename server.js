const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {cors: {origin: '*'}});

io.on('connection', (socket) => {
  console.log('-- A user connected --');

  // Manejar el evento "join" cuando un usuario se une a un chat
  socket.on('join', (chatId, username) => {
    console.log(`${username} joined chat ${chatId}`);
    socket.join(chatId);
  });

  // Manejar el evento "chat message" cuando un usuario envía un mensaje
  socket.on('sendMessage', (chatId, message, username, date, userId) => {
    console.log(`${username} sent message on chat ${chatId}: ${message}`);
    const chatMessage = {
      chat: chatId,
      message: message,
      username: username,
      date: date,
      isMyMessage: true,
      user: {
        id: userId
      }
    };
    // Devuelve el mensaje a los demás usuarios del chat
    io.to(chatId).emit('receiveMessage', chatMessage);
  });

  // Manejar el evento "leave" cuando un usuario sale de un chat
  socket.on('leave', (chatId, username) => {
    console.log(`${username} left chat ${chatId}`);
    socket.leave(chatId);
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});
