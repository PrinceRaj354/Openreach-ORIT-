import React, { useState } from 'react';

const validPostcodes = ['EC1A 1BB', 'W1A 0AX', 'M1 1AE', 'B1 1AA'];

const LandingHero: React.FC = () => {
  const [postcode, setPostcode] = useState('');
  const [result, setResult] = useState<'available' | 'unavailable' | null>(null);

  const handleCheck = () => {
    const normalized = postcode.trim().toUpperCase();
    if (validPostcodes.includes(normalized)) {
      setResult('available');
    } else if (postcode.trim()) {
      setResult('unavailable');
    }
  };

  return (
    <div id="home" className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/1.jpeg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-[#073b4c] mb-4 leading-tight">
              We're building Full Fibre Broadband across the UK
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Enter your postcode to check fibre availability in your area
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="e.g. EC1A 1BB"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0a9c82] focus:ring-2 focus:ring-[#0a9c82]/20 outline-none text-lg"
              />
              <button
                onClick={handleCheck}
                className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all whitespace-nowrap"
              >
                Check postcode
              </button>
            </div>

            {result === 'available' && (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-600 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">Full Fibre available in your area</h3>
                    <p className="text-green-800 mb-1">Estimated speed: <span className="font-bold">1Gbps</span></p>
                    <p className="text-green-800">Installation possible within <span className="font-bold">7–10 working days</span></p>
                  </div>
                </div>
              </div>
            )}

            {result === 'unavailable' && (
              <div className="bg-orange-50 border-2 border-orange-500 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-600 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <h3 className="text-xl font-bold text-orange-900 mb-2">Service not available yet in this region</h3>
                    <p className="text-orange-800">We're working to expand our network. Check back soon.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHero;
