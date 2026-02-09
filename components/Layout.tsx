
import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UserRole } from '../types';
import { DashboardIcon, JobsIcon, MapIcon, AnalyticsIcon, LogoutIcon, InventoryIcon, NotificationIcon, SupportIcon } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasVibrated, setHasVibrated] = useState(false);

  if (!user) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    ...(user.role === UserRole.ORIT_OPS ? [
      { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { to: '/jobs', label: 'Orders', icon: <JobsIcon /> },
      { to: '/inventory', label: 'Inventory', icon: <InventoryIcon /> },
    ] : [
      { to: '/field-jobs', label: 'My Jobs', icon: <JobsIcon /> },
      { to: '/support', label: 'Support', icon: <SupportIcon /> },
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

  // Vibrate on new notifications
  React.useEffect(() => {
    if (unreadCount > 0 && !hasVibrated) {
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      setHasVibrated(true);
    }
  }, [unreadCount, hasVibrated]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-gray-800">
      {/* Sidebar */}
      <aside className={`bg-white text-gray-800 transition-all duration-200 flex flex-col shadow-xl border-r-2 border-[#0a9c82] ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-6 flex items-center gap-3 border-b-2 border-[#0a9c82]">
          <div className="bg-gradient-to-br from-[#0a9c82] to-[#4ac59d] rounded-lg p-1.5 shadow-md">
             <div className="w-6 h-6 bg-white rounded"></div>
          </div>
          {!collapsed && <span className="font-bold text-xl tracking-tight text-gray-800">Openreach <span className="text-[#0a9c82]">ORIT</span></span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${isActive ? 'bg-[#0a9c82] text-white font-semibold shadow-lg' : 'text-gray-900 hover:bg-[#0a9c82] hover:text-white hover:translate-x-1'}`
              }
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-[#0a9c82]">
          <div className={`flex items-center gap-3 px-4 py-3 text-gray-600 text-sm ${collapsed ? 'justify-center' : ''}`}>
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0a9c82] to-[#4ac59d] flex items-center justify-center font-bold text-white shadow-md">
               {user.username.charAt(0).toUpperCase()}
             </div>
             {!collapsed && (
               <div className="flex flex-col">
                 <span className="font-semibold text-gray-800">{user.username}</span>
                 <span className="text-xs text-gray-500">{user.role.replace('_', ' ')}</span>
               </div>
             )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 mt-2"
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 text-gray-500 hover:text-[#0a9c82] hover:bg-gray-50 flex justify-center border-t-2 border-[#0a9c82] transition-all duration-150"
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b-2 border-[#0a9c82] px-8 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-lg font-bold text-[#073b4c] tracking-tight">ORIT Operational Slice</h1>
          
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setHasVibrated(true); }}
                className={`p-2.5 text-gray-500 hover:text-[#0a9c82] hover:bg-teal-50 rounded-xl transition-all duration-150 relative ${unreadCount > 0 && !showNotifications ? 'animate-bounce' : ''}`}
              >
                <NotificationIcon />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gradient-to-br from-pink-500 to-pink-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => { setShowNotifications(false); setHasVibrated(true); }}
                  />
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border-2 border-[#0a9c82] z-50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 border-b-2 border-[#0a9c82] flex justify-between items-center">
                      <span className="font-bold text-[#073b4c]">System Alerts</span>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">{unreadCount} Unread</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {roleNotifications.length === 0 ? (
                        <div className="p-10 text-center text-gray-400 text-xs italic">No alerts for your role.</div>
                      ) : (
                        roleNotifications.map(notif => (
                          <div 
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-teal-50/50 cursor-pointer transition-all duration-150 ${!notif.isRead ? 'bg-teal-50/50 border-l-4 border-l-[#0a9c82]' : ''}`}
                            onClick={() => {
                              markNotificationRead(notif.id);
                              setShowNotifications(false);
                              const targetPath = user.role === UserRole.ORIT_OPS ? '/jobs' : '/field-jobs';
                              navigate(targetPath, { state: { highlightJobId: notif.jobId } });
                            }}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold text-[#0a9c82]">{notif.title}</span>
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

            <div className="flex items-center gap-4 text-sm text-gray-600">
               <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-sm"></span>
                 <span className="text-xs font-medium">System Online</span>
               </div>
               <div className="h-4 w-px bg-gray-300"></div>
               <span className="text-xs">Region: <span className="font-semibold text-gray-800">{user.region}</span></span>
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
