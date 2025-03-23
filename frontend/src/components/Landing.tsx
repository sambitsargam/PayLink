import React, { useState } from 'react';
import { IDKitWidget } from '@worldcoin/idkit';
import { ArrowRight, Shield, Users, MessageSquare, Wallet } from 'lucide-react';

interface LandingProps {
  onConnect: () => Promise<void>;
}

export const Landing: React.FC<LandingProps> = ({ onConnect }) => {
  // Track if the user has passed the World ID verification.
  const [verified, setVerified] = useState(false);

  // Called when the verification is successful.
  const handleVerificationSuccess = (result: any) => {
    console.log('Verification successful:', result);
    setVerified(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">PayLink</h1>
        {/* Show Connect Wallet if verified, otherwise show the World ID verification button */}
        {verified ? (
          <button
            onClick={onConnect}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 group"
          >
            <span>Connect Wallet</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </button>
        ) : (
          <IDKitWidget
            app_id="app_staging_6b189046f977f2a3384efa1f350e4c43" // Your app id from the Developer Portal
            action="vote_1" // Your action name from the Developer Portal
            signal="user_value" // Arbitrary value or user identifier
            onSuccess={handleVerificationSuccess}
          //  verification_level="device" // Minimum verification level (defaults to "orb")
          >
            {({ open }) => (
              <button
                onClick={open}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 group"
              >
                <span>Verify with World ID</span>
              </button>
            )}
          </IDKitWidget>
        )}
      </nav>
      
      <main className="container mx-auto px-6">
        <div className="py-20 max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            Smart Payments. Anywhere.
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Experience the future of payments with our secure, intelligent, and user-friendly platform.
            Send crypto seamlessly with AI-powered assistance and enhanced security features.
          </p>
          
          {/* Only allow "Get Started Now" if the user is verified */}
          {verified && (
            <button
              onClick={onConnect}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Now
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          {[
            { icon: Users, title: 'Contact Book', desc: 'Manage your crypto contacts with ease' },
            { icon: Shield, title: 'Smart Security', desc: 'Advanced protection for your assets' },
            { icon: MessageSquare, title: 'AI Assistant', desc: '24/7 WhatsApp/SMS support' },
            { icon: Wallet, title: 'Multisig Wallet', desc: 'Enhanced transaction security' }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <feature.icon size={32} className="text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mb-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Why Choose PayLink?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Secure</h4>
              <p className="text-indigo-100">Military-grade encryption for all transactions</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Fast</h4>
              <p className="text-indigo-100">Lightning-quick transfers across the globe</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Smart</h4>
              <p className="text-indigo-100">AI-powered assistance at your fingertips</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0">© 2025 PayLink. All rights reserved.</div>
          <div className="flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Docs</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
