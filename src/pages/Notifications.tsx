import React, { useEffect, useState } from 'react';
import { Bell, Car, Home, Briefcase, Settings } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  icon: string;
  read: boolean;
  created_at: string;
  related_id?: string;
  related_type?: string;
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return Car;
      case 'new_listing':
        return Home;
      case 'job_match':
        return Briefcase;
      default:
        return Bell;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Notifications" />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Notifications" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#0487b3]" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#0487b3] hover:underline"
            >
              Mark all as read
            </button>
            <button className="text-sm text-gray-600 hover:text-[#0487b3]">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No notifications</h2>
            <p className="text-gray-600">
              You're all caught up! Check back later for new updates.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#0487b3]" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-sm text-gray-500 mt-2">{notification.created_at}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}