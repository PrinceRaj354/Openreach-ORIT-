
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { ORIT_ANALYTICS } from '../constants';

const AnalyticsPage: React.FC = () => {
  const data = ORIT_ANALYTICS;

  const pieData = [
    { name: 'Successful', value: data.siteCheckSuccessRate },
    { name: 'Failed', value: 100 - data.siteCheckSuccessRate },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">ORIT – Aggregated Operational Metrics</h2>
        <p className="text-gray-500">Authoritative performance data (Reporting Cycle: Current Qtr)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Site Check Success Rate</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  <Cell fill="#008A00" />
                  <Cell fill="#E10098" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-3xl font-bold mt-2">{data.siteCheckSuccessRate}%</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Avg Install Duration</h3>
           <div className="flex flex-col items-center justify-center h-48">
              <div className="text-6xl font-bold text-[#550065]">{data.avgInstallDurationHours}</div>
              <div className="text-gray-400 font-medium mt-2">Hours per Job</div>
           </div>
           <div className="mt-4 pt-4 border-t border-gray-50 text-xs text-center text-gray-400">
             Includes field travel and ONT registration time.
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">SLA Breach Risk</h3>
          <div className="flex flex-col items-center justify-center h-48">
             <div className="text-6xl font-bold text-pink-600">{data.slaBreachRisk}%</div>
             <div className="text-gray-400 font-medium mt-2">Projected Quarterly Risk</div>
          </div>
          <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
             <div className="h-full bg-pink-500" style={{ width: `${data.slaBreachRisk}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Region-wise Completion Rate</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.regionCompletion}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="rate" fill="#002D72" radius={[4, 4, 0, 0]}>
                {data.regionCompletion.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#002D72' : '#550065'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#550065] text-white p-6 rounded-xl shadow-lg">
           <h4 className="text-sm font-bold uppercase opacity-60 mb-2">Procurement Delay Impact</h4>
           <div className="text-4xl font-bold">{data.procurementDelayImpact}%</div>
           <p className="mt-4 text-sm opacity-80 leading-relaxed">
             Percentage of orders delayed due to missing local inventory (Cables/ONTs) necessitating central warehouse fulfillment.
           </p>
        </div>
        <div className="bg-[#002D72] text-white p-6 rounded-xl shadow-lg">
           <h4 className="text-sm font-bold uppercase opacity-60 mb-2">Post-Install Rework Rate</h4>
           <div className="text-4xl font-bold">{data.reworkRate}%</div>
           <p className="mt-4 text-sm opacity-80 leading-relaxed">
             Percentage of jobs requiring engineer revisit within 7 days due to signal degradation or port faults.
           </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
