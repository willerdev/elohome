import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingSkeleton } from './ListingSkeleton';

const carListings = [
  {
    id: 1,
    title: 'Ford • Mustang • Ecoboost',
    price: 'Frw 82,000,000',
    specs: '2022 • 57,000 km',
    location: 'Kigali Heights',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'BMW • X6 M • Competition',
    price: 'Frw 445,000,000',
    specs: '2023 • 15,000 km',
    location: 'Nyarugenge',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Mercedes-Benz • G63 AMG',
    price: 'Frw 990,000,000',
    specs: '2023 • 0 km',
    location: 'Kimihurura',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Porsche • 911 GT3',
    price: 'Frw 820,000,000',
    specs: '2022 • 8,500 km',
    location: 'Gacuriro',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Range Rover • Sport',
    price: 'Frw 480,000,000',
    specs: '2023 • 12,000 km',
    location: 'Kibagabaga',
    image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80',
  },
];

const propertyListings = [
  {
    id: 101,
    title: '2 Beds • 3 Baths',
    price: 'Frw 1,200,000',
    location: 'Vision City, Gacuriro',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80',
  },
  {
    id: 102,
    title: '3 Beds • 4 Baths',
    price: 'Frw 2,500,000',
    location: 'Kigali Heights, Kimihurura',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80',
  },
  {
    id: 103,
    title: '1 Bed • 2 Baths',
    price: 'Frw 800,000',
    location: 'Century Park, Nyarutarama',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80',
  },
  {
    id: 104,
    title: 'Studio • 1 Bath',
    price: 'Frw 500,000',
    location: 'M Peace Plaza, Nyarugenge',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80',
  },
  {
    id: 105,
    title: '4 Beds • 5 Baths',
    price: 'Frw 3,500,000',
    location: 'Golf View Villas, Nyarutarama',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
  },
];

function ListingSection({ title, items }: { title: string; items: typeof carListings | typeof propertyListings }) {
  const [loading, setLoading] = React.useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
        {loading
          ? [...Array(4)].map((_, i) => <ListingSkeleton key={i} />)
          : items.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="flex-none w-[280px] md:w-[280px] w-[196px] group"
              >
                <div className="h-[210px] md:h-[210px] h-[147px] relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xl font-bold text-red-600 mb-1">{item.price}</p>
                  <h3 className="font-medium text-base mb-1">{item.title}</h3>
                  {'specs' in item && (
                    <p className="text-sm text-gray-600 mb-1">{item.specs}</p>
                  )}
                  <p className="text-sm text-gray-600">{item.location}</p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

export function Listings() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <ListingSection title="Residential for Rent" items={propertyListings} />
      <ListingSection title="Cars" items={carListings} />
    </div>
  );
}