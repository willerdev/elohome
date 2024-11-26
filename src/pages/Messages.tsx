import React from 'react';
import { Search, Phone, Video, MoreVertical, Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  chat_id: string;
}

interface Chat {
  id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  participant_avatar: string;
}

export function Messages() {
  const { user } = useAuth();
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chats
  React.useEffect(() => {
    async function fetchChats() {
      if (!user) return;

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_time', { ascending: false });

      if (error) {
        console.error('Error fetching chats:', error);
        return;
      }

      setChats(data);
      setLoading(false);
    }

    fetchChats();
  }, [user]);

  // Subscribe to new messages
  React.useEffect(() => {
    if (!selectedChat || !user) return;

    const subscription = supabase
      .channel(`chat:${selectedChat.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${selectedChat.id}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        scrollToBottom();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedChat, user]);

  // Fetch messages for selected chat
  React.useEffect(() => {
    async function fetchMessages() {
      if (!selectedChat) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', selectedChat.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data);
      scrollToBottom();
    }

    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const message = {
      chat_id: selectedChat.id,
      sender_id: user.id,
      receiver_id: selectedChat.participant_id,
      content: newMessage,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('messages')
      .insert([message]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  };

  return (
    <div className="h-[100dvh] bg-gray-50">
      <PageHeader 
        title="Messages"
        onBack={() => navigate('/')}
      />
      {/* Mobile Chat List */}
      {!selectedChat && (
        <div className="h-full">
          <div className="p-4 border-b bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100dvh-8rem)]">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b"
              >
                <div className="w-12 h-12 bg-[#0487b3] rounded-full flex items-center justify-center text-white font-semibold">
                  {chat.avatar}
                </div>
                <div className="flex-grow min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    <span className="text-sm text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-[#0487b3] rounded-full flex items-center justify-center text-white text-xs">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Chat Window */}
      {selectedChat && (
        <div className="h-full flex flex-col">
          <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setSelectedChat(null)}
              className="p-1 -ml-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 flex-grow">
              <div className="w-8 h-8 bg-[#0487b3] rounded-full flex items-center justify-center text-white font-semibold">
                {selectedChat.avatar}
              </div>
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.isSender
                      ? 'bg-[#0487b3] text-white'
                      : 'bg-white border'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${message.isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow px-4 py-2 rounded-full bg-gray-100"
              />
              <button className="p-2 bg-[#0487b3] text-white rounded-full">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}