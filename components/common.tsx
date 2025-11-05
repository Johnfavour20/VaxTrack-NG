import React, { useState, useEffect, Fragment } from 'react';
import { X, CheckCircle, AlertTriangle, Info, UserPlus, Baby, Sparkles } from './icons';
import { Infant, EducationalContent, Toast, User } from '../types';
import { GoogleGenAI } from '@google/genai';
import { generateInitialSchedule, calculateCompletionRate } from '../utils';

// --- Markdown Renderer ---
export const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    const elements = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-2">{listItems}</ul>);
            listItems = [];
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            const parts = trimmedLine.substring(2).split('**');
            const content = parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
            listItems.push(<li key={index}>{content}</li>);
        } else {
            flushList();
            if (trimmedLine.startsWith('### ')) {
                elements.push(<h3 key={index} className="text-md font-semibold mt-3 mb-1">{trimmedLine.substring(4)}</h3>);
            } else if (trimmedLine.startsWith('## ')) {
                elements.push(<h2 key={index} className="text-lg font-semibold mt-4 mb-2">{trimmedLine.substring(3)}</h2>);
            } else if (trimmedLine) {
                const parts = line.split('**');
                const pElements = parts.map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                );
                elements.push(<p key={index} className="mb-2">{pElements}</p>);
            }
        }
    });

    flushList(); 

    return <div className="text-gray-800 dark:text-gray-200">{elements}</div>;
};

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-scale-in`}>
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Toast Component
interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

export const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, onClose]);
  
  if (!toast.show) return null;

  const toastStyles = {
    success: { bg: 'bg-green-50 dark:bg-green-900/50', border: 'border-green-400 dark:border-green-700', text: 'text-green-800 dark:text-green-200', icon: <CheckCircle className="text-green-500" /> },
    error: { bg: 'bg-red-50 dark:bg-red-900/50', border: 'border-red-400 dark:border-red-700', text: 'text-red-800 dark:text-red-200', icon: <AlertTriangle className="text-red-500" /> },
    info: { bg: 'bg-blue-50 dark:bg-blue-900/50', border: 'border-blue-400 dark:border-blue-700', text: 'text-blue-800 dark:text-blue-200', icon: <Info className="text-blue-500" /> },
  };

  const style = toastStyles[toast.type];

  return (
    <div className={`fixed top-5 right-5 z-50 p-4 rounded-lg border-l-4 shadow-lg flex items-center space-x-4 ${style.bg} ${style.border} ${style.text} animate-fade-in-right`}>
      {style.icon}
      <p className="font-medium">{toast.message}</p>
      <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 focus:ring-gray-400 inline-flex h-8 w-8">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

// AddPatientModal Component
interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddPatient: (patient: Infant) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAddPatient }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [parentName, setParentName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const vaccinations = generateInitialSchedule(dob);
        const completionRate = calculateCompletionRate(vaccinations);

        const newPatient: Infant = {
            id: Date.now(),
            name,
            dateOfBirth: dob,
            gender: 'Male', // Default, can be changed
            avatar: '👶',
            parentName,
            phoneNumber: phone,
            vaccinations: vaccinations,
            completionRate: completionRate,
        };
        onAddPatient(newPatient);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Patient">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Child's Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" required />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <input type="date" id="dob" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" required />
                </div>
                <div>
                    <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent's Name</label>
                    <input type="text" id="parentName" value={parentName} onChange={e => setParentName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" required />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" required />
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <UserPlus className="w-4 h-4 mr-2" /> Add Patient
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// AddChildModal Component
interface AddChildModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddChild: (child: Infant) => void;
    currentUser: User;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({ isOpen, onClose, onAddChild, currentUser }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Female');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const vaccinations = generateInitialSchedule(dob);
        const completionRate = calculateCompletionRate(vaccinations);
        
        const newChild: Infant = {
            id: Date.now(),
            name,
            dateOfBirth: dob,
            gender: gender,
            avatar: gender === 'Female' ? '👧' : '👶',
            parentName: currentUser.name, // Assign to our logged in caregiver
            phoneNumber: '', // Not needed for caregiver view
            vaccinations: vaccinations,
            completionRate: completionRate,
        };
        onAddChild(newChild);
        onClose();
        // Reset form
        setName('');
        setDob('');
        setGender('Female');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add a New Child">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Child's Name</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" required />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <input type="date" id="dob" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <div className="flex space-x-4 mt-2">
                        <label className="flex items-center">
                            <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} className="form-radio h-4 w-4 text-blue-600 border-gray-300 dark:border-slate-500 focus:ring-blue-500"/>
                            <span className="ml-2 text-gray-700 dark:text-gray-300">Female</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} className="form-radio h-4 w-4 text-blue-600 border-gray-300 dark:border-slate-500 focus:ring-blue-500"/>
                             <span className="ml-2 text-gray-700 dark:text-gray-300">Male</span>
                        </label>
                    </div>
                </div>
                <div className="flex justify-end pt-4 space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <Baby className="w-4 h-4 mr-2" /> Add Child
                    </button>
                </div>
            </form>
        </Modal>
    );
};


// EducationModal Component
interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: EducationalContent | null;
}

const RichContentRenderer: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split('**Key Takeaways**');
    const mainContent = parts[0];
    const takeawaysContent = parts.length > 1 ? parts[1] : '';

    const renderMainContent = () => {
        return mainContent.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                return <h4 key={index} className="font-semibold text-lg mt-5 mb-2 text-gray-800 dark:text-gray-200">{trimmedLine.replace(/\*\*/g, '')}</h4>;
            }
            if (trimmedLine === '') return null;
            return <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{trimmedLine}</p>;
        }).filter(Boolean);
    };

    const renderTakeaways = () => {
        if (!takeawaysContent) return null;
        const listItems = takeawaysContent.trim().split('\n').map((item, index) => (
            <li key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-blue-500 mr-3 mt-1 flex-shrink-0"/>
                <span>{item.replace(/^- /, '').trim()}</span>
            </li>
        ));
        return (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-lg border border-blue-200 dark:border-slate-600">
                <h4 className="font-semibold text-lg mb-3 text-blue-800 dark:text-blue-300">Key Takeaways</h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">{listItems}</ul>
            </div>
        );
    };

    return (
        <div>
            {renderMainContent()}
            {renderTakeaways()}
        </div>
    );
};

export const EducationModal: React.FC<EducationModalProps> = ({ isOpen, onClose, content }) => {
    const [view, setView] = useState<'original' | 'simplified'>('original');
    const [simplifiedContent, setSimplifiedContent] = useState<string | null>(null);
    const [isSimplifying, setIsSimplifying] = useState(false);
    
    const [followUpQuestion, setFollowUpQuestion] = useState('');
    const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
    const [isAsking, setIsAsking] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setView('original');
            setSimplifiedContent(null);
            setIsSimplifying(false);
            setFollowUpQuestion('');
            setFollowUpAnswer(null);
            setIsAsking(false);
            setError('');
        }
    }, [isOpen]);

    const handleSimplify = async () => {
        if (!content) return;
        setIsSimplifying(true);
        setError('');
        setSimplifiedContent(null);

        const prompt = `You are a helpful health assistant. Take the following article and simplify it for a parent who may not be familiar with medical terms. Keep the key information but use plain, easy-to-understand language using simple bullet points or short paragraphs. Here is the article:\n\n---\n\n${content.content}`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { temperature: 0.2 }
            });
            setSimplifiedContent(response.text);
            setView('simplified');
        } catch (err) {
            console.error("Error simplifying content:", err);
            setError("Sorry, I couldn't simplify this article right now. Please try again.");
        } finally {
            setIsSimplifying(false);
        }
    };
    
    const handleAskFollowUp = async () => {
        if (!content || !followUpQuestion.trim()) return;
        setIsAsking(true);
        setError('');
        setFollowUpAnswer(null);

        const prompt = `You are a helpful health assistant. Based on the following article content, please answer the user's question concisely. If the answer isn't in the article, politely state that.
        
        Article Content:\n---\n${content.content}\n---\n
        
        User's Question: "${followUpQuestion}"`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { temperature: 0.5 }
            });
            setFollowUpAnswer(response.text);
        } catch (err) {
            console.error("Error asking follow-up:", err);
            setError("Sorry, I couldn't answer your question right now. Please try again.");
        } finally {
            setIsAsking(false);
        }
    };

    if (!content) return null;
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={content.title} maxWidth="max-w-3xl">
            <div className="space-y-4">
                <div className="flex items-center justify-between space-x-4 text-sm text-gray-500 dark:text-gray-400 border-b dark:border-slate-700 pb-4">
                    <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">{content.category}</span>
                        <span>{content.readTime}</span>
                    </div>
                    <button 
                        onClick={handleSimplify}
                        disabled={isSimplifying}
                        className="flex items-center space-x-2 px-3 py-1.5 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/50 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-wait"
                    >
                         {isSimplifying ? (
                            <>
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                <span>Simplifying...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Simplify with AI</span>
                            </>
                        )}
                    </button>
                </div>
                
                <div className="p-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex justify-center space-x-1 rounded-lg bg-gray-200 dark:bg-slate-600 p-1 mb-4">
                        <button onClick={() => setView('original')} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'original' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-slate-700'}`}>Original</button>
                        <button onClick={() => setView('simplified')} disabled={!simplifiedContent} className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors disabled:text-gray-400 dark:disabled:text-gray-500 ${view === 'simplified' ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-white/50 dark:hover:bg-slate-700'}`}>Simplified</button>
                    </div>

                    <div className="px-2 pb-2 min-h-[200px]">
                        {view === 'original' && <RichContentRenderer text={content.content} />}
                        {view === 'simplified' && simplifiedContent && <MarkdownRenderer text={simplifiedContent} />}
                        {view === 'simplified' && !simplifiedContent && (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <p>Click "Simplify with AI" to generate an easy-to-read version of this article.</p>
                            </div>
                        )}
                    </div>
                </div>

                 <div className="border-t dark:border-slate-700 pt-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Ask a follow-up question</h4>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={followUpQuestion}
                            onChange={e => setFollowUpQuestion(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && !isAsking && handleAskFollowUp()}
                            placeholder="e.g., How high can the fever be?"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                            disabled={isAsking}
                        />
                        <button onClick={handleAskFollowUp} disabled={isAsking} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:bg-blue-400">
                            {isAsking ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Ask"
                            )}
                        </button>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    
                    {isAsking && !followUpAnswer && (
                         <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex items-center space-x-2">
                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                         </div>
                    )}
                    
                    {followUpAnswer && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-slate-700/50 rounded-lg border border-blue-200 dark:border-slate-600 animate-fade-in-up">
                            <MarkdownRenderer text={followUpAnswer} />
                        </div>
                    )}
                 </div>

                 <div className="flex justify-end pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Close</button>
                </div>
            </div>
        </Modal>
    );
};

// --- AI Catch-Up Plan Modal Component ---
interface CatchUpPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NPI_SCHEDULE_VACCINES = [
    'BCG', 'Hepatitis B (1st dose)', 'OPV (1st dose)', 'Pentavalent (1st dose)', 
    'PCV (1st dose)', 'OPV (2nd dose)', 'Pentavalent (2nd dose)', 'PCV (2nd dose)',
    'OPV (3rd dose)', 'Pentavalent (3rd dose)', 'PCV (3rd dose)', 'IPV', 
    'Measles (1st dose)', 'Yellow Fever'
];

export const CatchUpPlanModal: React.FC<CatchUpPlanModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [dob, setDob] = useState('');
    const [checkedVaccines, setCheckedVaccines] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setStep(1);
            setDob('');
            setCheckedVaccines([]);
            setIsLoading(false);
            setResult('');
            setError('');
        }
    }, [isOpen]);

    const handleVaccineToggle = (vaccine: string) => {
        setCheckedVaccines(prev => 
            prev.includes(vaccine) ? prev.filter(v => v !== vaccine) : [...prev, vaccine]
        );
    };

    const generatePlan = async () => {
        setIsLoading(true);
        setResult('');
        setError('');

        const prompt = `
            You are an expert pediatric health assistant specializing in the Nigerian National Programme on Immunization (NPI). Your task is to create a safe and clear catch-up vaccination schedule for a child.

            **Context:**
            - Child's Date of Birth: ${dob}
            - Current Date: ${new Date().toISOString().split('T')[0]}
            - Vaccines Already Administered: ${checkedVaccines.length > 0 ? checkedVaccines.join(', ') : 'None'}
            - Reference Nigerian NPI Schedule:
                - At Birth: BCG, OPV 0, HBV 1
                - 6 Weeks: OPV 1, Pentavalent 1, PCV 1
                - 10 Weeks: OPV 2, Pentavalent 2, PCV 2
                - 14 Weeks: OPV 3, Pentavalent 3, PCV 3, IPV
                - 9 Months: Measles 1, Yellow Fever

            **Task:**
            Based on the information above, generate a personalized catch-up immunization plan. 
            - The plan should be organized chronologically by what needs to be done first.
            - For each recommended vaccination, state the vaccine name and the recommended timeframe for administration.
            - If multiple vaccines can be given at the same visit, group them together.
            - Ensure there are proper intervals between doses (e.g., at least 4 weeks between doses of OPV, Pentavalent, PCV).
            - The output must be in simple, easy-to-understand Markdown format. Use headings for visit groups (e.g., "## First Visit (As Soon As Possible)") and bullet points for vaccines.
            - Conclude with a clear and strong recommendation to consult a healthcare provider to confirm and administer the plan.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-pro',
              contents: prompt,
              config: { temperature: 0.3 }
            });
            setResult(response.text);
            setStep(3);
        } catch (err) {
            console.error("Error generating catch-up plan:", err);
            setError("Sorry, I couldn't generate a plan at this time. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Child's Information</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">First, please provide your child's date of birth.</p>
                        <label htmlFor="dob-catchup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                        <input type="date" id="dob-catchup" value={dob} onChange={e => setDob(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white" required />
                        <div className="flex justify-end pt-6">
                            <button onClick={() => setStep(2)} disabled={!dob} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400">Next</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Vaccines Received</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select all the vaccines your child has already been given. If none, just proceed.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2">
                            {NPI_SCHEDULE_VACCINES.map(vaccine => (
                                <label key={vaccine} className={`flex items-center space-x-2 p-2 rounded-md border transition-colors cursor-pointer ${checkedVaccines.includes(vaccine) ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/50 dark:border-blue-600' : 'bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600'}`}>
                                    <input type="checkbox" checked={checkedVaccines.includes(vaccine)} onChange={() => handleVaccineToggle(vaccine)} className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{vaccine}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-between pt-6">
                            <button onClick={() => setStep(1)} className="px-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Back</button>
                            <button onClick={generatePlan} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:bg-blue-400">
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <><Sparkles className="w-4 h-4 mr-2" /> Generate Plan</>
                                )}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Your Personalized Catch-Up Plan</h3>
                        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600">
                           <MarkdownRenderer text={result} />
                        </div>
                        <div className="flex justify-end pt-6">
                            <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Close</button>
                        </div>
                    </div>
                );
            default: return null;
        }
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="AI Catch-Up Plan Generator" maxWidth="max-w-2xl">
            {renderContent()}
        </Modal>
    );
};