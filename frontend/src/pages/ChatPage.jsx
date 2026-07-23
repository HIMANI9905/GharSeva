import React, { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { Send, Bot, User, MessageSquare, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const roomId = searchParams.get('room') || 'general_support';
  const receiverId = searchParams.get('receiver');

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join_room', roomId);
    }

    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      });
    }
  }, [socket]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/chat/${roomId}`);
      if (res.data.success) {
        setMessages(res.data.data);
        scrollToBottom();
      }
    } catch (err) {
      console.log('No prior history for room');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const messageData = {
      conversationId: roomId,
      receiverId: receiverId || '6580a1234567890123456789',
      content: input
    };

    try {
      const res = await API.post('/chat', messageData);
      if (res.data.success) {
        const newMsg = res.data.data;
        if (socket) {
          socket.emit('send_message', newMsg);
        }
        setMessages((prev) => [...prev, newMsg]);
        setInput('');
        scrollToBottom();
      }
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen py-10 max-w-4xl mx-auto px-4">
      <div className="bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden h-[600px] flex flex-col">
        
        {/* Chat Room Header */}
        <div className="p-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-400/20 text-violet-500 flex items-center justify-center border border-blue-600/40">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Real-time Service Chat</h3>
              <span className="text-[11px] text-teal-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                Socket.io Connected • End-to-End Encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-rose-50/60/40">
          {loading ? (
            <div className="text-center py-10 text-slate-400 text-xs">Loading message stream...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 text-slate-400 text-xs">
              Start your conversation! Type a message below.
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMe = m.sender?._id === user?._id || m.sender === user?._id;
              return (
                <div key={idx} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <img
                      src={m.sender?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className={`p-4 rounded-2xl max-w-[75%] text-xs ${
                    isMe
                      ? 'bg-sky-600 text-slate-800 rounded-br-none'
                      : 'bg-rose-100/50 text-slate-700 border border-slate-300 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed">{m.content}</p>
                    <span className="block text-[10px] text-right mt-1 opacity-70">
                      {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {isMe && (
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt="Me"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-rose-50/60 border-t border-rose-100 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-rose-100 text-slate-800 text-xs focus:outline-none focus:border-violet-400"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-violet-400 hover:bg-violet-400 text-slate-800 font-bold shadow-lg shadow-violet-400/20 flex items-center gap-1 text-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default ChatPage;
