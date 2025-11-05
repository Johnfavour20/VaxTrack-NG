import React, { useState } from 'react';
import { Shield, User, UserPlus } from '../components/icons';
import { UserType } from '../types';

interface LoginViewProps {
    onLogin: (email: string, pass: string) => void;
    onSwitchToSignup: () => void;
    error: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSwitchToSignup, error }) => {
    const [email, setEmail] = useState('sarah@test.com');
    const [password, setPassword] = useState('password123');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4 border dark:border-slate-700">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to continue to VaxTrack</p>
                </div>

                {error && <p className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input className="shadow-sm appearance-none border dark:border-slate-600 rounded-lg w-full py-3 px-3 text-gray-700 dark:text-white dark:bg-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow-sm appearance-none border dark:border-slate-600 rounded-lg w-full py-3 px-3 text-gray-700 dark:text-white dark:bg-slate-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" placeholder="******************" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center" type="submit">
                        <User className="w-5 h-5 mr-2" />
                        Sign In
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Sign Up
                </button>
            </p>
        </div>
    );
};

interface SignupViewProps {
    onSignup: (name: string, email: string, pass: string, userType: UserType) => void;
    onSwitchToLogin: () => void;
    error: string;
}

export const SignupView: React.FC<SignupViewProps> = ({ onSignup, onSwitchToLogin, error }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState<UserType>('parent');

     const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignup(name, email, password, userType);
    };

    return (
        <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4 border dark:border-slate-700">
                 <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Account</h1>
                    <p className="text-gray-500 dark:text-gray-400">Join VaxTrack to protect your loved ones</p>
                </div>
                 {error && <p className="bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg relative mb-4 text-sm" role="alert">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                        Full Name
                    </label>
                    <input className="shadow-sm appearance-none border dark:border-slate-600 rounded-lg w-full py-3 px-3 text-gray-700 dark:text-white dark:bg-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="name" type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email-signup">
                        Email Address
                    </label>
                    <input className="shadow-sm appearance-none border dark:border-slate-600 rounded-lg w-full py-3 px-3 text-gray-700 dark:text-white dark:bg-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email-signup" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password-signup">
                        Password
                    </label>
                    <input className="shadow-sm appearance-none border dark:border-slate-600 rounded-lg w-full py-3 px-3 text-gray-700 dark:text-white dark:bg-slate-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password-signup" type="password" placeholder="******************" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">I am a...</label>
                    <div className="flex rounded-lg bg-gray-100 dark:bg-slate-700 p-1">
                        <button type="button" onClick={() => setUserType('parent')} className={`flex-1 text-center rounded-md py-2 text-sm font-medium transition-colors ${userType === 'parent' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}>
                            Parent
                        </button>
                        <button type="button" onClick={() => setUserType('healthPractitioner')} className={`flex-1 text-center rounded-md py-2 text-sm font-medium transition-colors ${userType === 'healthPractitioner' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'}`}>
                            Health Practitioner
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center" type="submit">
                        <UserPlus className="w-5 h-5 mr-2" />
                        Sign Up
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Sign In
                </button>
            </p>
        </div>
    )
};