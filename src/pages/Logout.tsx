import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Logout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        navigate('/');
      } catch (error) {
        console.error('Error signing out:', error);
        navigate('/');
      }
    };

    performLogout();
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0487b3] mx-auto mb-4"></div>
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}