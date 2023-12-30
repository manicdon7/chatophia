// Update the server.js file

const express = require('express');
const http = require('http').createServer(express);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Message = require('./models/message');

mongoose.connect('mongodb+srv://manikandan05082003:Manicdon07%40@cluster0.scriurb.mongodb.net/chat', { useNewUrlParser: true, useUnifiedTopology: true });

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user authentication and room creation
  socket.on('authenticate', (user, roomCode) => {
    socket.join(roomCode);
    socket.emit('authenticated', true);
    console.log(`${user} authenticated and joined room ${roomCode}`);
  });

  // Handle receiving private messages from the client
  socket.on('privateMessage', async (data, callback) => {
    const { sender, roomCode, content } = data;

    // Save the private message to the database
    const newMessage = new Message({ sender, roomCode, content });
    await newMessage.save();

    // Emit the private message to the room
    io.to(roomCode).emit('message', { sender, content, timestamp: newMessage.timestamp });

    // Acknowledge the message to the sender
    callback({ success: true, message: 'Message received by the server.' });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
