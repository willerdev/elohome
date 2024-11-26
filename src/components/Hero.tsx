import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { debounce } from 'lodash';

const searchCategories = [
  { name: 'All', path: '/' },
  { name: 'Motors', path: '/category/motors' },
  { name: 'Jobs', path: '/category/jobs' },
  { name: 'Classifieds', path: '/category/classifieds' },
  { name: 'Property', path: '/category/property' },
  { name: 'New Projects', path: '/category/new-projects', isNew: true },
  { name: 'Community', path: '/category/community' },
];

interface Suggestion {
  id: number;
  title: string;
  category: string;
}

interface RelatedSearch {
  term: string;
  path: string;
}

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [relatedSearches, setRelatedSearches] = useState<RelatedSearch[]>([]);

  const saveSearch = async (query: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .insert([
          {
            user_id: user.id,
            query: query,
            filters: {},
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Save search if user is logged in
    if (user) {
      await saveSearch(searchQuery);
    }

    // Navigate to search page with query
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, category')
        .eq('status', 'active')
        .ilike('title', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Hero - Simple padding for search categories */}
      <div className="md:hidden px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {searchCategories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                category.name === 'All' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {category.name}
              {category.isNew && (
                <span className="ml-1 text-xs bg-green-500 text-white px-1.5 rounded">NEW</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Hero - Keep existing code */}
      <div className="hidden md:block">
        <div className="relative h-[300px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80"
              className="w-full h-full object-cover object-center"
              alt="Dubai Skyline"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-white mb-8">
              The best place to buy your house, sell your car or find a job in Elohome
            </h1>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600">Searching in</span>
                <div className="flex gap-2 overflow-x-auto">
                  {searchCategories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.path}
                      className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                        category.name === 'All' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                      {category.isNew && (
                        <span className="ml-1 text-xs bg-green-500 text-white px-1.5 rounded">NEW</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-grow relative" ref={suggestionsRef}>
                  <input
                    type="text"
                    placeholder="Search for anything..."
                    className="w-full pl-10 pr-4 py-3 rounded-md border-gray-300 border"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                      debouncedFetchSuggestions(e.target.value);
                    }}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  
                  {(showSuggestions && suggestions.length > 0) || searchQuery ? (
                    <div className="absolute w-full bg-white mt-1 rounded-md shadow-lg border">
                      {suggestions.length > 0 && (
                        <>
                          {suggestions.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSearchQuery(suggestion.title);
                                setShowSuggestions(false);
                              }}
                            >
                              {suggestion.title}
                            </div>
                          ))}
                          <div className="border-t" />
                        </>
                      )}
                      
                      <div className="p-3">
                        <div className="text-xs text-gray-500 mb-2">Related Searches</div>
                        <div className="flex flex-wrap gap-2">
                          {searchQuery === 'iphone' ? (
                            <>
                              <Link 
                                to="/search?q=iphone+13+pro"
                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                                onClick={() => setShowSuggestions(false)}
                              >
                                iphone 13 pro
                              </Link>
                              <Link 
                                to="/search?q=iphone+11"
                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                                onClick={() => setShowSuggestions(false)}
                              >
                                iphone 11
                              </Link>
                              <Link 
                                to="/search?q=iphone+14+pro"
                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                                onClick={() => setShowSuggestions(false)}
                              >
                                iphone 14 pro
                              </Link>
                              <Link 
                                to="/search?q=iphone+12+pro+max"
                                className="text-sm px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full"
                                onClick={() => setShowSuggestions(false)}
                              >
                                iphone 12 pro max
                              </Link>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-8 py-2 rounded-md hover:bg-red-700"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}