import React, { useState } from 'react';
import { UserPlus, Search, Send } from 'lucide-react';
import { Contact } from '../types';
import { supabase } from '../lib/supabase';

interface ContactsProps {
  contacts: Contact[];
  onContactAdded: (contact: Contact) => void;
  onSend: (contact: Contact) => void;
}

export const Contacts: React.FC<ContactsProps> = ({ contacts, onContactAdded, onSend }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({});

  const handleAddContact = async () => {
    if (newContact.name && newContact.address) {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .insert([{
            name: newContact.name,
            address: newContact.address,
            email: newContact.email,
          //  user_id: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();

        if (error) {
          console.error('Error adding contact:', error);
          alert('Failed to add contact. Please try again.');
          return;
        }

        onContactAdded(data as Contact);
        setNewContact({});
        setShowAddContact(false);
      } catch (error) {
        console.error('Error adding contact:', error);
        alert('Failed to add contact. Please try again.');
      }
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Contacts</h2>
          <button
            onClick={() => setShowAddContact(true)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <UserPlus size={20} />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        {showAddContact && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Add New Contact</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name || ''}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Wallet Address"
                value={newContact.address || ''}
                onChange={(e) => setNewContact(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newContact.email || ''}
                onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddContact}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Contact
                </button>
                <button
                  onClick={() => {
                    setShowAddContact(false);
                    setNewContact({});
                  }}
                  className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border"
            >
              <div>
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-500">{contact.address}</div>
                {contact.email && (
                  <div className="text-sm text-gray-500">{contact.email}</div>
                )}
              </div>
              <button 
                onClick={() => onSend(contact)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};