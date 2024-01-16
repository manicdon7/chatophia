// JoinRoom.js
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get } from 'firebase/database';

const JoinRoom = ({ history }) => {
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const firebaseConfig = {
    // Your Firebase config here
    apiKey: "AIzaSyDpXmrI2zGhrgz5MDYpVoYq2-Qgt5ylVHo",
      authDomain: "chatophia-69424.firebaseapp.com",
      projectId: "chatophia-69424",
      storageBucket: "chatophia-69424.appspot.com",
      messagingSenderId: "315517249939",
      appId: "1:315517249939:web:4f637b25191f0c9b83a066",
      databaseURL: "https://chatophia-69424-default-rtdb.firebaseio.com/",
  };

  const initializeFirebase = () => {
    initializeApp(firebaseConfig);
  };

  const checkRoomExists = async ({ roomName, roomCode }) => {
    try {
      initializeFirebase();
      const db = getDatabase();
      const roomsRef = ref(db, 'create-room');

      const snapshot = await get(child(roomsRef, roomCode));

      if (snapshot.exists() && snapshot.val().roomName === roomName) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error in Firebase request:', error);
      throw new Error('An error occurred during the Firebase request');
    }
  };

  const handleJoin = async () => {
    if (roomName.trim() !== '' && roomCode.trim() !== '' && username.trim() !== '') {
      try {
        const roomData = await checkRoomExists({ roomName, roomCode });

        if (roomData) {
          // Redirect to the chat room with room name and code
          history.push({
            pathname: `/create-room/${roomData.roomName}/${roomData.roomCode}`,
            state: { roomData, username },
          });
        } else {
          setErrorMessage('Invalid room name or room code. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error checking room:', error);
        setErrorMessage('An error occurred while checking the room. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-xl h-screen p-5">
      <div className="text-center underline mt-10 text-black font-bold text-4xl">Join Room</div>
      <div className="p-4 bg-white rounded shadow mt-8">
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
            Username:
          </label>
          <input
            type="text"
            id="username"
            className="border p-2 w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <button className="bg-green-500 rounded-lg text-white p-2" onClick={handleJoin}>
          Join
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default JoinRoom;
