import React, { useState, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../AppContext';
import { UserRole } from '../types';
import { DashboardIcon, JobsIcon, MapIcon, InventoryIcon, NotificationIcon, SupportIcon } from './Icons';

interface OrderNotification {
  id: string;
  orderId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  target: 'OPS' | 'AGENT';
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, notifications, markNotificationRead } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasVibrated, setHasVibrated] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState<OrderNotification[]>([]);

  React.useEffect(() => {
    const handleOrderNotification = (event: any) => {
      const { orderId, title, message, target } = event.detail;
      const userTarget = user?.role === UserRole.ORIT_OPS ? 'OPS' : 'AGENT';
      
      if (target === userTarget) {
        const newNotif: OrderNotification = {
          id: `ON-${Date.now()}`,
          orderId,
          title,
          message,
          timestamp: new Date().toISOString(),
          isRead: false,
          target
        };
        setOrderNotifications(prev => [newNotif, ...prev]);
      }
    };

    window.addEventListener('orderNotification', handleOrderNotification);
    return () => window.removeEventListener('orderNotification', handleOrderNotification);
  }, [user]);

  if (!user) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    ...(user.role === UserRole.ORIT_OPS ? [
      { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { to: '/orders', label: 'Orders', icon: <JobsIcon /> },
      { to: '/inventory', label: 'Inventory', icon: <InventoryIcon /> },
    ] : [
      { to: '/field-jobs', label: 'My Jobs', icon: <JobsIcon /> },
      { to: '/support', label: 'Support', icon: <SupportIcon /> },
    ]),
    { to: '/map', label: 'Asset Map', icon: <MapIcon /> },
  ];

  const roleNotifications = useMemo(() => {
    return notifications.filter(n => !n.targetRole || n.targetRole === user.role);
  }, [notifications, user.role]);

  const unreadCount = useMemo(() => {
    return roleNotifications.filter(n => !n.isRead).length + orderNotifications.filter(n => !n.isRead).length;
  }, [roleNotifications, orderNotifications]);

  React.useEffect(() => {
    if (unreadCount > 0 && !hasVibrated) {
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      setHasVibrated(true);
    }
  }, [unreadCount, hasVibrated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-[#073b4c] shadow-md">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Row 1 - Logo */}
          <div className="flex items-center h-16 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#0a9c82] to-[#4ac59d] rounded-lg p-1.5 shadow-md">
                <div className="w-6 h-6 bg-white rounded"></div>
              </div>
              <span className="font-bold text-xl text-white">
                Openreach <span className="text-[#4ac59d]">ORIT</span>
              </span>
            </div>
          </div>

          {/* Row 2 - Navigation Below Logo */}
          <div className="flex justify-between items-center h-14">
            {/* Center - Navigation (Desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-150 ${isActive ? 'bg-[#0a9c82] text-white shadow-md' : 'text-white/90 hover:bg-white/10 hover:text-white'}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setHasVibrated(true); }}
                  className={`p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all relative ${unreadCount > 0 && !showNotifications ? 'animate-bounce' : ''}`}
                >
                  <NotificationIcon />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-pink-500 to-pink-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-[#073b4c] shadow-md font-bold">
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
                        {orderNotifications.length === 0 && roleNotifications.length === 0 ? (
                          <div className="p-10 text-center text-gray-400 text-xs italic">No alerts for your role.</div>
                        ) : (
                          <>
                            {orderNotifications.map(notif => (
                              <div 
                                key={notif.id}
                                className={`p-4 border-b border-gray-100 hover:bg-teal-50/50 cursor-pointer transition-all duration-150 ${!notif.isRead ? 'bg-teal-50/50 border-l-4 border-l-[#0a9c82]' : ''}`}
                                onClick={() => {
                                  setOrderNotifications(prev => prev.map(n => n.id === notif.id ? {...n, isRead: true} : n));
                                  setShowNotifications(false);
                                  const targetPath = user.role === UserRole.ORIT_OPS ? `/orders/${notif.orderId}` : `/agent/orders/${notif.orderId}`;
                                  navigate(targetPath);
                                }}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs font-bold text-[#0a9c82]">{notif.title}</span>
                                  <span className="text-[10px] text-gray-400">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p>
                                <div className="mt-2 text-[10px] font-mono font-bold text-gray-400">Order: {notif.orderId}</div>
                              </div>
                            ))}
                            {roleNotifications.map(notif => (
                              <div 
                                key={notif.id}
                                className={`p-4 border-b border-gray-100 hover:bg-teal-50/50 cursor-pointer transition-all duration-150 ${!notif.isRead ? 'bg-teal-50/50 border-l-4 border-l-[#0a9c82]' : ''}`}
                                onClick={() => {
                                  markNotificationRead(notif.id);
                                  setShowNotifications(false);
                                  const targetPath = user.role === UserRole.ORIT_OPS ? '/orders' : '/field-jobs';
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
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Region Badge */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                <span className="text-xs font-semibold text-white">{user.region}</span>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0a9c82] to-[#4ac59d] flex items-center justify-center font-bold text-white shadow-md text-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block">
                  <div className="text-sm font-semibold text-white">{user.username}</div>
                  <div className="text-xs text-white/70">{user.role.replace('_', ' ')}</div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-red-500/20 hover:text-white transition-all text-sm font-semibold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden lg:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-white/10 py-4 space-y-2">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${isActive ? 'bg-[#0a9c82] text-white' : 'text-white/90 hover:bg-white/10'}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-red-500/20 hover:text-white transition-all font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
