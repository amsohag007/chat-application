// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:4444'); // Replace with the backend server URL

// function App() {
//   const [roomName, setRoomName] = useState('');
//   const [userId, setUserId] = useState('');
//   const [rooms, setRooms] = useState([]);
//   const [currentRoom, setCurrentRoom] = useState(null);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     // Connect to the WebSocket server
//     socket.connect();

//     //  Handle room created event
//     socket.on('roomCreated', (data) => {
//       setRooms([...rooms, data.room]);
//       console.log('rooms------', rooms);
//     });

//     // Handle user added to room event
//     socket.on('userAddedToRoom', (data) => {
//       setCurrentRoom(data.room);
//     });

//     // Clean up WebSocket connection on component unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleCreateRoom = () => {
//     // Emit createRoom event to the server
//     socket.emit('createRoom', { name: roomName, userId });
//   };

//   const handleAddUserToRoom = (roomId) => {
//     // Emit addUserToRoom event to the server
//     socket.emit('addUserToRoom', { roomId, userId });
//   };

//   const handleSendMessage = () => {
//     // Emit sendMessage event to the server
//     socket.emit('sendMessage', { roomId: currentRoom.id, userId, message });
//     setMessage('');
//   };

//   return (
//     <div>
//       {console.log('socketid:', socket.id)}
//       <div>
//         <input
//           type="text"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//         />
//         <button onClick={handleCreateRoom}>Create Room</button>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4444');

const App = () => {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleAddUserToRoom = () => {
    socket.emit('addUserToRoom', { roomId, userId });
  };

  useEffect(() => {
    socket.on('usersAddedToRoom', (data) => {
      const { room } = data;
      console.log(`Users added to room: ${room}`);
    });

    socket.on('usersAdditionError', (data) => {
      const { error } = data;
      console.log(`Error adding users to room: ${error}`);
    });

    return () => {
      socket.off('usersAddedToRoom');
      socket.off('usersAdditionError');
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleAddUserToRoom}>Add User to Room</button>
      <div>{message}</div>
    </div>
  );
};

export default App;
