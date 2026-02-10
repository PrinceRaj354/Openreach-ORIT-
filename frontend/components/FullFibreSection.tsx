import React from 'react';

const FullFibreSection: React.FC = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: 'url(/2.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold text-[#073b4c] mb-6 leading-tight">
              Openreach's Full Fibre Upgrade Reaches 20 Million
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              The UK's broadband upgrade has reached 20 million premises — in nearly every community. Find out more about the benefits and why it's important to upgrade to Full Fibre.
            </p>
            <button className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              Read more
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullFibreSection;
