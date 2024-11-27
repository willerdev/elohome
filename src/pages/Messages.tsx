import React, { useState, useEffect } from 'react';
import { Search, Phone, MoreVertical, Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  chat_id: string;
  isSender?: boolean;
  time?: string;
}

interface Chat {
  id: string;
  participant_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  unread: number;
  participant_avatar: string;
  participant_id: string;
  avatar: string;
}

export function Messages() {
  const { user } = useAuth();
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [imageComment, setImageComment] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_time', { ascending: false });

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
        return;
      }

      console.log('Fetched chats data:', chatsData);

      // Extract listing IDs from chats
      const listingIds = chatsData.map(chat => chat.listing_id).filter(id => id);

      // Fetch listings details based on listing IDs
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .in('id', listingIds);

      if (listingsError) {
        console.error('Error fetching listings:', listingsError);
        return;
      }

      console.log('Fetched listings data:', listingsData);

      // Format chats with corresponding listings details
      const formattedChats = chatsData.map(chat => {
        const listing = listingsData.find(listing => listing.id === chat.listing_id);
        return {
          id: chat.id,
          participant_name: listing ? listing.title : 'Unknown',
          last_message: chat.last_message,
          last_message_time: chat.last_message_time,
          unread_count: chat.unread_count,
          unread: chat.unread,
          participant_avatar: listing ? listing.images[0] : '',
          participant_id: chat.participant_id,
          avatar: listing ? listing.images[0] : '',
        };
      });

      console.log('Formatted chats:', formattedChats);
      setChats(formattedChats);
    };

    fetchChats();
  }, [user]);

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

  React.useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      console.log('Fetching messages for chat:', selectedChat.id);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', selectedChat.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      console.log('Fetched messages:', data);
      setMessages(data);
      scrollToBottom();
    };

    fetchMessages();
  }, [selectedChat]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setShowModal(true);
    }
  };

  const sendMessage = async () => {
    if (!selectedChat || !user) return;

    const message = {
      chat_id: selectedChat.id,
      sender_id: user.id,
      receiver_id: selectedChat.participant_id,
      content: comment,
      created_at: new Date().toISOString(),
    };

    // Handle file upload
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('elohomestorage')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('elohomestorage')
        .getPublicUrl(filePath);

      message.content = `${comment}\n${publicUrl}`; // Append the file URL to the comment
    }

    setMessages(prev => [...prev, { ...message, id: Date.now() }]);

    const { error } = await supabase
      .from('messages')
      .insert([message]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
    setSelectedFile(null);
    setComment('');
    setShowModal(false);
    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      sendMessage();
    }
  };

  const sendImageMessage = async () => {
    if (!selectedChat || !user || !selectedFile) return;

    // Upload the file to Supabase storage
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('elohomestorage')
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('elohomestorage')
      .getPublicUrl(filePath);

    const message = {
      chat_id: selectedChat.id,
      sender_id: user.id,
      receiver_id: selectedChat.participant_id,
      content: `${imageComment}\n${publicUrl}`, // Include the comment and public URL
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, { ...message, id: Date.now() }]);

    const { error } = await supabase
      .from('messages')
      .insert([message]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setImageComment(''); // Clear the comment field
    setSelectedFile(null); // Clear the selected file
    setShowModal(false); // Close the modal
  };

  const sendLocation = async () => {
    if (!selectedChat || !user) return;

    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const locationMessage = `Location: https://www.google.com/maps/@${latitude},${longitude},15z`;

      const message = {
        chat_id: selectedChat.id,
        sender_id: user.id,
        receiver_id: selectedChat.participant_id,
        content: locationMessage,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, { ...message, id: Date.now() }]);

      const { error } = await supabase
        .from('messages')
        .insert([message]);

      if (error) {
        console.error('Error sending message:', error);
        return;
      }
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <PageHeader 
        title="Messages"
        onBack={() => navigate('/')}
      />
      <div className="flex-grow flex">
        {/* Chat List */}
        <div className="w-1/3 border-r overflow-y-auto">
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
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b ${selectedChat?.id === chat.id ? 'bg-gray-100' : ''}`}
            >
              <div className="w-12 h-12 bg-[#0487b3] rounded-full flex items-center justify-center text-white font-semibold">
                {chat.avatar}
              </div>
              <div className="flex-grow min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{chat.participant_name}</h3>
                  <span className="text-sm text-gray-500">{chat.last_message_time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-[#0487b3] rounded-full flex items-center justify-center text-white text-xs">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-grow flex flex-col">
          {selectedChat ? (
            <>
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
                    <h3 className="font-medium">{selectedChat.participant_name}</h3>
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
                  <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 ${message.sender_id === user?.id ? 'bg-[#0487b3] text-white' : 'bg-white border'}`}>
                      <div>
                        {message.content.split('\n').map((line, index) => (
                          line.includes('http') ? (
                            <div key={index} className="bg-white p-2 rounded">
                              <img src={line} alt="Sent" className="max-w-full" />
                            </div>
                          ) : (
                            <span key={index}>{line}</span>
                          )
                        ))}
                      </div>
                      <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => document.getElementById('fileInput')?.click()}>
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow px-4 py-2 rounded-full bg-gray-100"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button 
                    className="p-2 bg-[#0487b3] text-white rounded-full"
                    onClick={sendMessage}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Selected Image">
          {selectedFile && (
            <div className="flex flex-col items-center">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="max-w-full max-h-96 object-contain mb-4"
              />
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full p-2 border rounded mb-2"
                value={imageComment}
                onChange={(e) => setImageComment(e.target.value)}
              />
              <button
                onClick={sendImageMessage}
                className="px-4 py-2 bg-[#0487b3] text-white rounded hover:bg-[#037299]"
              >
                Send
              </button>
            </div>
          )}
        </Modal>
      )}
      <button
        className="p-2 hover:bg-gray-100 rounded-full"
        onClick={sendLocation}
      >
        <img src="path/to/location-icon.png" alt="Send Location" className="w-5 h-5" />
      </button>
    </div>
  );
}