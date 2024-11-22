import React from 'react';
import { Car, Home, Briefcase, Package, Sofa, Smartphone, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: 'Motors',
    icon: Car,
    items: [
      { name: 'Cars', isNew: false },
      { name: 'Rental Cars', isNew: true },
      { name: 'New Cars', isNew: false },
      { name: 'Export Cars', isNew: false },
    ],
    viewAll: 'All in Motors'
  },
  {
    title: 'Property for Rent',
    icon: Home,
    items: [
      { name: 'Residential', isNew: false },
      { name: 'Commercial', isNew: false },
      { name: 'Rooms For Rent', isNew: false },
      { name: 'Monthly Short Term', isNew: false },
    ],
    viewAll: 'All in Property for Rent'
  },
  {
    title: 'Property for Sale',
    icon: Home,
    items: [
      { name: 'Residential', isNew: false },
      { name: 'Commercial', isNew: false },
      { name: 'New Projects', isNew: true },
      { name: 'Off-Plan', isNew: false },
    ],
    viewAll: 'All in Property for Sale'
  },
  {
    title: 'Classifieds',
    icon: Package,
    items: [
      { name: 'Electronics', isNew: false },
      { name: 'Computers & Networking', isNew: false },
      { name: 'Clothing & Accessories', isNew: false },
      { name: 'Jewelry & Watches', isNew: false },
    ],
    viewAll: 'All in Classifieds'
  },
  {
    title: 'Jobs',
    icon: Briefcase,
    items: [
      { name: 'Accounting / Finance', isNew: false },
      { name: 'Engineering', isNew: false },
      { name: 'Sales / Business Development', isNew: false },
      { name: 'Secretarial / Front Office', isNew: false },
    ],
    viewAll: 'All in Jobs'
  }
];

export function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Mobile Categories Grid */}
      <div className="md:hidden grid grid-cols-3 gap-2 ">
        {categories.map((category) => (
          <Link
            key={category.title}
            to={`/category/${category.title.toLowerCase().split(' ')[0]}`}
            className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-lg"
          >
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <category.icon className="w-8 h-8 text-red-600" />
            </div>
            <span className="text-xs text-center text-gray-700">
              {category.title.split(' ')[0]}
            </span>
          </Link>
        ))}
      </div>

      {/* Desktop Categories - Keep existing code */}
      <div className="hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Popular Categories</h2>
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div key={category.title} className="space-y-4 border border-gray-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <category.icon className="w-5 h-5 text-[#0487b3] md:hidden" />
                <span className="hidden md:block">{category.title}</span>
                <span className="md:hidden text-sm">{category.title.split(' ')[0]}</span>
              </div>
              <ul className="space-y-2 hidden md:block">
                {category.items.map((item) => (
                  <li key={item.name}>
                    <a href="#" className="text-gray-600 hover:text-[#0487b3] flex items-center">
                      {item.name}
                      {item.isNew && (
                        <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                          NEW
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className="hidden md:inline-flex items-center text-[#0487b3] hover:underline"
              >
                {category.viewAll}
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}