import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import './Chat.css';

const Chat = ({ username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomId, setRoomId] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const messagesEndRef = useRef(null);
    const socket = useSocket();
    const { logout } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (data) => {
                setMessages((prev) => [...prev, data]);
            });
        }
    }, [socket]);

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (roomId.trim()) {
            socket.emit('join_room', roomId);
            setIsJoined(true);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && roomId.trim()) {
            const messageData = {
                roomId,
                content: message,
                author: username,
                time: new Date().toLocaleTimeString()
            };

            socket.emit('send_message', messageData);
            setMessages((prev) => [...prev, messageData]);
            setMessage('');
        }
    };

    const handleLogout = () => {
        logout();
    };

    if (!isJoined) {
        return (
            <div className="join-container">
                <form onSubmit={handleJoinRoom} className="join-form">
                    <h2>Unirse a una Sala</h2>
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
        <div className="chat-container">
            <div className="chat-header">
                <h2>Sala: {roomId}</h2>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar Sesión
                </button>
            </div>
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.author === username ? 'own-message' : ''}`}
                    >
                        <div className="message-header">
                            <span className="author">{msg.author}</span>
                            <span className="time">{msg.time}</span>
                        </div>
                        <div className="message-content">{msg.content}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="message-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default Chat; 