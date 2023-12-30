import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import img from '../assets/social-networks-dating-apps-vector-seamless-pattern_341076-469.avif';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue, child, get } from 'firebase/database';

const socket = io('http://localhost:3001');

const Chat = ({ onLeaveChat, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [createdRoom, setCreatedRoom] = useState('');
  const chatBottomRef = useRef(null);

  const initializeFirebase = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyDpXmrI2zGhrgz5MDYpVoYq2-Qgt5ylVHo",
      authDomain: "chatophia-69424.firebaseapp.com",
      projectId: "chatophia-69424",
      storageBucket: "chatophia-69424.appspot.com",
      messagingSenderId: "315517249939",
      appId: "1:315517249939:web:4f637b25191f0c9b83a066",
      databaseURL: "https://chatophia-69424-default-rtdb.firebaseio.com/",
    };
    initializeApp(firebaseConfig);
  };
  
  const sendMessage = async () => {
    try {
      console.log('Entering sendMessage function...');
      
      if (newMessage.trim() !== '') {
        console.log('Sending message...');
        initializeFirebase();
        const db = getDatabase();
        const messagesRef = ref(db, `create-room/messages/${createdRoom.roomCode}`);

        const payload = {
          content: newMessage,
          sender: currentUser, // Assuming displayName is available in currentUser
          timestamp: new Date().toISOString(), // Add a timestamp to the message
        };

        console.log('Message payload:', payload);

        // Push the message data into the database
        const newMessageRef = await push(messagesRef, payload);

        console.log('Message sent successfully!');
        console.log('New message key:', newMessageRef.key);

        // Clear the text box
        setNewMessage('');
        setCreatedRoom('');

        // Optionally, update the state to display the message immediately
        setMessages((prevMessages) => [...prevMessages, { ...payload, id: newMessageRef.key }]);
      } else {
        console.log('Invalid message or room information. Message not sent.');
        console.log('One or more conditions not met. Message not sent.');
        console.log('newMessage:', newMessage);
        console.log('createdRoom:', createdRoom);
        console.log('createdRoom.roomCode:', createdRoom && createdRoom.roomCode);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error, e.g., show a notification to the user
    }
  };

  const handleLeaveChat = () => {
    window.location.href = '/';
    if (onLeaveChat) {
      onLeaveChat();
    }
  };

  const fetchMessages = async () => {
    if (createdRoom && createdRoom.roomCode) {
      // Reference to Firebase Realtime Database
      const db = getDatabase();
      const messagesRef = ref(db, `create-room/messages/${createdRoom.roomCode}`);

      // Fetch existing messages
      const snapshot = await get(child(messagesRef));
      const existingMessages = snapshot.val();

      if (existingMessages) {
        const messageArray = Object.values(existingMessages);
        setMessages(messageArray);
        socket.emit('initialMessages', messageArray);
      }

      // Listen for changes in messages
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageArray = Object.values(data);
          setMessages(messageArray);
        }
      });
    }
  };

  useEffect(() => {
    if (createdRoom && createdRoom.roomCode) {
      initializeFirebase();
      socket.emit('joinRoom', createdRoom.roomCode, currentUser);
    }

    socket.on('initialMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    fetchMessages();

    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const intervalId = setInterval(() => {
      console.log('Fetching messages...');
      fetchMessages();
    }, 2000);

    return () => {
      clearInterval(intervalId);
      if (createdRoom && createdRoom.roomCode) {
        socket.emit('leaveRoom', createdRoom.roomCode, currentUser);
      }
    };
  }, [createdRoom, currentUser]);

  return (
    <div className="container mx-auto h-screen p-4 flex flex-col" style={{ backgroundImage: `url(${img})` }}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-2">Chat Room</h1>
          <button
            onClick={handleLeaveChat}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Leave Chat Room
          </button>
        </div>
        {createdRoom && (
          <div>
            <p className="text-white">Room Name: {createdRoom.roomName}</p>
            <p className="text-white">Room Code: {createdRoom.roomCode}</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-400 p-4 rounded-lg shadow">
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${message.sender === currentUser ? 'text-right' : 'text-left'
                }`}
            >
              <div
                className={`rounded-lg py-2 px-4 ${message.sender === currentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300'
                  }`}
              >
                <span className="font-semibold">{message.sender}:</span> {message.content}
              </div>
            </div>
          ))}
          <div ref={chatBottomRef}></div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="flex-1 mr-2">
          <input
            type="text"
            className="border p-2 w-full rounded-lg"
            value={newMessage}
            onChange={(e) => {
              console.log('Input value:', e.target.value);
              setNewMessage(e.target.value);
            }}
            placeholder="Type your message..."
          />

        </div>
        <div className="flex-none">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => sendMessage()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;