import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Search, Heart, Phone, MessageSquare, X, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHeader } from '../components/PageHeader';

interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  images: string[];
  specs: {
    beds?: number | null;
    baths?: number | null;
    sqft?: string | null;
    type?: string;
    year?: string | null;
    mileage?: string | null;
  };
  verified: boolean;
  status: 'active' | 'pending';
  category: string;
}

const CATEGORY_MAPPINGS = {
  motors: 'Motors',
  property: 'Property',
  jobs: 'Jobs',
  classifieds: 'Classifieds'
} as const;

export function CategoryPage() {
  const { category } = useParams();
  const [showFilters, setShowFilters] = React.useState(false);
  const [showCallModal, setShowCallModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<Listing | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [listings, setListings] = React.useState<Listing[]>([]);

  // Get the exact category name from our mappings
  const exactCategory = category ? CATEGORY_MAPPINGS[category.toLowerCase() as keyof typeof CATEGORY_MAPPINGS] : 'Property';

  React.useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        
        // Simple exact match query for the category
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .ilike('category', `%${exactCategory}%`);

        if (error) {
          console.error('Error:', error);
          throw error;
        }

        console.log('Fetched data:', data);
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [exactCategory]);

  const renderListingCard = (item: Listing) => (
    <Link
      key={item.id}
      to={`/product/${item.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
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
        <p className="text-xl font-semibold text-[#0487b3] mb-1">AED {item.price}</p>
        <h3 className="font-medium mb-2">{item.title}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{item.location}</span>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          {item.specs.beds ? (
            <>
              <span>{item.specs.beds} beds</span>
              <span>{item.specs.baths} baths</span>
              <span>{item.specs.sqft} sqft</span>
            </>
          ) : (
            <>
              {item.specs.year && <span>{item.specs.year}</span>}
              {item.specs.mileage && <span>{item.specs.mileage}</span>}
            </>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={exactCategory} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{listings.length} results</span>
          </div>
        </div>

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
          ) : listings.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">No listings found</h2>
                <p className="text-gray-600 mb-6">
                  No {exactCategory} listings are available at the moment.
                </p>
                <Link 
                  to="/"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0487b3] hover:bg-[#037299]"
                >
                  Browse All Categories
                </Link>
              </div>
            </div>
          ) : (
            listings.map(renderListingCard)
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}