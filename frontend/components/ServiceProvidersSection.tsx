import React from 'react';

const ServiceProvidersSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#073b4c] via-[#0a5f6f] to-[#0a9c82]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[18px] shadow-2xl p-8 md:p-12 lg:p-16 hover:shadow-3xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0a9c82] leading-tight">
                650+ Service providers
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                With a wide range of service providers to choose from, connecting to our network has never been easier.
              </p>
            </div>

            {/* Right Side - Image */}
            <div className="flex justify-center">
              <img 
                src="/3.jpeg" 
                alt="Service Providers" 
                className="w-full h-auto rounded-xl shadow-lg hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceProvidersSection;
