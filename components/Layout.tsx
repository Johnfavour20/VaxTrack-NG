import React from 'react';
import { Baby, Bell, BookOpen, FileText, Settings, User, Users, BarChart3, Menu, X, ChevronDown, LogOut, Shield, TrendingUp } from './icons';
import { View, User as UserType, Notification } from '../types';

// NavItem Component
interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2.5 text-left rounded-lg transition-colors text-sm font-medium ${
        isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </button>
  </li>
);

// Sidebar Component
interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  user: UserType;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, user, sidebarOpen, setSidebarOpen, onLogout }) => {
  const parentNav: { view: View; label: string; icon: React.ElementType }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { view: 'my-children', label: 'My Children', icon: Baby },
    { view: 'education', label: 'Education', icon: BookOpen },
    { view: 'notifications', label: 'Notifications', icon: Bell },
    { view: 'settings', label: 'Settings', icon: Settings },
  ];

  const healthPractitionerNav: { view: View; label: string; icon: React.ElementType }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { view: 'patients', label: 'Patients', icon: Users },
    { view: 'reports', label: 'Reports', icon: FileText },
    { view: 'analysis', label: 'Analysis', icon: TrendingUp },
    { view: 'education', label: 'Education', icon: BookOpen },
    { view: 'notifications', label: 'Notifications', icon: Bell },
    { view: 'settings', label: 'Settings', icon: Settings },
  ];

  const navItems = user.userType === 'parent' ? parentNav : healthPractitionerNav;

  const handleNavigation = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
  }

  return (
    <>
      <aside className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">VaxTrack</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-1.5">
            {navItems.map(item => (
              <NavItem
                key={item.view}
                icon={item.icon}
                label={item.label}
                isActive={currentView === item.view}
                onClick={() => handleNavigation(item.view)}
              />
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4 border-t dark:border-slate-700">
            <button onClick={onLogout} className="flex items-center w-full px-3 py-2.5 text-left rounded-lg transition-colors text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700">
                <LogOut className="w-5 h-5 mr-3"/>
                Logout
            </button>
        </div>
      </aside>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"></div>}
    </>
  );
};

// Header Component
interface HeaderProps {
    user: UserType;
    setSidebarOpen: (open: boolean) => void;
    notifications: Notification[];
    setCurrentView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, setSidebarOpen, notifications, setCurrentView }) => {
    const unreadNotifications = notifications.filter(n => n.urgent).length;
    const displayUserType = user.userType === 'parent' ? 'Parent' : 'Health Practitioner';

    return (
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-20">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="hidden lg:block">
                        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Welcome, {user.name.split(' ')[0]}!
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setCurrentView('notifications')} className="relative text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                            <Bell className="w-6 h-6"/>
                            {unreadNotifications > 0 && (
                                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                            )}
                        </button>

                        <button
                            onClick={() => setCurrentView('settings')}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                           <User className="w-8 h-8 p-1.5 bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300 rounded-full"/>
                           <div className="hidden md:block text-left">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{displayUserType}</p>
                           </div>
                           <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};