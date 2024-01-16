import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from '../src/pages/Home';
import CreateRoom from '../src/pages/CreateRoom';
import JoinRoom from '../src/pages/JoinRoom';
import Chat from './pages/Chat';
import RoomsList from './pages/RoomList';

function App() {
  const [createdRoom, setCreatedRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [onLeaveChat] = useState(null);

  const handleCreateRoom = (roomName,roomCode) => {
    setCreatedRoom(roomCode,roomName);
    setCurrentUser(currentUser);
    onLeaveChat(onLeaveChat);
  };

  

  return (
    <Router className="container mx-auto bg-green-700 h-screen p-4 flex flex-col">
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/CreateRoom' element={<CreateRoom onCreate={handleCreateRoom} />} />
        <Route path='/JoinRoom' element={<JoinRoom />}/>
        <Route path='/Chat/' element={<Chat CreateRoom={createdRoom} currentUser={currentUser} onLeaveChat={onLeaveChat}/>} />
        <Route path='/RoomList' element={<RoomsList />}></Route>
      </Routes>
    </Router> 
  );
}

export default App;
