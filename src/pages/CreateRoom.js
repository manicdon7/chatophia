import React, { useState } from 'react';
import img from '../assets/social-networks-dating-apps-vector-seamless-pattern_341076-469.avif';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push } from 'firebase/database';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');

  const initializeFirebase = () => {
    // Your Firebase config object
    const firebaseConfig = {
      apiKey: "AIzaSyDpXmrI2zGhrgz5MDYpVoYq2-Qgt5ylVHo",
      authDomain: "chatophia-69424.firebaseapp.com",
      projectId: "chatophia-69424",
      storageBucket: "chatophia-69424.appspot.com",
      messagingSenderId: "315517249939",
      appId: "1:315517249939:web:4f637b25191f0c9b83a066",
      databaseURL: "https://chatophia-69424-default-rtdb.firebaseio.com/",
    };

    // Initialize Firebase
    initializeApp(firebaseConfig);
  };

  const handleCreate = async () => {
    initializeFirebase(); // Call initializeFirebase before attempting to use Firebase

    if (roomName.trim() !== '' && roomCode.trim() !== '' && username.trim() !== '') {
      try {
        // Reference to Firebase Realtime Database
        const db = getDatabase();

        // Reference to the "rooms" endpoint
        const roomsRef = ref(db, 'create-room');

        // Room details as an object
        const roomDetails = {
          roomName: roomName,
          roomCode: roomCode,
          createdBy: username,
          messages: [], // Initialize messages as an empty array
        };

        // Push the room details into the database
        const newRoomRef = push(roomsRef);
        await set(newRoomRef, roomDetails);

        console.log('Room details stored successfully');

        // Use roomCode to redirect or perform any other actions
        window.location.href = `/Chat?roomCode=${roomCode}`;
      } catch (error) {
        console.error('Error storing room details:', error.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl h-screen p-5" style={{ backgroundImage: `url(${img})` }}>
      <div className="text-center underline mt-10 text-black font-bold text-4xl">Create Room</div>
      <div className="p-4 bg-white rounded shadow-lg mt-8">
        <div className="mb-4">
          <label htmlFor="roomName" className="text-lg font-semibold">
            Room Name:
          </label>
          <input
            type="text"
            id="roomName"
            className="border p-2 w-full"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="roomCode" className="text-lg font-semibold">
            Room Code:
          </label>
          <input
            type="text"
            id="roomCode"
            className="border p-2 w-full"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter room code"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="text-lg font-semibold">
            Your Name:
          </label>
          <input
            type="text"
            id="username"
            className="border p-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <button className="bg-blue-500 rounded-lg text-white p-2" onClick={handleCreate}>
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateRoom;
