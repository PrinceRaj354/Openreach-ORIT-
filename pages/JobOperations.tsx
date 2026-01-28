import React, { useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { JobStatus, Job } from '../types';
import { StatusBadge } from '../components/StatusBadge';

const JobOperations: React.FC = () => {
  const { jobs, auditLogs } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'field' | 'completed'>('all');

  const filteredJobs = useMemo(() => {
    if (filterStatus === 'field') {
      return jobs.filter(j => [JobStatus.ENGINEER_ASSIGNED, JobStatus.JOB_IN_PROGRESS].includes(j.status));
    }
    if (filterStatus === 'completed') {
      return jobs.filter(j => [JobStatus.JOB_COMPLETED, JobStatus.JOB_FAILED].includes(j.status));
    }
    return jobs;
  }, [jobs, filterStatus]);

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const selectedJobLogs = auditLogs.filter(log => log.jobId === selectedJobId);

  const fieldActiveCount = jobs.filter(j => [JobStatus.ENGINEER_ASSIGNED, JobStatus.JOB_IN_PROGRESS].includes(j.status)).length;
  const completedCount = jobs.filter(j => j.status === JobStatus.JOB_COMPLETED).length;
  const failedCount = jobs.filter(j => [JobStatus.JOB_FAILED, JobStatus.REWORK_REQUIRED].includes(j.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Operations Monitor</h2>
          <p className="text-sm text-gray-500">Real-time field execution tracking</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterStatus === 'all' ? 'bg-[#550065] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setFilterStatus('field')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterStatus === 'field' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            In Field ({fieldActiveCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              filterStatus === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">Active in Field</div>
          <div className="text-2xl font-bold text-blue-600">{fieldActiveCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">Completed Today</div>
          <div className="text-2xl font-bold text-green-600">{completedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase mb-1">Issues / Rework</div>
          <div className="text-2xl font-bold text-orange-600">{failedCount}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Job ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Assigned Agent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Field Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredJobs.map(job => (
                <tr
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-medium text-[#550065]">{job.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{job.customerName}</div>
                    <div className="text-xs text-gray-400">{job.postcode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {job.serviceType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {job.assignedAgentId ? (
                      <div className="text-xs">
                        <div className="font-bold">{job.assignedAgentId}</div>
                        <div className="text-gray-400">{job.region}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4">
                    {job.ontSerialNumber ? (
                      <div className="text-xs">
                        <div className="font-mono font-bold text-green-600">ONT: {job.ontSerialNumber}</div>
                        <div className="text-gray-400">{job.fibreRoute}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Pending capture</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#550065] p-6 flex justify-between items-center text-white">
              <div>
                <h3 className="text-2xl font-bold">{selectedJob.id}</h3>
                <p className="text-purple-200 text-sm">Field Execution Details</p>
              </div>
              <button
                onClick={() => setSelectedJobId(null)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Customer</h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="font-bold text-gray-900">{selectedJob.customerName}</div>
                    <div className="text-sm text-gray-600 mt-1">{selectedJob.address}</div>
                    <div className="text-sm text-gray-600">{selectedJob.postcode}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Assignment</h4>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Agent ID:</span>
                      <span className="font-bold text-[#550065]">{selectedJob.assignedAgentId || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Region:</span>
                      <span className="font-bold">{selectedJob.region}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Status:</span>
                      <StatusBadge status={selectedJob.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Field Captured Data</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">ONT Serial:</span>
                    <span className="font-mono font-bold text-green-600">
                      {selectedJob.ontSerialNumber || 'Not captured'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Fibre Route:</span>
                    <span className="font-bold">{selectedJob.fibreRoute || 'Pending'}</span>
                  </div>
                  {selectedJob.notes && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-400 block mb-1">Agent Notes:</span>
                      <p className="text-sm text-gray-700 italic">{selectedJob.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedJob.photos && selectedJob.photos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Field Evidence</h4>
                  <div className="flex gap-2">
                    {selectedJob.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        alt={`Evidence ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Audit Trail</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-60 overflow-y-auto space-y-3">
                  {selectedJobLogs.length === 0 ? (
                    <div className="text-xs text-gray-400 italic">No audit entries</div>
                  ) : (
                    selectedJobLogs.map(log => (
                      <div key={log.id} className="border-l-2 border-purple-300 pl-3 py-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-[#550065] text-xs">{log.action}</span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {log.reason && (
                          <div className="text-[11px] text-gray-600 mb-1">
                            <span className="font-semibold">Reason:</span> {log.reason}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-500">
                          <span className="font-semibold">By:</span> {log.actor}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedJobId(null)}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOperations;
