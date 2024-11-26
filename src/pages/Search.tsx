import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, MapPin, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Reusing the listing type from CategoryPage
interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  specs: {
    beds?: number;
    baths?: number;
    sqft?: string;
    type?: string;
    year?: string;
    mileage?: string;
  };
  images: string[];
  verified: boolean;
}

export function Search() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedSort, setSelectedSort] = React.useState('newest');
  const [listings, setListings] = React.useState<Listing[]>([]);
  const { user } = useAuth();
  const [favorites, setFavorites] = React.useState<number[]>([]);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';

  // Fetch listings from Supabase
  React.useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        let queryBuilder = supabase
          .from('listings')
          .select('*')
          .eq('status', 'active');

        // Add search query filter
        if (query) {
          queryBuilder = queryBuilder
            .or(`title.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%`);
        }

        // Add category filter
        if (category && category !== 'all') {
          queryBuilder = queryBuilder.eq('category', category);
        }

        // Add sorting
        switch (selectedSort) {
          case 'price_asc':
            queryBuilder = queryBuilder.order('price');
            break;
          case 'price_desc':
            queryBuilder = queryBuilder.order('price', { ascending: false });
            break;
          case 'newest':
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
            break;
          default:
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
        }

        // Log the query details
        console.log('Query Details:', {
          table: 'listings',
          filters: {
            status: 'active',
            titleSearch: query ? `%${query}%` : null,
            category: category !== 'all' ? category : null,
          },
          sort: selectedSort
        });

        // After building the query but before executing it
        console.log('Search Query:', {
          searchTerm: query,
          category: category,
          filters: {
            status: 'active',
            searchFields: ['title', 'description', 'category'],
            query: ``
          }
        });

        const { data, error } = await queryBuilder;

        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [query, category, selectedSort]);

  // Add this effect to fetch favorites when component mounts
  React.useEffect(() => {
    async function fetchFavorites() {
      if (!user) return;
      const { data } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);
      setFavorites(data?.map(f => f.listing_id) || []);
    }
    fetchFavorites();
  }, [user]);

  // Save search to saved_searches table
  const saveSearch = async () => {
    if (!user || !query) return;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .insert([
          {
            user_id: user.id,
            query: query,
            filters: { category },
            notifications_enabled: false,
            last_updated: new Date().toISOString(),
            new_listings_count: 0
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('search') as string;
    setSearchParams({ q: newQuery, category });

    // Save search if user is logged in
    if (user) {
      saveSearch();
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, listingId: number) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/login');
      return;
    }

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single();

      if (data) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: listingId,
            created_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error updating favorite status. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Search"
        rightContent={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Filter className="w-5 h-5" />
          </button>
        }
      />

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {listings.length === 0 && !loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">No listings found</h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or browse all categories
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0487b3] hover:bg-[#037299]"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                  <div className="relative aspect-video bg-gray-200" />
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-gray-200 rounded" />
                      <div className="h-4 w-48 bg-gray-200 rounded" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              listings.map((item) => (
                <div key={item.id} className="relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <Link
                    to={`/product/${item.id}`}
                    className="block"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {item.verified && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                          <svg 
                            viewBox="0 0 24 24" 
                            className="w-3.5 h-3.5 text-green-500 fill-current"
                          >
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
                          </svg>
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xl font-semibold text-[#0487b3] mb-1">{item.price}</p>
                      <h3 className="font-medium mb-2">{item.title}</h3>
                      <div className="flex gap-4 text-sm text-gray-600">
                        {item.specs && item.specs.beds ? (
                          <>
                            <span>{item.specs.beds} beds</span>
                            <span>{item.specs.baths} baths</span>
                            <span>{item.specs.sqft} sqft</span>
                          </>
                        ) : item.specs ? (
                          <>
                            <span>{item.specs.year}</span>
                            <span>{item.specs.mileage}</span>
                          </>
                        ) : null}
                      </div>
                      <div className="mt-2">
                        <button
                          onClick={(e) => handleToggleFavorite(e, item.id)}
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          {favorites.includes(item.id) ? (
                            <Heart className="w-4 h-4 text-red-500" />
                          ) : (
                            <Heart className="w-4 h-4 text-gray-500" />
                          )}
                          <span className="ml-1">
                            {favorites.includes(item.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}