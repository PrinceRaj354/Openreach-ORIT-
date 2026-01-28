
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { JobStatus, Job, UserRole } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { WorkflowTimeline } from '../components/WorkflowTimeline';

const OpsDashboard: React.FC = () => {
  const { jobs, updateJobStatus, user, auditLogs } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { highlightJobId?: string };
    if (state?.highlightJobId) {
      setHighlightedId(state.highlightJobId);
      // Auto-open details
      setSelectedJobId(state.highlightJobId);
      // Clear highlight after some time
      setTimeout(() => setHighlightedId(null), 3000);
    }
  }, [location]);

  const getCount = (status: JobStatus) => jobs.filter(j => j.status === status).length;

  const [siteCheckDecision, setSiteCheckDecision] = useState<'serviceable' | 'not_serviceable' | 'civil_work_required' | null>(null);
  const [inventoryDecision, setInventoryDecision] = useState<'fully_available' | 'partially_available' | 'not_available' | null>(null);
  const [showSiteCheckModal, setShowSiteCheckModal] = useState<string | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  const handlePreProcessAudit = (jobId: string) => {
    if (!user) return;
    updateJobStatus(jobId, JobStatus.SITE_CHECK_PENDING, user, {}, { 
      reason: 'Node capacity verified, initiating site feasibility check',
      outcome: 'site_check_initiated'
    });
  };

  const handleSiteCheckSubmit = (jobId: string) => {
    if (!user || !siteCheckDecision) return;
    
    let newStatus: JobStatus;
    let reason: string;
    
    if (siteCheckDecision === 'serviceable') {
      newStatus = JobStatus.INVENTORY_AVAILABLE;
      reason = 'Site check passed: Location serviceable for installation';
    } else if (siteCheckDecision === 'civil_work_required') {
      newStatus = JobStatus.SITE_CHECK_FAILED;
      reason = 'Site check failed: Civil engineering work required';
    } else {
      newStatus = JobStatus.SITE_CHECK_FAILED;
      reason = 'Site check failed: Location not serviceable';
    }
    
    if (decisionNotes) {
      reason += ` - ${decisionNotes}`;
    }
    
    updateJobStatus(jobId, newStatus, user, {}, { reason, outcome: siteCheckDecision });
    setShowSiteCheckModal(null);
    setSiteCheckDecision(null);
    setDecisionNotes('');
  };

  const handleInventoryCheckSubmit = (jobId: string) => {
    if (!user || !inventoryDecision) return;
    
    let newStatus: JobStatus;
    let reason: string;
    const job = jobs.find(j => j.id === jobId);
    const assignedAgentId = job?.region === 'Manchester' ? 'ENG_101' : 'ENG_102';
    const agentName = job?.region === 'Manchester' ? 'Dave Mitchell' : 'Emma Clarke';
    
    if (inventoryDecision === 'fully_available') {
      newStatus = JobStatus.ENGINEER_ASSIGNED;
      reason = `All inventory allocated and agent ${agentName} assigned`;
    } else if (inventoryDecision === 'partially_available') {
      newStatus = JobStatus.INVENTORY_MISSING;
      reason = 'Partial inventory available, missing items identified';
    } else {
      newStatus = JobStatus.INVENTORY_MISSING;
      reason = 'Required inventory not available in depot';
    }
    
    if (decisionNotes) {
      reason += ` - ${decisionNotes}`;
    }
    
    const metadata: Partial<Job> = newStatus === JobStatus.ENGINEER_ASSIGNED ? { assignedAgentId } : {};
    updateJobStatus(jobId, newStatus, user, metadata, { reason, outcome: inventoryDecision });
    setShowInventoryModal(null);
    setInventoryDecision(null);
    setDecisionNotes('');
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const selectedJobLogs = auditLogs.filter(log => log.jobId === selectedJobId);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium uppercase mb-1">New Order Intakes</div>
          <div className="text-3xl font-bold text-blue-600">{getCount(JobStatus.ORDER_RECEIVED)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium uppercase mb-1">Pending Feasibility</div>
          <div className="text-3xl font-bold text-[#550065]">{getCount(JobStatus.SITE_CHECK_PENDING)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium uppercase mb-1">Material Procuring</div>
          <div className="text-3xl font-bold text-orange-600">{getCount(JobStatus.WAITING_FOR_PROCUREMENT)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-gray-500 text-sm font-medium uppercase mb-1">Complete / Ready</div>
          <div className="text-3xl font-bold text-green-600">{getCount(JobStatus.JOB_COMPLETED) + getCount(JobStatus.BACKEND_NOTIFIED)}</div>
        </div>
      </div>

      {/* Actionable Workflow Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Operational Queue</h2>
          <div className="flex gap-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            Bidirectional Field Sync Enabled
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer / Site</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {jobs.map(job => (
                <tr 
                  key={job.id} 
                  className={`hover:bg-gray-50 transition-all cursor-pointer group ${highlightedId === job.id ? 'bg-purple-100 ring-2 ring-purple-500 z-10' : ''}`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <td className="px-6 py-4 font-mono font-medium text-[#550065] group-hover:underline">{job.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{job.customerName}</div>
                    <div className="text-gray-400 text-xs">{job.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4">
                    {job.status === JobStatus.ORDER_RECEIVED && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePreProcessAudit(job.id); }}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 shadow-sm"
                      >
                        Verify Node Capacity
                      </button>
                    )}
                    {job.status === JobStatus.SITE_CHECK_PENDING && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowSiteCheckModal(job.id); }}
                        className="bg-[#550065] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#3a0045] shadow-sm"
                      >
                        Run Site Feasibility
                      </button>
                    )}
                    {job.status === JobStatus.INVENTORY_AVAILABLE && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowInventoryModal(job.id); }}
                        className="bg-[#002D72] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#001d4a] shadow-sm"
                      >
                        Allocate Local Stock
                      </button>
                    )}
                    {job.status === JobStatus.WAITING_FOR_PROCUREMENT && (
                       <button 
                        onClick={(e) => { e.stopPropagation(); if(user) updateJobStatus(job.id, JobStatus.INVENTORY_AVAILABLE, user, {}, { reason: 'Procurement completed, inventory now available', outcome: 'procurement_resolved' }); }}
                        className="border border-[#550065] text-[#550065] px-3 py-1.5 rounded text-xs font-bold hover:bg-purple-50"
                      >
                        Procurement Resolved
                      </button>
                    )}
                    {[JobStatus.JOB_COMPLETED, JobStatus.BACKEND_NOTIFIED].includes(job.status) && (
                      <span className="text-green-600 font-bold text-xs uppercase">Service Enabled</span>
                    )}
                    {job.status === JobStatus.JOB_IN_PROGRESS && (
                      <span className="text-indigo-600 font-semibold italic text-xs animate-pulse">Engineer Working...</span>
                    )}
                    {job.status === JobStatus.ENGINEER_ASSIGNED && (
                      <span className="text-gray-400 font-medium text-xs italic">Awaiting Field Commencement</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#550065] p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h3 className="text-2xl font-bold">{selectedJob.id}</h3>
                <p className="text-purple-200 text-sm">Detailed Order Lifecycle Tracking</p>
              </div>
              <button 
                onClick={() => setSelectedJobId(null)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 text-gray-800">
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">Workflow Progress</h4>
                <WorkflowTimeline currentStatus={selectedJob.status} />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Customer Information</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-lg font-bold text-[#002D72]">{selectedJob.customerName}</div>
                      <div className="text-gray-600 mt-1">{selectedJob.address}, {selectedJob.postcode}</div>
                      <div className="mt-3 flex gap-4">
                        <div className="text-xs">
                          <span className="text-gray-400 block uppercase">SLA</span>
                          <span className="font-bold text-purple-700">{selectedJob.sla} Care Level</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-400 block uppercase">Product</span>
                          <span className="font-bold text-gray-800">{selectedJob.serviceType}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Audit Trail</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-60 overflow-y-auto space-y-3">
                      {selectedJobLogs.length === 0 ? (
                        <div className="text-xs text-gray-400 italic">No audit entries yet</div>
                      ) : (
                        selectedJobLogs.map(log => (
                          <div key={log.id} className="border-l-2 border-purple-300 pl-3 py-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-[#550065] text-xs">{log.action}</span>
                              <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                            </div>
                            {log.reason && (
                              <div className="text-[11px] text-gray-600 mb-1">
                                <span className="font-semibold">Reason:</span> {log.reason}
                              </div>
                            )}
                            <div className="text-[10px] text-gray-500">
                              <span className="font-semibold">Updated by:</span> {log.actor}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Field Context (Sync)</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Assigned Agent:</span>
                        <span className="font-bold text-[#550065]">{selectedJob.assignedAgentId || 'Unassigned'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">ONT Serial:</span>
                        <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">{selectedJob.ontSerialNumber || 'Pending Field Capture'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">Method:</span>
                        <span className="font-bold">{selectedJob.fibreRoute || 'Pending'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedJob.photos && selectedJob.photos.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Field Evidence</h4>
                      <div className="flex gap-2">
                        {selectedJob.photos.map((p, i) => (
                          <img key={i} src={p} className="w-16 h-16 rounded border border-gray-200 object-cover" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedJobId(null)}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Site Check Decision Modal */}
      {showSiteCheckModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-[#550065] p-4 text-white">
              <h3 className="text-lg font-bold">Site Feasibility Check</h3>
              <p className="text-sm text-purple-200">Select outcome for {showSiteCheckModal}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Decision Outcome *</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSiteCheckDecision('serviceable')}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      siteCheckDecision === 'serviceable'
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-bold">✓ Site Serviceable</div>
                    <div className="text-xs text-gray-600">Location ready for installation</div>
                  </button>
                  <button
                    onClick={() => setSiteCheckDecision('not_serviceable')}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      siteCheckDecision === 'not_serviceable'
                        ? 'border-red-500 bg-red-50 text-red-900'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="font-bold">✗ Not Serviceable</div>
                    <div className="text-xs text-gray-600">Location cannot be serviced</div>
                  </button>
                  <button
                    onClick={() => setSiteCheckDecision('civil_work_required')}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      siteCheckDecision === 'civil_work_required'
                        ? 'border-orange-500 bg-orange-50 text-orange-900'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-bold">⚠ Civil Work Required</div>
                    <div className="text-xs text-gray-600">Requires engineering work</div>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  placeholder="Additional details..."
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-end gap-2">
              <button
                onClick={() => { setShowSiteCheckModal(null); setSiteCheckDecision(null); setDecisionNotes(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSiteCheckSubmit(showSiteCheckModal)}
                disabled={!siteCheckDecision}
                className="px-4 py-2 bg-[#550065] text-white rounded-lg text-sm font-bold hover:bg-[#3a0045] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Check Decision Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-[#002D72] p-4 text-white">
              <h3 className="text-lg font-bold">Inventory Allocation</h3>
              <p className="text-sm text-blue-200">Check depot stock for {showInventoryModal}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Inventory Status *</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setInventoryDecision('fully_available')}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      inventoryDecision === 'fully_available'
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="font-bold">✓ Fully Available</div>
                    <div className="text-xs text-gray-600">All items in stock, assign agent</div>
                  </button>
                  <button
                    onClick={() => setInventoryDecision('partially_available')}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      inventoryDecision === 'partially_available'
                        ? 'border-orange-500 bg-orange-50 text-orange-900'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="font-bold">⚠ Partially Available</div>
                    <div className="text-xs text-gray-600">Some items missing</div>
                  </button>
                  <button
                    onClick={() => setInventoryDecision('not_available')}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      inventoryDecision === 'not_available'
                        ? 'border-red-500 bg-red-50 text-red-900'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <div className="font-bold">✗ Not Available</div>
                    <div className="text-xs text-gray-600">Required items out of stock</div>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  placeholder="Missing items, ETA, etc..."
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 flex justify-end gap-2">
              <button
                onClick={() => { setShowInventoryModal(null); setInventoryDecision(null); setDecisionNotes(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleInventoryCheckSubmit(showInventoryModal)}
                disabled={!inventoryDecision}
                className="px-4 py-2 bg-[#002D72] text-white rounded-lg text-sm font-bold hover:bg-[#001d4a] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpsDashboard;
