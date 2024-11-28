import React, { useEffect, useState } from 'react';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FavoriteItem {
  id: number;
  listing: {
    id: number;
    title: string;
    price: string;
    location: string;
    images: string[];
  };
}

export function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data: favoriteIds, error: idsError } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (idsError) throw idsError;

      const listingIds = favoriteIds?.map(item => item.listing_id) || [];

      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          price,
          location,
          images
        `)
        .in('id', listingIds);

      if (error) throw error;
      const formattedData: FavoriteItem[] = data?.map(item => ({
        id: item.id,
        listing: item
      })) || [];
      setFavorites(formattedData);
    } catch (error) {
     // console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: number) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      setFavorites(prevFavorites => 
        prevFavorites.filter(fav => fav.id !== favoriteId)
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing from favorites. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Favorites" />
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
      <PageHeader title="Favorites" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-[#0487b3]" />
          <h1 className="text-2xl font-bold">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Start adding items to your favorites to keep track of listings you're interested in
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0487b3] hover:bg-[#037299]"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="flex">
                  <div className="w-48 h-32">
                    <img
                      src={item.listing.images[0]}
                      alt={item.listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/product/${item.listing.id}`}
                          className="text-lg font-medium hover:text-[#0487b3]"
                        >
                          {item.listing.title}
                        </Link>
                        <p className="text-[#0487b3] font-bold">{item.listing.price}</p>
                        <p className="text-sm text-gray-500">{item.listing.location}</p>
                      </div>
                      <button className="p-2 text-red-500" onClick={() => removeFavorite(item.id)}>
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>
                    
                    {/* <div className="flex gap-2 mt-4 pt-4 border-t">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-[#0487b3]">
                        <MessageCircle className="w-5 h-5" />
                        <span>Message</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-[#0487b3]">
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}