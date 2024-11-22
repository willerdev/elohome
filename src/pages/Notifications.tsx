import React from 'react';
import { Bell, Car, Home, Briefcase } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'price_drop',
    title: 'Price Drop Alert',
    message: '2023 Mercedes-Benz G63 AMG price has been reduced by AED 50,000',
    time: '2 hours ago',
    icon: Car,
    read: false,
  },
  {
    id: 2,
    type: 'new_listing',
    title: 'New Listing in Your Area',
    message: 'Luxury 3 BHK Apartment in Dubai Marina just listed',
    time: '5 hours ago',
    icon: Home,
    read: true,
  },
  {
    id: 3,
    type: 'job_match',
    title: 'Job Match',
    message: 'New job posting matches your profile: Senior Software Engineer',
    time: '1 day ago',
    icon: Briefcase,
    read: true,
  },
];

export function Notifications() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notifications
        </h1>
        <button className="text-sm text-[#0487b3]">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read ? 'bg-white' : 'bg-blue-50'
            }`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <notification.icon className="w-6 h-6 text-[#0487b3]" />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{notification.title}</h3>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}