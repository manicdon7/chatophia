// RoomsList.js
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const RoomsList = ({ onJoin }) => {
  const [rooms, setRooms] = useState([]);

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

    return initializeApp(firebaseConfig);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const firebaseApp = initializeFirebase();
        const db = getDatabase(firebaseApp);
        const roomsRef = ref(db, 'create-room');

        onValue(roomsRef, (snapshot) => {
          const data = snapshot.val();
          console.log('Data from Firebase:', data);

          if (data) {
            const roomsArray = Object.values(data);
            console.log('Rooms Array:', roomsArray);
            setRooms(roomsArray);
          }
        });
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="max-w-2xl my-20 bg-gray-100 mx-auto p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">All Rooms</h1>
      <ul className="divide-y divide-gray-500">
        {rooms.map((room) => (
          <li key={room.roomCode} className="py-4">
            <p className="text-xl font-semibold text-blue-800">Room Name: {room.roomName}</p>
            <p className="text-gray-600">Created By: {room.createdBy}</p>
            <p className="text-gray-600">Room Code: {room.roomCode}</p>
            <button
              className="bg-green-500 rounded-lg text-white p-2 mt-2"
              onClick={() => onJoin(room)}
            >
              Join Room
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsList;
