import React from 'react';

export const Settings: React.FC = () => (
  <div className="p-6">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Number
          </label>
          <input
            type="tel"
            defaultValue="5654567778"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMS Number
          </label>
          <input
            type="tel"
            defaultValue="6675677757"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">AI Assistant</h3>
            <p className="text-sm text-gray-500">Enable AI support via WhatsApp/SMS</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </div>
  </div>
);