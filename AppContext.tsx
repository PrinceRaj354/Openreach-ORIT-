
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Job, JobStatus, User, AuditLog, UserRole, InventoryItem, Notification } from './types';
import { INITIAL_JOBS, MOCK_USERS, MOCK_INVENTORY, MOCK_NOTIFICATIONS } from './constants';

interface AppContextType {
  user: User | null;
  jobs: Job[];
  inventory: InventoryItem[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  login: (username: string, role: UserRole) => boolean;
  logout: () => void;
  updateJobStatus: (jobId: string, newStatus: JobStatus, actor: User, metadata?: Partial<Job>, decision?: { reason: string; outcome?: string }) => void;
  getJobById: (jobId: string) => Job | undefined;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [inventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const login = useCallback((username: string, role: UserRole) => {
    const foundUser = MOCK_USERS.find(u => u.username === username && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateJobStatus = useCallback((jobId: string, newStatus: JobStatus, actor: User, metadata?: Partial<Job>, decision?: { reason: string; outcome?: string }) => {
    setJobs(prevJobs => prevJobs.map(job => {
      if (job.id === jobId) {
        const previousStatus = job.status;
        const updatedJob = { 
          ...job, 
          status: newStatus, 
          lastUpdated: new Date().toISOString(),
          ...metadata 
        };

        const actorName = actor.role === UserRole.ORIT_OPS ? 'ORIT System' : `${actor.username} (Field Agent)`;
        const reason = decision?.reason || `Status changed to ${newStatus.replace(/_/g, ' ')}`;

        const newLog: AuditLog = {
          id: `LOG-${Date.now()}`,
          jobId,
          action: `Status change to ${newStatus.replace(/_/g, ' ')}`,
          actor: actorName,
          timestamp: new Date().toISOString(),
          previousStatus,
          newStatus,
          reason,
          decision: decision ? {
            type: 'status_transition',
            outcome: decision.outcome || newStatus,
            reason: decision.reason,
            actor: actorName as any,
            timestamp: new Date().toISOString()
          } : undefined
        };

        setAuditLogs(prevLogs => [newLog, ...prevLogs]);

        // --- BIDIRECTIONAL SYNC LOGIC ---

        // 1. Operations -> Field Agent Assignment
        if (actor.role === UserRole.ORIT_OPS && newStatus === JobStatus.ENGINEER_ASSIGNED) {
          const newNotif: Notification = {
            id: `NT-FA-${Date.now()}`,
            title: 'New Job Assigned',
            message: `A new ${job.serviceType} order (${job.id}) has been assigned to you by ORIT.`,
            jobId: job.id,
            timestamp: new Date().toISOString(),
            isRead: false,
            targetRole: UserRole.FIELD_AGENT
          };
          setNotifications(prev => [newNotif, ...prev]);
        }

        // 2. Field Agent -> Operations Progress/Completion
        if (actor.role === UserRole.FIELD_AGENT) {
          let title = '';
          let message = '';

          if (newStatus === JobStatus.JOB_IN_PROGRESS) {
            title = 'Job Commenced';
            message = `Agent ${actor.username} has arrived at site and started ${job.id}.`;
          } else if (newStatus === JobStatus.JOB_COMPLETED) {
            title = 'Job Completed in Field';
            message = `Agent ${actor.username} has finished installation for ${job.id}. Awaiting system activation.`;
          } else if (newStatus === JobStatus.REWORK_REQUIRED || newStatus === JobStatus.JOB_FAILED) {
            title = 'Site Installation Blocked';
            message = `Field Alert: Agent ${actor.username} reported a blockage for ${job.id}. Status: ${newStatus}.`;
          }

          if (title) {
            const newNotif: Notification = {
              id: `NT-OPS-${Date.now()}`,
              title,
              message,
              jobId: job.id,
              timestamp: new Date().toISOString(),
              isRead: false,
              targetRole: UserRole.ORIT_OPS
            };
            setNotifications(prev => [newNotif, ...prev]);
          }
        }

        return updatedJob;
      }
      return job;
    }));
  }, []);

  const getJobById = useCallback((jobId: string) => {
    return jobs.find(j => j.id === jobId);
  }, [jobs]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const value = useMemo(() => ({
    user,
    jobs,
    inventory,
    notifications,
    auditLogs,
    login,
    logout,
    updateJobStatus,
    getJobById,
    markNotificationRead
  }), [user, jobs, inventory, notifications, auditLogs, login, logout, updateJobStatus, getJobById, markNotificationRead]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
