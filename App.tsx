import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

import { INFANTS_DATA, EDUCATIONAL_CONTENT_DATA, NOTIFICATIONS_DATA } from './constants';
import { USERS_DATA } from './users';
import { Infant, EducationalContent, Notification, UserType, View, Toast, Theme, User } from './types';
import { Sidebar, Header } from './components/Layout';
import { AddPatientModal, EducationModal, ToastComponent, Modal, AddChildModal, CatchUpPlanModal, MarkdownRenderer } from './components/common';
import { LoginView, SignupView } from './views/Auth';
import ParentDashboardView from './views/CaregiverDashboard';
import PractitionerDashboardView from './views/ProviderDashboard';
import EducationView from './views/EducationView';
import NotificationsView from './views/NotificationsView';
import SettingsView from './views/SettingsView';
import ReportsView from './views/ReportsView';
import MyChildrenView from './views/MyChildrenView';
import AnalysisView from './views/AnalysisView';
import { Sparkles, X, MessageSquare, ListPlus, Shield } from './components/icons';
import './utils';

// --- Splash Screen Component ---
const SplashScreen: React.FC = () => (
  <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center text-center p-4">
    <div className="animate-scale-in space-y-4">
      <div className="inline-block bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-full shadow-lg">
         <Shield className="w-16 h-16 text-white animate-pulse" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">VaxTrack NG</h1>
      <p className="text-gray-500 dark:text-gray-400">Protecting Nigeria's future, one jab at a time.</p>
      <div className="pt-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  </div>
);

// --- AI Chat Modal Component ---
interface AiChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const chatSession = useRef<Chat | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            chatSession.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a helpful and compassionate health assistant for VaxTrack NG. You provide clear, concise, and accurate information about infant vaccinations, child health, and the Nigerian immunization schedule. Your tone is supportive and easy for parents to understand. Format your responses with markdown for readability (using '*' for lists and '**' for bold).",
                },
            });
            setMessages([{ role: 'model', text: "Hello! I'm VaxTrack's AI assistant. How can I help you with your vaccination questions today?" }]);
        } else {
            chatSession.current = null;
            setMessages([]);
            setInput('');
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || !chatSession.current) return;

        const userMessage = { role: 'user' as const, text: input };
        setMessages(prev => [...prev, userMessage]);
        const messageToSend = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatSession.current.sendMessage({ message: messageToSend });
            
            const modelMessage = { role: 'model' as const, text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage = { role: 'model' as const, text: "Sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Ask VaxTrack AI">
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto pr-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200'}`}>
                  {msg.role === 'model' ? <MarkdownRenderer text={msg.text} /> : msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()}
              placeholder="Ask about vaccines, schedules..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </Modal>
    )
}

// --- Main App Component ---
const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('system');

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  
  const [infants, setInfants] = useState<Infant[]>(INFANTS_DATA);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_DATA);
  const [educationalContent] = useState<EducationalContent[]>(EDUCATIONAL_CONTENT_DATA);

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isCatchUpPlanOpen, setIsCatchUpPlanOpen] = useState(false);

  const [selectedEducationalContent, setSelectedEducationalContent] = useState<EducationalContent | null>(null);
  const [selectedInfantId, setSelectedInfantId] = useState<number | null>(null);
  
  const [toast, setToast] = useState<Toast>({ show: false, message: '', type: 'info' });

  const aiMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) {
            setIsAiMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.removeItem('theme');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  }, []);
  
  const handleLogin = (email: string, pass: string) => {
      setAuthError('');
      const user = users.find(u => u.email === email && u.password === pass);
      if (user) {
          setCurrentUser(user);
          setCurrentView('dashboard');
          setSelectedInfantId(null);
      } else {
          setAuthError('Invalid email or password.');
      }
  };

  const handleSignup = (name: string, email: string, pass: string, userType: UserType) => {
      setAuthError('');
      if (users.some(u => u.email === email)) {
          setAuthError('An account with this email already exists.');
          return;
      }
      const newUser: User = { id: Date.now(), name, email, password: pass, userType };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setCurrentView('dashboard');
      setSelectedInfantId(null);
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setAuthView('login');
      setAuthError('');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleAddPatient = (patient: Infant) => {
    setInfants(prev => [...prev, patient]);
    showToast('Patient added successfully!', 'success');
  };

  const handleAddChild = (child: Infant) => {
    setInfants(prev => [...prev, child]);
    showToast('Child added successfully!', 'success');
    setSelectedInfantId(child.id);
    setCurrentView('my-children');
  };

  const handleReadMore = (content: EducationalContent) => {
    setSelectedEducationalContent(content);
    setIsEducationModalOpen(true);
  };

  const handleViewChildDetails = (infantId: number) => {
    setSelectedInfantId(infantId);
    setCurrentView('my-children');
  };

  const handleViewChildList = () => {
      setSelectedInfantId(null);
      setCurrentView('my-children');
  };
  
  const renderContent = () => {
    if (!currentUser) return null; // Should not happen if authenticated
    
    if (currentUser.userType === 'parent') {
      switch (currentView) {
        case 'dashboard':
          return <ParentDashboardView 
                    infants={infants} 
                    user={currentUser}
                    onViewChildren={handleViewChildList}
                    onSelectChild={handleViewChildDetails}
                 />;
        case 'my-children':
          return <MyChildrenView 
                    infants={infants} 
                    user={currentUser}
                    onAddChildClick={() => setIsAddChildModalOpen(true)}
                    selectedInfantId={selectedInfantId}
                    setSelectedInfantId={setSelectedInfantId}
                 />;
        case 'education':
          return <EducationView content={educationalContent} onReadMore={handleReadMore} />;
        case 'notifications':
          return <NotificationsView notifications={notifications} />;
        case 'settings':
          return <SettingsView 
                    theme={theme} 
                    setTheme={setTheme} 
                    currentUser={currentUser}
                    onUpdateUser={handleUpdateUser}
                    showToast={showToast}
                 />;
        default:
          return <ParentDashboardView infants={infants} user={currentUser} onViewChildren={handleViewChildList} onSelectChild={handleViewChildDetails} />;
      }
    } else { // healthPractitioner
      switch (currentView) {
        case 'dashboard':
          return <PractitionerDashboardView infants={infants} notifications={notifications} onAddPatientClick={() => setIsAddPatientModalOpen(true)} showStats={true} />;
        case 'patients':
          return <PractitionerDashboardView infants={infants} notifications={notifications} onAddPatientClick={() => setIsAddPatientModalOpen(true)} showStats={false} />;
        case 'education':
          return <EducationView content={educationalContent} onReadMore={handleReadMore} />;
        case 'reports':
          return <ReportsView infants={infants} showToast={showToast} />;
        case 'analysis':
          return <AnalysisView infants={infants} />;
        case 'notifications':
            return <NotificationsView notifications={notifications} />;
        case 'settings':
            return <SettingsView 
                      theme={theme} 
                      setTheme={setTheme} 
                      currentUser={currentUser}
                      onUpdateUser={handleUpdateUser}
                      showToast={showToast}
                   />;
        default:
          return <PractitionerDashboardView infants={infants} notifications={notifications} onAddPatientClick={() => setIsAddPatientModalOpen(true)} showStats={true} />;
      }
    }
  };

  if (isAppLoading) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center p-4">
            <div className="flex items-center space-x-2 mb-8">
                <Shield className="w-10 h-10 text-blue-600" />
                <span className="text-3xl font-bold text-gray-800 dark:text-white">VaxTrack NG</span>
            </div>
            {authView === 'login' ? (
                <LoginView onLogin={handleLogin} onSwitchToSignup={() => { setAuthView('signup'); setAuthError(''); }} error={authError} />
            ) : (
                <SignupView onSignup={handleSignup} onSwitchToLogin={() => { setAuthView('login'); setAuthError(''); }} error={authError} />
            )}
        </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen text-gray-800 dark:text-gray-200">
      <div className="flex">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          user={currentUser}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col min-w-0">
          <Header 
            user={currentUser}
            setSidebarOpen={setSidebarOpen}
            notifications={notifications}
            setCurrentView={setCurrentView}
          />
          <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>

      <div ref={aiMenuRef} className="fixed bottom-6 right-6 z-30">
        {isAiMenuOpen && (
             <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 p-2 space-y-1 animate-fade-in-up">
                 <button 
                    onClick={() => { setIsAiChatOpen(true); setIsAiMenuOpen(false); }}
                    className="w-full flex items-center text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                    <MessageSquare className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                        <p className="font-semibold">Ask a Question</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get quick answers from AI</p>
                    </div>
                </button>
                 <button 
                    onClick={() => { setIsCatchUpPlanOpen(true); setIsAiMenuOpen(false); }}
                    className="w-full flex items-center text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                >
                    <ListPlus className="w-5 h-5 mr-3 text-purple-500" />
                     <div>
                        <p className="font-semibold">Create Catch-Up Plan</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Generate a new schedule</p>
                    </div>
                </button>
            </div>
        )}
        <button
            onClick={() => setIsAiMenuOpen(prev => !prev)}
            className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:scale-105 transform transition-transform duration-200"
            aria-label="Open VaxTrack AI Menu"
        >
          {isAiMenuOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </button>
      </div>

      <ToastComponent toast={toast} onClose={() => setToast({ ...toast, show: false })} />
      <AddPatientModal isOpen={isAddPatientModalOpen} onClose={() => setIsAddPatientModalOpen(false)} onAddPatient={handleAddPatient} />
      <AddChildModal isOpen={isAddChildModalOpen} onClose={() => setIsAddChildModalOpen(false)} onAddChild={handleAddChild} currentUser={currentUser} />
      <EducationModal isOpen={isEducationModalOpen} onClose={() => setIsEducationModalOpen(false)} content={selectedEducationalContent} />
      <AiChatModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      <CatchUpPlanModal isOpen={isCatchUpPlanOpen} onClose={() => setIsCatchUpPlanOpen(false)} />
    </div>
  );
};

export default App;