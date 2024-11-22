import React from 'react';
import { Search, Phone, Video, MoreVertical, Send, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const chats = [
  {
    id: 1,
    name: 'Premium Motors',
    lastMessage: 'Is the Mercedes still available?',
    time: '2m ago',
    unread: 2,
    avatar: 'P',
  },
  {
    id: 2,
    name: 'Dubai Properties',
    lastMessage: 'When can we schedule a viewing?',
    time: '1h ago',
    unread: 0,
    avatar: 'D',
  },
];

const messages = [
  {
    id: 1,
    sender: 'Premium Motors',
    content: 'Is the Mercedes still available?',
    time: '10:30 AM',
    isSender: false,
  },
  {
    id: 2,
    sender: 'You',
    content: 'Yes, it is! Would you like to schedule a viewing?',
    time: '10:32 AM',
    isSender: true,
  },
];

export function Messages() {
  const [selectedChat, setSelectedChat] = React.useState<typeof chats[0] | null>(null);
  const navigate = useNavigate();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-[100dvh] bg-gray-50">
      {/* Mobile Chat List */}
      {!selectedChat && (
        <div className="h-full">
          <div className="bg-white border-b px-4 py-3">
            <h1 className="text-xl font-semibold">Messages</h1>
          </div>
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