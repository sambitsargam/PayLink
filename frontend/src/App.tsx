import React, { useState, useEffect } from 'react';
import { Home, Users, Newspaper, Wallet2, Settings } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Contact } from './types';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { Contacts } from './components/Contacts';
import { Settings as SettingsComponent } from './components/Settings';

type Tab = 'dashboard' | 'contacts' | 'feed' | 'multisig' | 'settings';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (isConnected) {
      loadContacts();
    }
  }, [isConnected]);

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading contacts:', error);
        return;
      }
      setContacts(data || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };
  
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleSend = async (contact: Contact) => {
    // Here you would implement the send money functionality
    // For now, we'll just show an alert
    alert(`Sending money to ${contact.name} (${contact.address})`);
  };

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: any, label: string, tab: Tab }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-3 p-3 w-full rounded-lg transition-colors ${
        activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  if (!isConnected) {
    return <Landing onConnect={connectWallet} />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-indigo-700">PayLink</h1>
        </div>
        
        <nav className="space-y-2">
          <SidebarItem icon={Home} label="Dashboard" tab="dashboard" />
          <SidebarItem icon={Users} label="Contacts" tab="contacts" />
          <SidebarItem icon={Newspaper} label="Feed" tab="feed" />
          <SidebarItem icon={Wallet2} label="Multisig Wallet" tab="multisig" />
          <SidebarItem icon={Settings} label="Settings" tab="settings" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <Dashboard contacts={contacts} onSend={handleSend} />}
        {activeTab === 'contacts' && (
          <Contacts 
            contacts={contacts} 
            onContactAdded={(contact) => setContacts(prev => [contact, ...prev])}
            onSend={handleSend}
          />
        )}
        {activeTab === 'settings' && <SettingsComponent />}
        {activeTab === 'feed' && (
          <div className="h-full">
            <iframe src="http://localhost:5173" className="w-full h-full" />
          </div>
        )}
        {activeTab === 'multisig' && (
          <div className="h-full">
            <iframe src="http://localhost:3000" className="w-full h-full" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;