import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export function PageHeader({ title, onBack, rightContent }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
      <button 
        onClick={handleBack}
        className="p-1 -ml-1 hover:bg-gray-100 rounded-full"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-semibold flex-grow">{title}</h1>
      {rightContent}
    </div>
  );
}