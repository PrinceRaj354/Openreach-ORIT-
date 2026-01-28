
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('sarah.ops');
  const [role, setRole] = useState<UserRole>(UserRole.ORIT_OPS);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, role);
    if (success) {
      navigate(role === UserRole.ORIT_OPS ? '/dashboard' : '/jobs');
    } else {
      setError('Invalid credentials for selected role.');
    }
  };

  return (
    <div className="min-h-screen bg-[#550065] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#002D72] p-8 text-center">
          <div className="inline-block bg-white rounded p-2 mb-4">
             <div className="w-10 h-10 bg-[#550065] rounded-sm"></div>
          </div>
          <h2 className="text-white text-2xl font-bold">Openreach ORIT</h2>
          <p className="text-blue-100 text-sm mt-1 uppercase tracking-wider">Internal Operations Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">{error}</div>}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Enterprise ID</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. sarah.ops"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              value="password"
              disabled
            />
            <p className="text-[10px] text-gray-400 mt-1">Single Sign-On (SSO) enabled</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Operational Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setRole(UserRole.ORIT_OPS); setUsername('sarah.ops'); }}
                className={`py-3 rounded-lg border text-sm font-medium transition-all ${role === UserRole.ORIT_OPS ? 'border-[#550065] bg-purple-50 text-[#550065]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                ORIT Ops
              </button>
              <button
                type="button"
                onClick={() => { setRole(UserRole.FIELD_AGENT); setUsername('emma.engineer'); }}
                className={`py-3 rounded-lg border text-sm font-medium transition-all ${role === UserRole.FIELD_AGENT ? 'border-[#550065] bg-purple-50 text-[#550065]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Field Agent
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#550065] hover:bg-[#3a0045] text-white py-4 rounded-lg font-bold shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
          >
            Authenticate Access
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Authorized personnel only. Use of this system is subject to Openreach Security Policies.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
