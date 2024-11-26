import React from 'react';
import { PageHeader } from '../components/PageHeader';

export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Terms of Use" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Terms of Use</h1>
          
          <div className="prose prose-blue max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on EloHome's website for personal, non-commercial transitory viewing only.</p>

            <h2>3. User Account</h2>
            <p>To use certain features of the website, you must register for an account. You agree to provide accurate information during the registration process and to update such information to keep it accurate.</p>

            <h2>4. Listing Rules</h2>
            <ul>
              <li>All listings must be accurate and truthful</li>
              <li>Items must be legal to sell</li>
              <li>Images must be of the actual item</li>
              <li>Pricing must be reasonable and in local currency</li>
            </ul>

            <h2>5. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following activities:</p>
            <ul>
              <li>Violating laws or regulations</li>
              <li>Posting false or misleading information</li>
              <li>Impersonating others</li>
              <li>Interfering with the proper working of the website</li>
            </ul>

            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}