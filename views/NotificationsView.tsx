
import React from 'react';
import { Notification } from '../types';
import { Bell, AlertTriangle, Info, CheckCircle } from '../components/icons';

interface NotificationsViewProps {
  notifications: Notification[];
}

const NotificationsView: React.FC<NotificationsViewProps> = ({ notifications }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700">
      <div className="p-6 border-b dark:border-slate-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">All your alerts and reminders in one place.</p>
      </div>
      <div className="p-6">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start space-x-4 p-4 rounded-lg border ${notification.urgent ? 'border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/50' : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'reminder' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : notification.type === 'alert' ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300' : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'}`}>
                  {notification.type === 'reminder' ? <Bell className="w-5 h-5" /> : notification.type === 'alert' ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 text-green-500 dark:text-green-300 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">All Caught Up!</h4>
            <p className="mt-1 text-gray-500 dark:text-gray-400">You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsView;