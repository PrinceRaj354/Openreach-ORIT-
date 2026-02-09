import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UserRole } from '../types';
import Navbar from '../components/Navbar';
import LandingHero from '../components/LandingHero';
import Testimonials from '../components/Testimonials';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [username, setUsername] = useState('sarah.ops');
  const [role, setRole] = useState<UserRole>(UserRole.ORIT_OPS);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, role);
    if (success) {
      navigate(role === UserRole.ORIT_OPS ? '/dashboard' : '/field-jobs');
    } else {
      setError('Invalid credentials for selected role.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={() => setShowLoginModal(true)} />
      <LandingHero />
      <Testimonials />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-[#0a9c82] animate-in zoom-in-95 duration-300">
            <div className="bg-[#073b4c] p-8 text-center relative">
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="inline-block bg-white rounded p-2 mb-4">
                <div className="w-10 h-10 bg-[#0a9c82] rounded-sm"></div>
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-[#0a9c82] focus:border-[#0a9c82] outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-[#0a9c82] focus:border-[#0a9c82] outline-none transition-all"
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
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${role === UserRole.ORIT_OPS ? 'border-[#0a9c82] bg-teal-50 text-[#0a9c82]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    ORIT Ops
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole(UserRole.FIELD_AGENT); setUsername('emma.engineer'); }}
                    className={`py-3 rounded-xl border-2 text-sm font-medium transition-all ${role === UserRole.FIELD_AGENT ? 'border-[#0a9c82] bg-teal-50 text-[#0a9c82]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                  >
                    Field Agent
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] hover:shadow-lg text-white py-4 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                Authenticate Access
              </button>

              <p className="text-center text-xs text-gray-400 mt-4">
                Authorized personnel only. Use of this system is subject to Openreach Security Policies.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
