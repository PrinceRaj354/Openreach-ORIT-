import React, { useState } from 'react';

const SupportPage: React.FC = () => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIssueType('');
      setDescription('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-[#002D72] mb-2">Technical Support</h2>
        <p className="text-gray-600 text-sm mb-6">Report any technical issues or concerns</p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <div className="text-green-600 text-4xl mb-3">✓</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Issue Submitted</h3>
            <p className="text-sm text-green-700">Our support team will contact you shortly</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-150"
              >
                <option value="">Select issue type...</option>
                <option value="app">Mobile App Issue</option>
                <option value="equipment">Equipment Problem</option>
                <option value="connectivity">Network/Connectivity</option>
                <option value="access">Site Access Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-150 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#550065] to-[#7a0085] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-150"
            >
              Submit Issue
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-[#002D72] mb-3">Emergency Contact</h3>
        <p className="text-sm text-gray-700 mb-2">For urgent issues, contact:</p>
        <p className="text-lg font-bold text-[#550065]">0800 023 2023</p>
      </div>
    </div>
  );
};

export default SupportPage;
