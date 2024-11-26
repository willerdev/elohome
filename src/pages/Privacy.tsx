import React from 'react';
import { PageHeader } from '../components/PageHeader';

export function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Privacy Policy" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="prose prose-blue max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Profile information</li>
              <li>Transaction data</li>
              <li>Communications with us</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send you notifications and updates</li>
              <li>Improve our services</li>
              <li>Protect against fraud and abuse</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Other users (as necessary for transactions)</li>
              <li>Service providers</li>
              <li>Law enforcement (when required)</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
              <li>Data portability</li>
            </ul>

            {/* Add more sections as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}