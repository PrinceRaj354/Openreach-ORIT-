
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { JobStatus, Job, FibreRouteType } from '../types';
import { StatusBadge } from '../components/StatusBadge';

const FieldAgentJobs: React.FC = () => {
  const { jobs, user, updateJobStatus, auditLogs } = useApp();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'logs'>('details');
  const [isSyncing, setIsSyncing] = useState(false);
  const location = useLocation();

  // Execution Form State
  const [formData, setFormData] = useState({
    ontSerial: '',
    fibreRoute: 'Underground' as FibreRouteType,
    notes: '',
    photos: [] as string[],
    drillRequired: false,
    customerAvailable: true
  });

  const myJobs = useMemo(() => jobs.filter(j => j.assignedAgentId === user?.id), [jobs, user]);
  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);
  const jobLogs = useMemo(() => auditLogs.filter(log => log.jobId === selectedJobId), [auditLogs, selectedJobId]);

  useEffect(() => {
    const state = location.state as { highlightJobId?: string };
    if (state?.highlightJobId) {
      setSelectedJobId(state.highlightJobId);
    }
  }, [location]);

  const [completionDecision, setCompletionDecision] = useState<'completed_successfully' | 'issue_encountered' | 'rework_required' | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [issueCategory, setIssueCategory] = useState('');
  const [issueDetails, setIssueDetails] = useState('');

  const handleStartJob = (jobId: string) => {
    if (!user) return;
    updateJobStatus(jobId, JobStatus.JOB_IN_PROGRESS, user, {}, {
      reason: `Agent ${user.username} arrived at site and commenced installation`,
      outcome: 'job_started'
    });
    setActiveTab('evidence');
  };

  const handleCompletionSubmit = async (jobId: string) => {
    if (!user || !completionDecision) return;
    
    if (completionDecision === 'completed_successfully') {
      if (!formData.ontSerial || formData.photos.length === 0) {
        alert("BT Compliance: Mandatory ONT Serial and evidence photos required.");
        return;
      }
      
      setIsSyncing(true);
      await new Promise(r => setTimeout(r, 1500));
      
      updateJobStatus(jobId, JobStatus.JOB_COMPLETED, user, {
        ontSerialNumber: formData.ontSerial,
        fibreRoute: formData.fibreRoute,
        notes: formData.notes,
        photos: formData.photos,
        drillRequired: formData.drillRequired,
        customerAvailable: formData.customerAvailable
      }, {
        reason: `Installation completed successfully by ${user.username}. ONT ${formData.ontSerial} registered.`,
        outcome: 'completed_successfully'
      });
      
      setIsSyncing(false);
    } else if (completionDecision === 'rework_required') {
      updateJobStatus(jobId, JobStatus.REWORK_REQUIRED, user, {
        notes: `Rework Required: ${issueCategory}. ${issueDetails}`,
        blockageType: issueCategory
      }, {
        reason: `Agent ${user.username} reported rework required: ${issueCategory}`,
        outcome: 'rework_required'
      });
    } else {
      updateJobStatus(jobId, JobStatus.JOB_FAILED, user, {
        notes: `Job Failed: ${issueCategory}. ${issueDetails}`,
        blockageType: issueCategory
      }, {
        reason: `Agent ${user.username} reported job failure: ${issueCategory}`,
        outcome: 'job_failed'
      });
    }
    
    setShowCompletionModal(false);
    setCompletionDecision(null);
    setIssueCategory('');
    setIssueDetails('');
    setSelectedJobId(null);
  };

  const handlePhotoUpload = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=400&auto=format&fit=crop'
    ];
    const randomPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setFormData(prev => ({ ...prev, photos: [...prev.photos, randomPhoto] }));
  };

  if (selectedJobId && selectedJob) {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-2xl mx-auto text-gray-800">
        {/* Modal Header */}
        <div className="bg-[#550065] p-5 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest">Field Execution Unit</div>
            <h3 className="text-xl font-bold font-mono">{selectedJob.id}</h3>
          </div>
          <button onClick={() => setSelectedJobId(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0 bg-gray-50/50">
          {(['details', 'evidence', 'logs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === tab ? 'border-[#550065] text-[#550065] bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-[#550065]">Site Reference</h4>
                  <StatusBadge status={selectedJob.status} />
                </div>
                <p className="text-sm font-bold text-gray-900">{selectedJob.customerName}</p>
                <p className="text-sm text-gray-600 mb-2">{selectedJob.address}, {selectedJob.postcode}</p>
                <div className="flex gap-2">
                   <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-purple-200 font-bold text-purple-600">{selectedJob.serviceType}</span>
                   <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-purple-200 font-bold text-purple-600">{selectedJob.sla} Care</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">ORIT Instruction</h4>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                  {selectedJob.notes || "Standard provision. Verify exchange port allocation upon arrival."}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              {selectedJob.status === JobStatus.ENGINEER_ASSIGNED ? (
                <div className="text-center py-12">
                   <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-[#550065]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                   </div>
                   <h5 className="font-bold text-gray-800">Awaiting Site Arrival</h5>
                   <p className="text-xs text-gray-500 mt-1 mb-6">Engagement required to unlock evidence capture.</p>
                   <button 
                     onClick={() => handleStartJob(selectedJob.id)}
                     className="bg-[#550065] text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest shadow-lg shadow-purple-900/20"
                   >
                     Arrived at Site
                   </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">ONT Registration ID *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. BT-99-AABB"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#550065] outline-none"
                      value={formData.ontSerial}
                      onChange={e => setFormData({...formData, ontSerial: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Asset Path *</label>
                    <div className="flex gap-2">
                      {['Underground', 'Overhead'].map(r => (
                        <button 
                          key={r}
                          onClick={() => setFormData({...formData, fibreRoute: r as FibreRouteType})}
                          className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${formData.fibreRoute === r ? 'bg-[#550065] text-white border-[#550065]' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Field Proof * ({formData.photos.length})</label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                       <button 
                         onClick={handlePhotoUpload}
                         className="w-20 h-20 shrink-0 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 hover:border-[#550065] transition-all"
                       >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                       </button>
                       {formData.photos.map((p, i) => (
                         <img key={i} src={p} className="w-20 h-20 shrink-0 object-cover rounded-xl border border-gray-200 shadow-sm" alt="Evidence" />
                       ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Audit Sync</h4>
              {jobLogs.length > 0 ? (
                <div className="space-y-3">
                  {jobLogs.map(log => (
                    <div key={log.id} className="flex gap-3 text-xs">
                      <div className="shrink-0 w-1 bg-purple-200 rounded-full"></div>
                      <div>
                        <div className="font-bold text-gray-800">{log.action}</div>
                        <div className="text-gray-400 font-medium">Recorded by {log.actor} • {new Date(log.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs italic">No sync events recorded.</div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 flex gap-3 z-10 shadow-2xl">
          {selectedJob.status === JobStatus.JOB_IN_PROGRESS ? (
            <>
              <button 
                onClick={() => setShowCompletionModal(true)}
                disabled={isSyncing}
                className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-green-600 text-white shadow-lg active:scale-95'}`}
              >
                {isSyncing ? 'Syncing ORIT...' : 'Complete Job'}
              </button>
            </>
          ) : selectedJob.status === JobStatus.ENGINEER_ASSIGNED ? (
            <button 
              onClick={() => handleStartJob(selectedJob.id)}
              className="flex-1 bg-[#550065] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
            >
              Start On-Site Task
            </button>
          ) : (
            <button 
              disabled
              className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-black text-xs uppercase tracking-widest"
            >
              Lifecycle Finished
            </button>
          )}
        </div>

        {/* Job Completion Decision Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
              <div className="bg-green-600 p-4 text-white">
                <h3 className="text-lg font-bold">Job Completion</h3>
                <p className="text-sm text-green-100">Select outcome for {selectedJob.id}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Completion Outcome *</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCompletionDecision('completed_successfully')}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        completionDecision === 'completed_successfully'
                          ? 'border-green-500 bg-green-50 text-green-900'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="font-bold">✓ Completed Successfully</div>
                      <div className="text-xs text-gray-600">Installation finished, all tests passed</div>
                    </button>
                    <button
                      onClick={() => setCompletionDecision('rework_required')}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        completionDecision === 'rework_required'
                          ? 'border-orange-500 bg-orange-50 text-orange-900'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="font-bold">⚠ Rework Required</div>
                      <div className="text-xs text-gray-600">Issue encountered, needs follow-up</div>
                    </button>
                    <button
                      onClick={() => setCompletionDecision('issue_encountered')}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        completionDecision === 'issue_encountered'
                          ? 'border-red-500 bg-red-50 text-red-900'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <div className="font-bold">✗ Job Failed</div>
                      <div className="text-xs text-gray-600">Cannot complete due to site issue</div>
                    </button>
                  </div>
                </div>
                {(completionDecision === 'rework_required' || completionDecision === 'issue_encountered') && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Issue Category *</label>
                      <select
                        value={issueCategory}
                        onChange={(e) => setIssueCategory(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Select category...</option>
                        <option value="Fibre Blockage">Fibre Blockage</option>
                        <option value="Power Outage">Power Outage</option>
                        <option value="No Access">No Access</option>
                        <option value="H&S Issue">H&S Issue</option>
                        <option value="Equipment Fault">Equipment Fault</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Details *</label>
                      <textarea
                        value={issueDetails}
                        onChange={(e) => setIssueDetails(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                        rows={3}
                        placeholder="Describe the issue..."
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="bg-gray-50 p-4 flex justify-end gap-2">
                <button
                  onClick={() => { setShowCompletionModal(false); setCompletionDecision(null); setIssueCategory(''); setIssueDetails(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCompletionSubmit(selectedJob.id)}
                  disabled={
                    !completionDecision ||
                    ((completionDecision === 'rework_required' || completionDecision === 'issue_encountered') && (!issueCategory || !issueDetails))
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-gray-800">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black text-[#550065]">Daily Route</h2>
          <p className="text-gray-500 text-sm font-medium">Agent: <span className="text-gray-900 font-bold">{user?.username}</span> • {user?.region}</p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter text-center">Active Jobs</div>
           <div className="text-xl font-black text-center text-[#550065] leading-none">{myJobs.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {myJobs.map(job => (
          <div 
            key={job.id} 
            onClick={() => {
              setSelectedJobId(job.id);
              setFormData({
                ontSerial: job.ontSerialNumber || '',
                fibreRoute: job.fibreRoute || 'Underground',
                notes: job.notes || '',
                photos: job.photos || [],
                drillRequired: job.drillRequired || false,
                customerAvailable: job.customerAvailable ?? true
              });
            }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-md hover:shadow-xl hover:border-[#550065]/20 transition-all cursor-pointer group active:scale-[0.98]"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-[#550065] group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <StatusBadge status={job.status} />
            </div>

            <div className="mb-4">
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{job.id} • {job.serviceType}</div>
               <div className="text-xl font-black text-gray-900 leading-tight">{job.customerName}</div>
               <div className="text-sm text-gray-500 font-medium truncate">{job.address}</div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <div className="flex gap-2">
                 <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.sla === 'Premium' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                    {job.sla}
                 </div>
                 <div className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                    {job.postcode}
                 </div>
              </div>
              <div className="flex items-center gap-1 text-[#550065]">
                 <span className="text-xs font-black uppercase">Open Sheet</span>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        ))}

        {myJobs.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-gray-300">
             <div className="bg-white p-8 rounded-full shadow-sm mb-6">
                <svg className="w-20 h-20 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
             </div>
             <span className="font-black text-xl uppercase tracking-widest text-gray-200">Empty Route</span>
             <p className="text-sm font-medium mt-2">Check dispatch console for new assignments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldAgentJobs;
