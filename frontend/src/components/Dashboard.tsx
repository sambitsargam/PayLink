import React from 'react';
import { Send, PlusCircle, ChevronRight } from 'lucide-react';
import { Contact } from '../types';

interface DashboardProps {
  contacts: Contact[];
  onSend: (contact: Contact) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ contacts, onSend }) => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Balance</h2>
        <div className="text-3xl font-bold">2.45 ETH</div>
      </div>
      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
          <Send size={20} />
          <span>Send Money</span>
        </button>
        <button className="flex items-center space-x-2 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
          <PlusCircle size={20} />
          <span>Add Money</span>
        </button>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Contacts</h3>
      <div className="space-y-4">
        {contacts.slice(0, 3).map((contact) => (
          <div 
            key={contact.id} 
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
            onClick={() => onSend(contact)}
          >
            <div>
              <div className="font-medium">{contact.name}</div>
              <div className="text-sm text-gray-500">{contact.address}</div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  </div>
);