import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingSkeleton } from './ListingSkeleton';
import { supabase } from '../lib/supabase';

interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  images: string[];
  specs?: string;
  category: string;
  status: 'active' | 'pending';
  created_at: string;
  views: number;
  messages: number;
}

function ListingSection({ title, category }: { title: string; category: string }) {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<Listing[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .ilike('category', `%${category}%`)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [category]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        {loading ? (
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        ) : (
          <h2 className="text-xl md:text-2xl font-bold">Popular in {title}</h2>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {loading ? (
          [...Array(4)].map((_, i) => <ListingSkeleton key={i} />)
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              className="flex-none w-[280px] group"
            >
              <div className="h-[210px] relative overflow-hidden rounded-lg mb-3">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xl font-bold text-red-600 mb-1">
                  AED {item.price}
                </p>
                <h3 className="font-medium text-base mb-1">{item.title}</h3>
                {item.specs && (
                  <p className="text-sm text-gray-600 mb-1">{item.specs}</p>
                )}
                <p className="text-sm text-gray-600">{item.location}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export function Listings() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <ListingSection title="Cars" category="cars" />
      <ListingSection title="Properties" category="property" />
    </div>
  );
}