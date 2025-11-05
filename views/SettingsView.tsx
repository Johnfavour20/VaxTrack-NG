import React, { useState } from 'react';
import { User as UserIcon, Bell, Moon, Sun, Laptop } from '../components/icons';
import { Theme, User, Toast } from '../types';

interface SettingsCardProps {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ icon: Icon, title, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700">
        <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b dark:border-slate-600 pb-4 mb-4 flex items-center">
                <Icon className="mr-3 text-blue-600" />
                {title}
            </h3>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    </div>
);

interface ToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, description, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <button
            type="button"
            className={`${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800`}
            role="switch"
            aria-checked={enabled}
            onClick={() => setEnabled(!enabled)}
        >
            <span className={`${enabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}/>
        </button>
    </div>
);

interface SettingsViewProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    currentUser: User;
    onUpdateUser: (user: User) => void;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme, currentUser, onUpdateUser, showToast }) => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [name, setName] = useState(currentUser.name);
    
    const [emailReminders, setEmailReminders] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [overdueAlerts, setOverdueAlerts] = useState(true);

    const themeOptions: { name: Theme, icon: React.ElementType }[] = [
        { name: 'light', icon: Sun },
        { name: 'dark', icon: Moon },
        { name: 'system', icon: Laptop },
    ];
    
    const handleProfileSave = () => {
        onUpdateUser({ ...currentUser, name });
        setIsEditingProfile(false);
        showToast('Profile updated successfully!', 'success');
    };

    const handleProfileCancel = () => {
        setName(currentUser.name);
        setIsEditingProfile(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
            
            <SettingsCard icon={UserIcon} title="Profile Settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            disabled={!isEditingProfile} 
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:dark:bg-slate-700 dark:bg-slate-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input type="email" value={currentUser.email} disabled className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 shadow-sm"/>
                    </div>
                </div>
                 <div className="flex justify-end space-x-2">
                    {isEditingProfile ? (
                        <>
                             <button onClick={handleProfileCancel} className="px-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                                Cancel
                            </button>
                            <button onClick={handleProfileSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditingProfile(true)} className="px-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
                            Edit Profile
                        </button>
                    )}
                </div>
            </SettingsCard>

            <SettingsCard icon={Bell} title="Notification Preferences">
                <Toggle label="Email Reminders" description="Receive reminders for upcoming vaccinations via email." enabled={emailReminders} setEnabled={setEmailReminders} />
                <Toggle label="Push Notifications" description="Get instant alerts on your device." enabled={pushNotifications} setEnabled={setPushNotifications} />
                <Toggle label="Overdue Alerts" description="Be notified when a vaccination is overdue." enabled={overdueAlerts} setEnabled={setOverdueAlerts} />
            </SettingsCard>

            <SettingsCard icon={Moon} title="Appearance">
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">Customize the look and feel of the application.</p>
                <div className="flex justify-center sm:justify-start space-x-2 rounded-lg bg-gray-100 dark:bg-slate-700 p-1.5">
                    {themeOptions.map(option => (
                        <button 
                            key={option.name} 
                            onClick={() => setTheme(option.name)}
                            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${theme === option.name ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-slate-900/60'}`}
                        >
                            <option.icon className="w-5 h-5" />
                            <span className="capitalize">{option.name}</span>
                        </button>
                    ))}
                </div>
            </SettingsCard>
        </div>
    );
};

export default SettingsView;