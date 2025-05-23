import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import './Chat.css';

const Chat = ({ roomId, username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socket = useSocket();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (socket) {
            // Unirse a la sala
            socket.emit('join_room', roomId);

            // Escuchar mensajes nuevos
            socket.on('receive_message', (data) => {
                setMessages(prev => [...prev, data]);
            });
        }

        return () => {
            if (socket) {
                socket.off('receive_message');
            }
        };
    }, [socket, roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            const messageData = {
                roomId,
                username,
                message,
                time: new Date().toLocaleTimeString()
            };

            socket.emit('send_message', messageData);
            setMessages(prev => [...prev, messageData]);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message ${msg.username === username ? 'own-message' : ''}`}
                    >
                        <div className="message-header">
                            <span className="username">{msg.username}</span>
                            <span className="time">{msg.time}</span>
                        </div>
                        <div className="message-content">{msg.message}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="chat-input-form">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="chat-input"
                />
                <button type="submit" className="send-button">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default Chat; 