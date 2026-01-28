
import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { InventoryItem } from '../types';

const InventoryPage: React.FC = () => {
  const { inventory } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.exchange.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-50 border-green-100';
      case 'Low': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Out of Stock': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Operational Inventory</h2>
          <p className="text-gray-500">Manage and audit local exchange hardware stock levels</p>
        </div>
        
        <div className="flex gap-3">
           <div className="relative">
             <input 
               type="text" 
               placeholder="Search parts or exchanges..." 
               className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-[#550065] outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
           
           <select 
             className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#550065] outline-none"
             value={filterCategory}
             onChange={(e) => setFilterCategory(e.target.value)}
           >
             <option value="All">All Categories</option>
             <option value="Hardware">Hardware</option>
             <option value="Cable">Cable</option>
             <option value="Fibre">Fibre</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Assets</div>
            <div className="text-2xl font-bold text-[#550065]">{inventory.length}</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Critical Stock Alerts</div>
            <div className="text-2xl font-bold text-amber-600">{inventory.filter(i => i.status === 'Low').length}</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Outage (Fibre/Ports)</div>
            <div className="text-2xl font-bold text-red-600">{inventory.filter(i => i.status === 'Out of Stock').length}</div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Primary Exchanges</div>
            <div className="text-2xl font-bold text-blue-600">14 Active</div>
         </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Exchange</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">In Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-800">{item.name}</div>
                  <div className="text-[10px] font-mono text-gray-400 mt-0.5">{item.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{item.exchange}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">{item.category}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-gray-800">{item.stock}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-[#550065] hover:underline text-xs font-bold">Request Transfer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredItems.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-gray-400">
             <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
             <span className="font-medium">No inventory items matching your criteria.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
