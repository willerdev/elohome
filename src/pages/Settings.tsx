import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Loader2, 
  User, 
  Briefcase, 
  Globe, 
  CheckCircle2, 
  MessageSquare,
  Heart,
  Search,
  Car,
  BookmarkPlus,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Profile } from './Profile';
import { GetVerified } from './GetVerified';
import { Messages } from './Messages';
import { Favorites } from './Favorites';
import { Searches } from './Searches';
import { Bookmarks } from './Bookmarks';

interface UserProfile {
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  whatsapp: string;
  telegram: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: user?.email || '',
    created_at: '',
    updated_at: '',
    phone_number: '',
    address: '',
    city: '',
    country: '',
    whatsapp: '',
    telegram: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                username: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                phone_number: '',
                address: '',
                city: '',
                country: '',
                whatsapp: '',
                telegram: ''
              }
            ]);

          if (insertError) throw insertError;

          setProfile({
            username: '',
            email: user.email || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            phone_number: '',
            address: '',
            city: '',
            country: '',
            whatsapp: '',
            telegram: ''
          });
        } else if (error) {
          throw error;
        } else if (data) {
          setProfile({
            username: data.username || '',
            email: user.email || '',
            created_at: data.created_at,
            updated_at: data.updated_at,
            phone_number: data.phone_number || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            whatsapp: data.whatsapp || '',
            telegram: data.telegram || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: profile.username,
          email: profile.email,
          phone_number: profile.phone_number,
          address: profile.address,
          city: profile.city,
          country: profile.country,
          whatsapp: profile.whatsapp,
          telegram: profile.telegram,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { 
      label: 'My Profile', 
      path: '/profile', 
      icon: User,
      component: Profile 
    },
    { 
      label: 'My Job Profile', 
      path: '/job-profile', 
      icon: Briefcase 
    },
    { 
      label: 'My Public Profile', 
      path: '/public-profile', 
      icon: Globe 
    },
    { 
      label: 'Get Verified', 
      path: '/get-verified', 
      icon: CheckCircle2, 
      badge: true,
      component: GetVerified 
    },
    { 
      label: 'Chats', 
      path: '/messages', 
      icon: MessageSquare,
      component: Messages 
    },
    { 
      label: 'Favorites', 
      path: '/favorites', 
      icon: Heart,
      component: Favorites 
    },
    { 
      label: 'My Searches', 
      path: '/searches', 
      icon: Search,
      component: Searches 
    },
    { 
      label: 'Car Appointments', 
      path: '/car-appointments', 
      icon: Car, 
      badge: 'NEW' 
    },
    { 
      label: 'My Bookmarks', 
      path: '/bookmarks', 
      icon: BookmarkPlus,
      component: Bookmarks 
    },
    { 
      label: 'Account Settings', 
      path: '/settings', 
      icon: SettingsIcon 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Settings" />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleItemClick(item.path)}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[#0487b3]" />
                </div>
                <div>
                  <h3 className="font-medium">{item.label}</h3>
                  <p className="text-sm text-gray-500">Manage your {item.label.toLowerCase()}</p>
                </div>
              </div>
              {item.badge && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.badge === true ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.badge === true ? 'Verify' : item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={activeModal === '/profile'}
        onClose={() => setActiveModal(null)}
        title="Edit Profile"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone_number}
              onChange={(e) => setProfile(prev => ({ ...prev, phone_number: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp
            </label>
            <input
              type="tel"
              value={profile.whatsapp}
              onChange={(e) => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your WhatsApp number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telegram
            </label>
            <input
              type="text"
              value={profile.telegram}
              onChange={(e) => setProfile(prev => ({ ...prev, telegram: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your Telegram username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter your address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={profile.country}
                onChange={(e) => setProfile(prev => ({ ...prev, country: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Enter your country"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#0487b3] text-white rounded-lg hover:bg-[#037299] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add similar modals for other sections... */}
    </div>
  );
}