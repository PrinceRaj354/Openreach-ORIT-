
import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UserRole } from '../types';
import { DashboardIcon, JobsIcon, MapIcon, AnalyticsIcon, LogoutIcon, InventoryIcon, NotificationIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (!user) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    ...(user.role === UserRole.ORIT_OPS ? [
      { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { to: '/jobs', label: 'Job Operations', icon: <JobsIcon /> },
      { to: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
      { to: '/inventory', label: 'Inventory', icon: <InventoryIcon /> },
    ] : [
      { to: '/field-jobs', label: 'My Jobs', icon: <JobsIcon /> },
    ]),
    { to: '/map', label: 'Asset Map', icon: <MapIcon /> },
  ];

  // Filter notifications based on role
  const roleNotifications = useMemo(() => {
    return notifications.filter(n => !n.targetRole || n.targetRole === user.role);
  }, [notifications, user.role]);

  const unreadCount = useMemo(() => {
    return roleNotifications.filter(n => !n.isRead).length;
  }, [roleNotifications]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-gray-800">
      {/* Sidebar */}
      <aside className={`bg-[#550065] text-white transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-purple-800">
          <div className="bg-white rounded p-1">
             <div className="w-6 h-6 bg-[#550065] rounded-sm"></div>
          </div>
          {!collapsed && <span className="font-bold text-xl tracking-tight">Openreach <span className="text-pink-400">ORIT</span></span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-white/10 text-white font-semibold' : 'text-purple-100 hover:bg-white/5'}`
              }
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-800">
          <div className={`flex items-center gap-3 px-4 py-3 text-purple-200 text-sm ${collapsed ? 'justify-center' : ''}`}>
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
               {user.username.charAt(0).toUpperCase()}
             </div>
             {!collapsed && (
               <div className="flex flex-col">
                 <span className="font-medium text-white">{user.username}</span>
                 <span className="text-xs opacity-75">{user.role.replace('_', ' ')}</span>
               </div>
             )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-red-500/20 hover:text-red-200 transition-colors mt-2"
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-purple-300 hover:text-white flex justify-center border-t border-purple-800"
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-bold text-[#002D72]">ORIT Operational Slice</h1>
          
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-500 hover:text-[#550065] transition-colors relative"
              >
                <NotificationIcon />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-white text-[10px] flex items-center justify-center rounded-full border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <span className="font-bold text-[#002D72]">System Alerts</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">{unreadCount} Unread</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {roleNotifications.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-xs italic">No alerts for your role.</div>
                      ) : (
                        roleNotifications.map(notif => (
                          <div 
                            key={notif.id}
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-purple-50/30' : ''}`}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              setShowNotifications(false);
                              const targetPath = user.role === UserRole.ORIT_OPS ? '/dashboard' : '/field-jobs';
                              navigate(targetPath, { state: { highlightJobId: notif.jobId } });
                            }}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold text-[#550065]">{notif.title}</span>
                              <span className="text-[10px] text-gray-400">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                            <div className="mt-2 text-[10px] font-mono font-bold text-gray-400">Order Ref: {notif.jobId}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
               <div className="flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 System Status: Online
               </div>
               <div className="h-4 w-px bg-gray-300"></div>
               <span>Region: <span className="font-semibold text-gray-800">{user.region}</span></span>
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
