import React, { useState } from 'react';
import { SocketProvider } from './contexts/SocketContext';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim() && roomId.trim()) {
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <form onSubmit={handleJoin} className="join-form">
          <h2>Unirse al Chat</h2>
          <input
            type="text"
            placeholder="Tu nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="ID de la sala"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <button type="submit">Unirse</button>
        </form>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="App">
        <Chat roomId={roomId} username={username} />
      </div>
    </SocketProvider>
  );
}

export default App;
