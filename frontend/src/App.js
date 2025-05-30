import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Chat from './components/Chat';
import './App.css';

function AppContent() {
    const [showLogin, setShowLogin] = useState(true);
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    if (!user) {
        return showLogin ? (
            <Login onToggleForm={() => setShowLogin(false)} />
        ) : (
            <Register onToggleForm={() => setShowLogin(true)} />
        );
    }

    return (
        <SocketProvider>
            <div className="App">
                <Chat username={user.username} />
            </div>
        </SocketProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
