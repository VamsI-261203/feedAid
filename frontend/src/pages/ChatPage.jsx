import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import '../css/chat.css';

const equalsIgnoreCase = (a, b) => {
    if (!a || !b) return false;
    return a.toLowerCase() === b.toLowerCase();
};

const ChatPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typedMessage, setTypedMessage] = useState('');
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [error, setError] = useState('');
    
    const stompClientRef = useRef(null);
    const subscriptionRef = useRef(null);
    const messagesEndRef = useRef(null);

    // 1. Check authentication on load
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setUser(loggedInUser);
        fetchChatRooms(loggedInUser.email);
    }, [navigate]);

    // 2. Fetch all chat rooms for the user
    const fetchChatRooms = async (email) => {
        try {
            setLoadingRooms(true);
            const response = await axios.get(`http://localhost:8080/api/chat/rooms?email=${email}`);
            setRooms(response.data);
            
            // If roomId parameter is present, find and set active room
            if (roomId) {
                const foundRoom = response.data.find(r => r.id === parseInt(roomId, 10));
                if (foundRoom) {
                    setActiveRoom(foundRoom);
                    fetchMessageHistory(foundRoom.id, email);
                }
            }
        } catch (err) {
            console.error("Failed to load chat rooms", err);
            setError("Failed to load conversation list.");
        } finally {
            setLoadingRooms(false);
        }
    };

    // 3. Fetch message history for selected room
    const fetchMessageHistory = async (id, email) => {
        try {
            setLoadingMessages(true);
            const response = await axios.get(`http://localhost:8080/api/chat/rooms/${id}/messages?email=${email}`);
            setMessages(response.data);
            scrollToBottom();
        } catch (err) {
            console.error("Failed to load messages", err);
            setError("Failed to load message history.");
        } finally {
            setLoadingMessages(false);
        }
    };

    // 4. WebSocket setup & subscription management
    useEffect(() => {
        if (!user || !activeRoom) return;

        // Initialize STOMP client with SockJS factory
        const socket = new SockJS('http://localhost:8080/ws-chat');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log(`Connected to WebSocket for room ${activeRoom.id}`);
                
                // Subscribe to messages in this room
                subscriptionRef.current = stompClient.subscribe(`/topic/chat/${activeRoom.id}`, (frame) => {
                    const receivedMsg = JSON.parse(frame.body);
                    setMessages(prev => {
                        // Avoid duplicates if the message was already added locally
                        if (prev.some(m => m.id === receivedMsg.id)) {
                            return prev;
                        }
                        return [...prev, receivedMsg];
                    });
                    scrollToBottom();
                });
            },
            onStompError: (frame) => {
                console.error("STOMP Broker error:", frame.headers['message']);
            }
        });

        stompClient.activate();
        stompClientRef.current = stompClient;

        // Cleanup connection when room changes or component unmounts
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [user, activeRoom]);

    // 5. Scroll to bottom of message list
    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // 6. Handle room selection
    const handleRoomSelect = (room) => {
        setActiveRoom(room);
        setError('');
        navigate(`/chat/${room.id}`);
        fetchMessageHistory(room.id, user.email);
    };

    // 7. Handle sending a message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!typedMessage.trim() || !stompClientRef.current || !activeRoom) return;

        const payload = {
            senderEmail: user.email,
            message: typedMessage.trim()
        };

        // Send via WebSocket STOMP
        stompClientRef.current.publish({
            destination: `/app/chat/${activeRoom.id}`,
            body: JSON.stringify(payload)
        });

        setTypedMessage('');
    };

    // Format timestamps for display
    const formatTime = (timestampString) => {
        if (!timestampString) return '';
        const date = new Date(timestampString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestampString) => {
        if (!timestampString) return '';
        const date = new Date(timestampString);
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Determine the participant label (Donor vs Receiver)
    const getParticipantName = (room) => {
        if (!user || !room) return '';
        const claim = room.claim;
        return equalsIgnoreCase(user.email, claim.donor.email) 
            ? claim.receiverName || claim.receiver.name 
            : claim.donor.name;
    };

    const getParticipantRole = (room) => {
        if (!user || !room) return '';
        return equalsIgnoreCase(user.email, room.claim.donor.email) ? 'Receiver' : 'Donor';
    };

    return (
        <section className="chat-section-main">
            <div className="chat-card-container">
                
                {/* Sidebar: Conversation List */}
                <div className="chat-sidebar">
                    <div className="sidebar-header">
                        <h2>My Chats</h2>
                        <span className="user-badge">{user?.name}</span>
                    </div>

                    <div className="conversation-list">
                        {loadingRooms ? (
                            <div className="chat-empty-state">
                                <div className="chat-spinner"></div>
                                <p>Loading conversations...</p>
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="chat-empty-state">
                                <p>No private chats found.</p>
                                <p className="subtext">Chats open automatically when a receiver claims a donation.</p>
                            </div>
                        ) : (
                            rooms.map(room => {
                                const isSelected = activeRoom?.id === room.id;
                                const participant = getParticipantName(room);
                                const role = getParticipantRole(room);
                                const isDelivered = room.claim.status === 'DELIVERED';

                                return (
                                    <div 
                                        key={room.id} 
                                        className={`conversation-item ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleRoomSelect(room)}
                                    >
                                        <div className="avatar-placeholder">
                                            {participant.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="conversation-details">
                                            <div className="conversation-top">
                                                <span className="participant-name">{participant}</span>
                                                <span className={`role-badge ${role.toLowerCase()}`}>{role}</span>
                                            </div>
                                            <div className="conversation-bottom">
                                                <span className="food-item-label">🍲 {room.claim.donor.itemName}</span>
                                                <span className={`status-pill ${isDelivered ? 'delivered' : 'active'}`}>
                                                    {isDelivered ? 'Closed' : 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat window: Messages list & input */}
                <div className="chat-window">
                    {activeRoom ? (
                        <>
                            {/* Window Header */}
                            <div className="chat-window-header">
                                <div className="header-user-info">
                                    <div className="avatar-placeholder">
                                        {getParticipantName(activeRoom).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3>{getParticipantName(activeRoom)}</h3>
                                        <p className="food-item-sub">Coordinating: <strong>{activeRoom.claim.donor.itemName}</strong></p>
                                    </div>
                                </div>
                                <div className="header-status">
                                    <span className={`status-indicator-badge ${activeRoom.claim.status.toLowerCase()}`}>
                                        Status: {activeRoom.claim.status === 'DELIVERED' ? 'Delivered ✓' : 'Accepted (Chat Active)'}
                                    </span>
                                </div>
                            </div>

                            {/* Locked Chat Banner */}
                            {!activeRoom.active && (
                                <div className="chat-locked-banner" role="alert">
                                    <span>🔒 This conversation is read-only because food delivery has been confirmed.</span>
                                </div>
                            )}

                            {/* Messages Container */}
                            <div className="messages-container">
                                {loadingMessages ? (
                                    <div className="chat-messages-loading">
                                        <div className="chat-spinner"></div>
                                        <p>Loading messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="messages-empty-state">
                                        <p>No messages yet.</p>
                                        <p className="subtext">Send a message to coordinate the collection date, time, and location.</p>
                                    </div>
                                ) : (
                                    <div className="messages-list">
                                        {messages.map((msg, index) => {
                                            const isSentByMe = user && equalsIgnoreCase(msg.senderEmail, user.email);
                                            const showDateDivider = index === 0 || 
                                                formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);

                                            return (
                                                <div key={msg.id || index}>
                                                    {showDateDivider && (
                                                        <div className="date-divider">
                                                            <span>{formatDate(msg.timestamp)}</span>
                                                        </div>
                                                    )}
                                                    <div className={`message-bubble-wrapper ${isSentByMe ? 'sent' : 'received'}`}>
                                                        <div className="message-bubble">
                                                            <p className="message-text">{msg.message}</p>
                                                            <span className="message-time">{formatTime(msg.timestamp)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Typing Input Section */}
                            <div className="message-input-area">
                                <form onSubmit={handleSendMessage} className="input-form">
                                    <input 
                                        type="text" 
                                        value={typedMessage}
                                        onChange={(e) => setTypedMessage(e.target.value)}
                                        placeholder={activeRoom.active ? "Type your message..." : "Chat is disabled for completed deliveries"}
                                        disabled={!activeRoom.active}
                                        className="chat-text-input"
                                        maxLength={1000}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!activeRoom.active || !typedMessage.trim()}
                                        className="chat-send-btn"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="send-icon-svg">
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                        Send
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="chat-window-empty">
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-chat-svg">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <h3>Private Coordination Chat</h3>
                            <p>Select a conversation from the sidebar list to begin messaging in real time.</p>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default ChatPage;
