import React from 'react';
import { X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentCompany: string;
  propertyReference: string;
}

export function ContactModal({ isOpen, onClose, agentName, agentCompany, propertyReference }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 transform transition-transform duration-600 ease-out">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80"
              alt={agentName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{agentName}</h3>
            <p className="text-gray-600 text-sm">{agentCompany}</p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="bg-red-50 p-4 rounded-xl mb-6">
          <p className="text-sm text-gray-700">
            Don't forget to mention the property reference{' '}
            <span className="text-red-600 font-semibold">{propertyReference}</span>
            {' '}when you call.
          </p>
        </div>

        <a
          href="tel:+971501234567"
          className="block w-full bg-red-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Call
        </a>
      </div>
    </>
  );
}