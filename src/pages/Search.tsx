import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

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
  image: string;
  verified: boolean;
}

const mockSearchResults: Listing[] = [
  {
    id: 1,
    title: '2023 Mercedes-Benz G63 AMG',
    price: 'AED 950,000',
    location: 'Dubai Marina',
    specs: {
      type: 'Car',
      year: '2023',
      mileage: '57,000 km'
    },
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80',
    verified: true,
  },
  {
    id: 2,
    title: 'Luxury Apartment with Gate Avenue View',
    price: 'AED 120,000',
    location: 'Central Park Residence Tower, DIFC',
    specs: {
      beds: 2,
      baths: 3,
      sqft: '1,610',
      type: 'Apartment',
    },
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
    verified: true,
  },
];

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Relevant', value: 'relevant' },
];

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selectedSort, setSelectedSort] = React.useState('newest');

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [query, category]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('search') as string;
    setSearchParams({ q: newQuery, category });
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Reuse CategoryListingSkeleton from your CategoryPage
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
            mockSearchResults.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={item.image}
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
                        <span>{item.specs.year}</span>
                        <span>{item.specs.mileage}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}