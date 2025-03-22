import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Send, PlusCircle, ChevronRight } from 'lucide-react';
import { DaimoPayButton } from "@daimo/pay";
import { getAddress } from "viem";
import { mantleMNT } from "@daimo/contract";
import { Contact } from '../types';

interface DashboardProps {
  contacts: Contact[];
  onSend: (contact?: Contact) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ contacts, onSend }) => {
  const [balance, setBalance] = useState<string>('Loading...');
  const [showDaimo, setShowDaimo] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const rawBalance = await provider.getBalance(address);
          const formattedBalance = ethers.formatEther(rawBalance);
          setBalance(`${parseFloat(formattedBalance).toFixed(4)} MNT`);
          setAddress(address);
        } else {
          setBalance('Wallet not connected');
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance('Error fetching balance');
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Balance</h2>
          <div className="text-3xl font-bold">{balance}</div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => onSend()}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Send size={20} />
            <span>Send Money</span>
          </button>
          <button
            onClick={() => setShowDaimo(true)}
            className="flex items-center space-x-2 border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Add Money</span>
          </button>
        </div>

        {showDaimo && (
          <div className="mt-4">
            <DaimoPayButton
              appId="daimopay-demo"
              toChain={mantleMNT.chainId}
              toAddress={getAddress(address)}
              toToken={getAddress(mantleMNT.token)}
              intent="Deposit"
             // onClose={() => setShowDaimo(false)}
            />
          </div>
        )}
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
};
