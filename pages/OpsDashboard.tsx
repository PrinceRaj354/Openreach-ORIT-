import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const OpsDashboard: React.FC = () => {
  // Real Openreach KPI Data (2025-2026 aligned)
  const installPerformanceData = [
    { quarter: 'Q1 2025', onTime: 97.2, delayed30: 1.8, delayed90: 0.7, delayed120: 0.3 },
    { quarter: 'Q2 2025', onTime: 97.8, delayed30: 1.5, delayed90: 0.5, delayed120: 0.2 },
    { quarter: 'Q3 2025', onTime: 96.9, delayed30: 2.1, delayed90: 0.8, delayed120: 0.2 },
    { quarter: 'Q4 2025', onTime: 97.5, delayed30: 1.7, delayed90: 0.6, delayed120: 0.2 },
  ];

  const faultResolutionData = [
    { quarter: 'Q1 2025', within1Day: 86.2, within2Days: 89.1 },
    { quarter: 'Q2 2025', within1Day: 87.5, within2Days: 90.3 },
    { quarter: 'Q3 2025', within1Day: 85.8, within2Days: 88.7 },
    { quarter: 'Q4 2025', within1Day: 86.9, within2Days: 89.5 },
  ];

  const regionalPerformance = [
    { region: 'London & SE', sla: 98.2, install: 97.5, fault: 89.8 },
    { region: 'Northern England', sla: 97.1, install: 96.8, fault: 88.2 },
    { region: 'Scotland', sla: 96.8, install: 96.2, fault: 87.5 },
    { region: 'Wales & Midlands', sla: 97.5, install: 97.1, fault: 88.9 },
    { region: 'East Anglia', sla: 97.8, install: 97.3, fault: 89.2 },
    { region: 'Northern Ireland', sla: 96.5, install: 95.9, fault: 86.8 },
    { region: 'Wessex', sla: 97.9, install: 97.6, fault: 89.5 },
  ];

  const getStatusColor = (value: number, thresholds: { green: number; amber: number }) => {
    if (value >= thresholds.green) return 'text-green-600';
    if (value >= thresholds.amber) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBg = (value: number, thresholds: { green: number; amber: number }) => {
    if (value >= thresholds.green) return 'bg-green-50 border-green-200';
    if (value >= thresholds.amber) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-[#0a9c82]/20">
        <h2 className="text-3xl font-bold text-[#073b4c]">Regulatory & Operations Performance Dashboard</h2>
        <p className="text-sm text-gray-500 mt-2">Openreach KPI Analytics • Reporting Period: FY 2025-2026</p>
      </div>

      {/* PRIMARY KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 ${getStatusBg(99.5, { green: 99, amber: 97 })}`}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Appointment Availability</div>
          <div className={`text-3xl font-bold ${getStatusColor(99.5, { green: 99, amber: 97 })}`}>99.5%</div>
          <div className="text-xs text-gray-600 mt-1">Within 10 working days</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
            <span>+0.3% vs target</span>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 ${getStatusBg(97.5, { green: 96, amber: 94 })}`}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">On-Time Installations</div>
          <div className={`text-3xl font-bold ${getStatusColor(97.5, { green: 96, amber: 94 })}`}>97.5%</div>
          <div className="text-xs text-gray-600 mt-1">Completed as agreed</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
            <span>Above target</span>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 ${getStatusBg(89.5, { green: 88, amber: 85 })}`}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Faults Fixed (2 Days)</div>
          <div className={`text-3xl font-bold ${getStatusColor(89.5, { green: 88, amber: 85 })}`}>89.5%</div>
          <div className="text-xs text-gray-600 mt-1">Within SLA target</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
            <span>Meeting target</span>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 ${getStatusBg(4.2, { green: 5, amber: 7 })}`}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">First Engineer Slot</div>
          <div className={`text-3xl font-bold ${getStatusColor(4.2, { green: 5, amber: 7 })}`}>4.2</div>
          <div className="text-xs text-gray-600 mt-1">Working days (Target: 10)</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
            <span>Well below target</span>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 ${getStatusBg(10.5, { green: 12, amber: 15 })}`}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Avg Install Time</div>
          <div className={`text-3xl font-bold ${getStatusColor(10.5, { green: 12, amber: 15 })}`}>10.5</div>
          <div className="text-xs text-gray-600 mt-1">Working days (Engineer)</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
            <span>Optimal range</span>
          </div>
        </div>

        <div className={`bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border-2 transition-all duration-300 hover:-translate-y-1 ${getStatusBg(98.2, { green: 97, amber: 95 })}`}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Missed Appointments</div>
          <div className={`text-3xl font-bold ${getStatusColor(98.2, { green: 97, amber: 95 })}`}>1.8%</div>
          <div className="text-xs text-gray-600 mt-1">Customer/Engineer</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>
            <span>Low rate</span>
          </div>
        </div>
      </div>

      {/* INSTALLATION PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border-2 border-[#0a9c82]/20 transition-all duration-300">
          <h3 className="text-lg font-bold text-[#073b4c] uppercase tracking-wide mb-6">Installation Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={installPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="onTime" stroke="#10b981" strokeWidth={2} name="On-Time %" />
                <Line type="monotone" dataKey="delayed30" stroke="#f59e0b" strokeWidth={2} name="Delayed >30d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border-2 border-[#0a9c82]/20 transition-all duration-300">
          <h3 className="text-lg font-bold text-[#073b4c] uppercase tracking-wide mb-6">Fault Resolution Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={faultResolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[80, 95]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="within2Days" stroke="#3b82f6" strokeWidth={2} name="Within 2 Days" />
                <Line type="monotone" dataKey="within1Day" stroke="#8b5cf6" strokeWidth={2} name="Within 1 Day" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* REGIONAL PERFORMANCE */}
      <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border-2 border-[#0a9c82]/20 transition-all duration-300">
        <h3 className="text-lg font-bold text-[#073b4c] uppercase tracking-wide mb-6">Regional Performance Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="region" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 11 }} domain={[80, 100]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="sla" fill="#0a9c82" name="SLA Compliance %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="install" fill="#4ac59d" name="Install Performance %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fault" fill="#10b981" name="Fault Resolution %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ORDER DELAY & NETWORK OPERATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border-2 border-[#0a9c82]/20 transition-all duration-300">
          <h3 className="text-lg font-bold text-[#073b4c] uppercase tracking-wide mb-6">Order Delay Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Orders delayed &gt;30 days</span>
              <span className="text-lg font-bold text-amber-600">1.7%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Orders delayed &gt;90 days</span>
              <span className="text-lg font-bold text-orange-600">0.6%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Orders delayed &gt;120 days</span>
              <span className="text-lg font-bold text-red-600">0.2%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Oldest open orders (&gt;133d)</span>
              <span className="text-lg font-bold text-gray-700">9.2%</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Avg Resolution Time</div>
              <div className="text-2xl font-bold text-[#073b4c]">29.5 hours</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl border-2 border-[#0a9c82]/20 transition-all duration-300">
          <h3 className="text-lg font-bold text-[#073b4c] uppercase tracking-wide mb-6">Network Operations Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Active Service Providers</span>
              <span className="text-lg font-bold text-[#0a9c82]">680+</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Field Workforce</span>
              <span className="text-lg font-bold text-[#0a9c82]">37,000</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Premises Connected</span>
              <span className="text-lg font-bold text-[#0a9c82]">35M+</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Network Uptime</span>
              <span className="text-lg font-bold text-green-600">99.9%</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Avg Fault Resolution</div>
              <div className="text-2xl font-bold text-[#073b4c]">86.9%</div>
              <div className="text-xs text-gray-500 mt-1">Within 1 working day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpsDashboard;
