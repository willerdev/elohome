import React, { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { BookmarkPlus, MapPin, Calendar, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Bookmark {
  id: number;
  title: string;
  description: string;
  filters: Record<string, string>;
  last_updated: string;
  total_listings: number;
}

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (bookmarkId: number) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setBookmarks(prevBookmarks => 
        prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId)
      );
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      alert('Error deleting bookmark. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Bookmarks" />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Bookmarks" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <BookmarkPlus className="w-6 h-6 text-[#0487b3]" />
          <h1 className="text-2xl font-bold">My Bookmarks</h1>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <BookmarkPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No bookmarks yet</h2>
            <p className="text-gray-600 mb-6">
              Save your searches to quickly access them later
            </p>
            <Link 
              to="/search"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0487b3] hover:bg-[#037299]"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{bookmark.title}</h3>
                    <p className="text-gray-600 text-sm">{bookmark.description}</p>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(bookmark.filters).map(([key, value]) => (
                    <span 
                      key={key}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm border-t pt-4">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Updated {bookmark.last_updated}</span>
                    </div>
                    <span>{bookmark.total_listings} listings</span>
                  </div>
                  <Link 
                    to={`/search?bookmark=${bookmark.id}`}
                    className="flex items-center gap-1 text-[#0487b3] hover:underline"
                  >
                    <span>View Results</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}