import React from 'react';
import { Search, Phone, Video, MoreVertical, Send, Image as ImageIcon } from 'lucide-react';

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
  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      <div className="grid md:grid-cols-[350px,1fr] h-full">
        {/* Chat List */}
        <div className="border-r bg-white">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#0487b3] rounded-full flex items-center justify-center text-white font-semibold">
                  {chat.avatar}
                </div>
                <div className="flex-grow min-w-0">
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
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-white border-b">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0487b3] rounded-full flex items-center justify-center text-white font-semibold">
                P
              </div>
              <div>
                <h3 className="font-medium">Premium Motors</h3>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
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
          </div>

          {/* Message Input */}
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
      </div>
    </div>
  );
}