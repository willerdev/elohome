import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Search, Bell, Trash2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SavedSearch {
  id: string;
  user_id: string;
  query: string;
  filters: Record<string, any>;
  notifications_enabled: boolean;
  last_updated: string;
  new_listings_count: number;
}

export function Searches() {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSavedSearches();
  }, [user]);

  const fetchSavedSearches = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('last_updated', { ascending: false });

    if (error) {
      console.error('Error fetching saved searches:', error);
      return;
    }

    setSavedSearches(data || []);
    setLoading(false);
  };

  const toggleNotifications = async (searchId: string, currentState: boolean) => {
    const { error } = await supabase
      .from('saved_searches')
      .update({ notifications_enabled: !currentState })
      .eq('id', searchId);

    if (error) {
      console.error('Error updating notifications:', error);
      return;
    }

    setSavedSearches(searches =>
      searches.map(search =>
        search.id === searchId
          ? { ...search, notifications_enabled: !currentState }
          : search
      )
    );
  };

  const deleteSearch = async (searchId: string) => {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId);

    if (error) {
      console.error('Error deleting search:', error);
      return;
    }

    setSavedSearches(searches => searches.filter(search => search.id !== searchId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Saved Searches" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-[#0487b3]" />
          <h1 className="text-2xl font-bold">My Saved Searches</h1>
        </div>

        {savedSearches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No saved searches yet</h2>
            <p className="text-gray-600 mb-6">Save your searches to get notified when new listings match your criteria</p>
            <Link 
              to="/search"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0487b3] hover:bg-[#037299]"
            >
              Start Searching
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div key={search.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link 
                      to={`/search?q=${encodeURIComponent(search.query)}`}
                      className="text-lg font-medium hover:text-[#0487b3]"
                    >
                      {search.query}
                    </Link>
                    {search.new_listings_count > 0 && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {search.new_listings_count} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className={`p-2 rounded-full ${
                        search.notifications_enabled 
                          ? 'text-[#0487b3] bg-blue-50' 
                          : 'text-gray-400 hover:text-[#0487b3]'
                      }`}
                      onClick={() => toggleNotifications(search.id, search.notifications_enabled)}
                    >
                      <Bell className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500" onClick={() => deleteSearch(search.id)}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(search.filters).map(([key, value]) => (
                    <span 
                      key={key}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {value}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last updated: {search.last_updated}</span>
                  <Link 
                    to={`/search?q=${encodeURIComponent(search.query)}`}
                    className="text-[#0487b3] hover:underline"
                  >
                    View Results
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