import React, { useState, useEffect } from 'react';
import { Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';
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
  const isMobile = window.innerWidth < 768; // Check if mobile

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chats and set up real-time subscription
  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
        .order('last_message_time', { ascending: false });

      if (chatsError) {
       // console.error('Error fetching chats:', chatsError);
        return;
      }

      //console.log('Fetched chats data:', chatsData);

      // Extract listing IDs from chats
      const listingIds = chatsData.map(chat => chat.listing_id).filter(id => id);

      // Fetch listings details based on listing IDs
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .in('id', listingIds);

      if (listingsError) {
       // console.error('Error fetching listings:', listingsError);
        return;
      }

     // console.log('Fetched listings data:', listingsData);

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

     /// console.log('Formatted chats:', formattedChats);
      setChats(formattedChats);
    };

    fetchChats();

    const chatSubscription = supabase
      .channel('chats')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
      }, (payload) => {
        fetchChats(); // Re-fetch chats on new chat insertion
      })
      .subscribe();

    return () => {
      chatSubscription.unsubscribe();
    };
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
        //console.error('Error fetching messages:', error);
        return;
      }
     // console.log('Fetched messages:', data);
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
        //console.error('Error uploading file:', uploadError);
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
     // console.error('Error sending message:', error);
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

  const toggleChatWindow = (chat: Chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <PageHeader 
        title="Messages"
        onBack={() => setSelectedChat(null)}
      />
      <div className="flex-grow flex">
        {/* Chat List */}
        <div className={`w-full md:w-1/4 border-r bg-white shadow-md overflow-y-auto ${selectedChat ? 'hidden' : 'block'}`}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Chats</h2>
          </div>
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet.</p>
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => toggleChatWindow(chat)}
                className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b`}
              >
                <div className="w-12 h-12 bg-[#0487b3] rounded-full flex items-center justify-center text-white font-semibold">
                  <img src={chat.participant_avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0 text-left">
                  <h3 className="font-medium truncate">{chat.participant_name}</h3>
                  <p className="text-sm text-gray-600 truncate">{chat.last_message}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-[#0487b3] rounded-full flex items-center justify-center text-white text-xs">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className={`flex-grow flex flex-col bg-gray-50 ${selectedChat ? 'block' : 'hidden'}`}>
          {selectedChat ? (
            <>
              <div className="bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
             
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-8 h-8 bg-[#0487b3] rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.participant_avatar}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedChat.participant_name}</h3>
                    <p className="text-xs text-gray-500">
                      {user ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Messages and input area */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 ${message.sender_id === user?.id ? 'bg-[#0487b3] text-white' : 'bg-white border'}`}>
                      <div>
                        {message.content.split('\n').map((line, index) => (
                          <span key={index}>{line}</span>
                        ))}
                      </div>
                      <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow px-4 py-2 rounded-full bg-gray-200 focus:outline-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    className="p-2 bg-[#0487b3] text-white rounded-full"
                    onClick={() => {/* send message logic */}}
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
                className="max-w-full max-h-96 object-contain mb-4 rounded-lg shadow-lg"
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
    </div>
  );
}