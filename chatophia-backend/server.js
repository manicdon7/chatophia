const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, push, onValue } = require('firebase/database');

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
// app.use(cors({
//   origin: 'https://chatophia-69424-default-rtdb.firebaseio.com/', // Replace with your frontend origin
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));

const io = socketIO(server, {
  cors: {
    origin: "https://chatophia-69424-default-rtdb.firebaseio.com/",
    methods: ["GET", "POST"]
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyDpXmrI2zGhrgz5MDYpVoYq2-Qgt5ylVHo",
  authDomain: "chatophia-69424.firebaseapp.com",
  projectId: "chatophia-69424",
  storageBucket: "chatophia-69424.appspot.com",
  messagingSenderId: "315517249939",
  appId: "1:315517249939:web:4f637b25191f0c9b83a066",
  databaseURL: "https://chatophia-69424-default-rtdb.firebaseio.com/",
};

const firebaseapp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseapp);



// API to create a room
app.post('/create-room', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { roomName, roomCode } = req.body;

  try {
    const roomsRef = ref(db, 'rooms');
    const newRoomRef = push(roomsRef, {
      roomName,
      roomCode,
    });

    res.json({ success: true, message: 'Room created successfully', roomCode: newRoomRef.key });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API to validate a room
app.post('/validate-room', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { roomId, roomName } = req.body;

  try {
    const roomRef = ref(db, `rooms/${roomId}`);
    const snapshot = await onValue(roomRef, (data) => data.val());

    if (snapshot) {
      res.json({ success: true, message: 'Room validated successfully' });
    } else {
      res.json({ success: false, message: 'Room not found' });
    }
  } catch (error) {
    console.error('Error validating room:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// API to get messages for a room
app.get('create-room/messages/:roomCode', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const roomCode = req.params.roomCode;

  try {
    const messagesRef = ref(db, `messages/${roomCode}`);
    const snapshot = await onValue(messagesRef, (data) => data.val());

    if (snapshot) {
      const messages = Object.values(snapshot);
      res.json({ success: true, messages });
    } else {
      res.json({ success: true, messages: [] });
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('sendMessage', async (data) => {
    const { roomCode, sender, content } = data;

    try {
      const messagesCollection = ref(db, `messages/${roomCode}`);
      const newMessageRef = push(messagesCollection, {
        sender,
        content,
      });

      // Emit the new message to all users in the room
      io.to(roomCode).emit('message', { ...newMessageRef.data(), id: newMessageRef.key });

      console.log('Message stored successfully');
    } catch (error) {
      console.error('Error storing message:', error);
    }
  });

  socket.on('joinRoom', (data, user) => {
    const { roomCode } = data;
    socket.join(roomCode);

    // Fetch messages when a user joins the room
    const messagesRef = ref(db, `messages/${roomCode}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messages = Object.values(data);
        socket.emit('initialMessages', messages);
      }
    });

    console.log(`User joined room: ${roomCode}`);
  });
});
