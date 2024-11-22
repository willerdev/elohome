import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MobileSearch() {
  const navigate = useNavigate();

  const handleSearchFocus = () => {
    navigate('/search');
  };

  return (
    <div className="md:hidden px-4 py-2 bg-white border-b">
      <div className="relative">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm"
          onFocus={handleSearchFocus}
          readOnly
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}