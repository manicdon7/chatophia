// Home.js
import React from 'react';
import img from '../assets/social-networks-dating-apps-vector-seamless-pattern_341076-469.avif';

const Home = () => {
    const onCreateRoom = () => {
        window.location.href = '/CreateRoom';
    }
    const onJoinRoom = () => {
        window.location.href = '/JoinRoom';
    }

  return (
    <div className="grid grid-rows-2 items-center justify-center rounded-xl h-screen p-5" style={{backgroundImage:`url(${img})`}}>
      <div className="text-center underline mt-10 text-black font-bold text-4xl">Chatophia</div>
      <div className="grid grid-cols-1 gap-4">
        <button
          className="bg-blue-500 rounded-lg text-white p-4 hover:bg-blue-600 transition duration-300"
          onClick={onCreateRoom}
        >
          Create Room
        </button>       
        <button
          className="bg-green-500 rounded-lg text-white p-4 hover:bg-green-600 transition duration-300"
          onClick={onJoinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
