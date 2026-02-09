import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { JobStatus, Job, UserRole } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { WorkflowTimeline } from '../components/WorkflowTimeline';

const JobOperations: React.FC = () => {
  const { jobs, updateJobStatus, user, auditLogs } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [readOrders, setReadOrders] = useState<Set<string>>(new Set());
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
  const reworkCount = jobs.filter(j => j.status === JobStatus.REWORK_INITIATED || j.parentOrderId).length;

  const [siteCheckDecision, setSiteCheckDecision] = useState<'serviceable' | 'not_serviceable' | 'civil_work_required' | null>(null);
  const [inventoryDecision, setInventoryDecision] = useState<'fully_available' | 'partially_available' | 'not_available' | null>(null);
  const [showSiteCheckModal, setShowSiteCheckModal] = useState<string | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState<string | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  const handlePreProcessAudit = (jobId: string) => {
    if (!user) return;
    updateJobStatus(jobId, JobStatus.INVENTORY_CHECK_PENDING, user, {}, { 
      reason: 'Initial inventory availability check initiated',
      outcome: 'inventory_check_initiated'
    });
  };

  const handleInitialInventoryCheck = (jobId: string) => {
    if (!user || !inventoryDecision) return;
    
    let newStatus: JobStatus;
    let reason: string;
    
    if (inventoryDecision === 'fully_available' || inventoryDecision === 'partially_available') {
      newStatus = JobStatus.SITE_CHECK_PENDING;
      reason = 'Inventory confirmed available, proceeding to site serviceability check';
    } else {
      newStatus = JobStatus.WAITING_FOR_PROCUREMENT;
      reason = 'Required inventory not available, procurement initiated';
    }
    
    if (decisionNotes) {
      reason += ` - ${decisionNotes}`;
    }
    
    updateJobStatus(jobId, newStatus, user, {}, { reason, outcome: inventoryDecision });
    setShowInventoryModal(null);
    setInventoryDecision(null);
    setDecisionNotes('');
  };

  const handleSiteCheckSubmit = (jobId: string) => {
    if (!user || !siteCheckDecision) return;
    
    let newStatus: JobStatus;
    let reason: string;
    
    if (siteCheckDecision === 'serviceable') {
      newStatus = JobStatus.NODE_CAPACITY_PENDING;
      reason = 'Site serviceable, proceeding to node capacity verification';
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

  const handleNodeCapacityCheck = (jobId: string) => {
    if (!user) return;
    updateJobStatus(jobId, JobStatus.INVENTORY_ALLOCATION_PENDING, user, {}, { 
      reason: 'Node capacity verified, proceeding to inventory allocation',
      outcome: 'node_capacity_verified'
    });
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
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border-2 border-[#0a9c82] transition-all duration-200 hover:-translate-y-1">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">New Order Intakes</div>
          <div className="text-4xl font-black text-[#0a9c82]">{getCount(JobStatus.ORDER_RECEIVED)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border-2 border-[#0a9c82] transition-all duration-200 hover:-translate-y-1">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Checks</div>
          <div className="text-4xl font-black text-[#4ac59d]">{getCount(JobStatus.INVENTORY_CHECK_PENDING) + getCount(JobStatus.SITE_CHECK_PENDING) + getCount(JobStatus.NODE_CAPACITY_PENDING)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border-2 border-[#0a9c82] transition-all duration-200 hover:-translate-y-1">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Rework Orders</div>
          <div className="text-4xl font-black text-orange-600">{reworkCount}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg border-2 border-[#0a9c82] transition-all duration-200 hover:-translate-y-1">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Complete / Ready</div>
          <div className="text-4xl font-black text-green-600">{getCount(JobStatus.JOB_COMPLETED) + getCount(JobStatus.BACKEND_NOTIFIED)}</div>
        </div>
      </div>

      {/* Actionable Workflow Table */}
      <div className="bg-white rounded-xl shadow-md border-2 border-[#0a9c82] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg font-bold text-gray-800">Operational Queue</h2>
          <div className="flex gap-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
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
              {jobs.map((job, index) => {
                const isUnread = index < 3 && !readOrders.has(job.id);
                return (
                <tr 
                  key={job.id} 
                  className={`hover:bg-purple-50/50 transition-all duration-150 cursor-pointer group ${highlightedId === job.id ? 'bg-teal-100 ring-2 ring-[#0a9c82] z-10' : ''} ${isUnread ? 'bg-blue-50/30' : ''} ${job.parentOrderId ? 'bg-orange-50/20' : ''}`}
                  onClick={() => { setSelectedJobId(job.id); setReadOrders(prev => new Set(prev).add(job.id)); }}
                >
                  <td className="px-6 py-4 font-mono font-medium text-[#0a9c82] group-hover:underline">
                    <div className="flex items-center gap-2">
                      {isUnread && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                      {job.parentOrderId && (
                        <span className="text-orange-600" title="Rework Order">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>
                        </span>
                      )}
                      <span>{job.id}</span>
                    </div>
                  </td>
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
                        className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all duration-150"
                      >
                        Check Inventory Availability
                      </button>
                    )}
                    {job.status === JobStatus.INVENTORY_CHECK_PENDING && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowInventoryModal(job.id); }}
                        className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all duration-150"
                      >
                        Verify Inventory Status
                      </button>
                    )}
                    {job.status === JobStatus.SITE_CHECK_PENDING && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowSiteCheckModal(job.id); }}
                        className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all duration-150"
                      >
                        Run Site Serviceability
                      </button>
                    )}
                    {job.status === JobStatus.NODE_CAPACITY_PENDING && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleNodeCapacityCheck(job.id); }}
                        className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all duration-150"
                      >
                        Verify Node Capacity
                      </button>
                    )}
                    {job.status === JobStatus.INVENTORY_ALLOCATION_PENDING && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowInventoryModal(job.id); }}
                        className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all duration-150"
                      >
                        Allocate Local Stock
                      </button>
                    )}
                    {job.status === JobStatus.WAITING_FOR_PROCUREMENT && (
                       <button 
                        onClick={(e) => { e.stopPropagation(); if(user) updateJobStatus(job.id, JobStatus.SITE_CHECK_PENDING, user, {}, { reason: 'Procurement completed, inventory now available', outcome: 'procurement_resolved' }); }}
                        className="border-2 border-[#0a9c82] text-[#0a9c82] px-4 py-2 rounded-xl text-xs font-bold hover:bg-teal-50 transition-all duration-150"
                      >
                        Procurement Resolved
                      </button>
                    )}
                    {job.status === JobStatus.REWORK_REQUIRED && job.hasReworkTicket && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedJobId(job.reworkTicketId || null); }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-700 shadow-md hover:shadow-lg transition-all duration-150"
                      >
                        View Rework Ticket
                      </button>
                    )}
                    {job.status === JobStatus.REWORK_INITIATED && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePreProcessAudit(job.id); }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-700 shadow-md hover:shadow-lg transition-all duration-150"
                      >
                        Re-evaluate Order
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
              );})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-purple-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-2 border-[#0a9c82]">
            <div className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h3 className="text-2xl font-bold">{selectedJob.id}</h3>
                <p className="text-teal-100 text-sm">Detailed Order Lifecycle Tracking</p>
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

              {selectedJob.parentOrderId && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/></svg>
                    <div>
                      <div className="font-bold text-orange-900 text-sm">Rework Order</div>
                      <div className="text-xs text-orange-700 mt-1">Parent Order: <button onClick={() => setSelectedJobId(selectedJob.parentOrderId || null)} className="font-mono underline hover:text-orange-900">{selectedJob.parentOrderId}</button></div>
                      <div className="text-xs text-orange-700">Reason: {selectedJob.reworkReason}</div>
                      <div className="text-xs text-orange-600 mt-1 italic">Created from: {selectedJob.createdFrom}</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedJob.hasReworkTicket && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    <div>
                      <div className="font-bold text-orange-900 text-sm">Rework Initiated</div>
                      <div className="text-xs text-orange-700 mt-1">Rework Ticket: <button onClick={() => setSelectedJobId(selectedJob.reworkTicketId || null)} className="font-mono underline hover:text-orange-900">{selectedJob.reworkTicketId}</button></div>
                      <div className="text-xs text-orange-600 mt-1 italic">This order requires rework and a new ticket has been generated</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Customer Information</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="text-lg font-bold text-[#073b4c]">{selectedJob.customerName}</div>
                      <div className="text-gray-600 mt-1">{selectedJob.address}, {selectedJob.postcode}</div>
                      <div className="mt-3 flex gap-4">
                        <div className="text-xs">
                          <span className="text-gray-400 block uppercase">SLA</span>
                          <span className="font-bold text-[#0a9c82]">{selectedJob.sla} Care Level</span>
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
                          <div key={log.id} className="border-l-2 border-[#0a9c82] pl-3 py-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-[#0a9c82] text-xs">{log.action}</span>
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
                        <span className="font-bold text-[#0a9c82]">{selectedJob.assignedAgentId || 'Unassigned'}</span>
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
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border-2 border-[#0a9c82]">
            <div className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] p-4 text-white">
              <h3 className="text-lg font-bold">Site Serviceability Check</h3>
              <p className="text-sm text-teal-100">Select outcome for {showSiteCheckModal}</p>
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
                className="px-4 py-2 bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white rounded-xl text-sm font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden border-2 border-[#0a9c82]">
            <div className="bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] p-4 text-white">
              <h3 className="text-lg font-bold">Inventory Availability Check</h3>
              <p className="text-sm text-teal-100">Check depot stock for {showInventoryModal}</p>
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
                    <div className="text-xs text-gray-600">All items in stock</div>
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
                onClick={() => {
                  if (jobs.find(j => j.id === showInventoryModal)?.status === JobStatus.INVENTORY_CHECK_PENDING) {
                    handleInitialInventoryCheck(showInventoryModal!);
                  } else {
                    handleInventoryCheckSubmit(showInventoryModal!);
                  }
                }}
                disabled={!inventoryDecision}
                className="px-4 py-2 bg-gradient-to-r from-[#0a9c82] to-[#4ac59d] text-white rounded-xl text-sm font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

export default JobOperations;
