
import React, { useState } from 'react';
import { Infant, Vaccination, VaccinationStatus } from '../types';
import { Users, Activity, Bell, Award, UserPlus, Download, Search, Eye, Edit, ArrowLeft, CheckCircle, Clock, AlertTriangle } from '../components/icons';

// --- Helper Functions & Detail Components ---

const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12;
    ageInMonths -= birth.getMonth();
    ageInMonths += today.getMonth();
    if (ageInMonths <= 0) return "Less than a month old";
    
    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths > 1 ? 's' : ''} old`;
    }
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''} old`;
};

const VaccinationRow: React.FC<{ vax: Vaccination }> = ({ vax }) => {
    const statusInfo: { [key in VaccinationStatus]: { icon: React.ElementType, color: string, text: string } } = {
        completed: { icon: CheckCircle, color: 'text-green-500', text: 'Completed' },
        due: { icon: Clock, color: 'text-yellow-500', text: 'Due' },
        overdue: { icon: AlertTriangle, color: 'text-red-500', text: 'Overdue' }
    };
    const { icon: Icon, color, text } = statusInfo[vax.status];
    return (
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700 last:border-b-0">
            <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{vax.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {vax.status === 'completed' ? `Administered on ${vax.date}` : `Due on ${vax.nextDue}`}
                </p>
            </div>
            <div className={`flex items-center space-x-2 text-sm font-semibold ${color}`}>
                <Icon className="w-5 h-5" />
                <span>{text}</span>
            </div>
        </div>
    );
};

const PatientDetailView: React.FC<{ patient: Infant, onBack: () => void }> = ({ patient, onBack }) => (
    <div>
        <button onClick={onBack} className="flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Patient List</span>
        </button>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700">
            <div className="p-6 border-b dark:border-slate-700">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl text-white flex-shrink-0">
                        {patient.avatar}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{patient.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{patient.gender}, {calculateAge(patient.dateOfBirth)}</p>
                    </div>
                </div>
                 <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vaccination Progress</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{patient.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${patient.completionRate}%` }}></div>
                    </div>
                </div>
            </div>
            <div>
                {patient.vaccinations.length > 0 ? (
                    patient.vaccinations.map((vax, index) => <VaccinationRow key={index} vax={vax} />)
                ) : (
                    <p className="p-6 text-center text-gray-500 dark:text-gray-400">No vaccination records available for this patient.</p>
                )}
            </div>
        </div>
    </div>
);


// --- Main View Components ---

// StatCard Component
const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string, trend: string }> = ({ icon: Icon, title, value, color, trend }) => {
    const colorClasses: { [key: string]: string } = {
        blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/50', green: 'text-green-600 bg-green-100 dark:bg-green-900/50',
        yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50', red: 'text-red-600 bg-red-100 dark:bg-red-900/50'
    };
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
            <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                <p className="text-xs text-green-600 dark:text-green-400">{trend}</p>
            </div>
        </div>
    );
};

// PatientsView Component (completed)
const PatientsView: React.FC<{ infants: Infant[], onAddPatientClick: () => void, onViewPatient: (patient: Infant) => void }> = ({ infants, onAddPatientClick, onViewPatient }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const getPatientStatus = (infant: Infant) => {
        if (infant.vaccinations.some(v => v.status === 'overdue')) return { text: 'Overdue', color: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' };
        if (infant.vaccinations.some(v => v.status === 'due')) return { text: 'Due Soon', color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' };
        if (infant.completionRate === 100) return { text: 'Completed', color: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' };
        return { text: 'On Track', color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' };
    };

    const filteredPatients = infants.filter(infant => {
        const matchesSearch = infant.name.toLowerCase().includes(searchTerm.toLowerCase()) || infant.parentName.toLowerCase().includes(searchTerm.toLowerCase());
        const status = getPatientStatus(infant).text.toLowerCase().replace(' ', '');
        const matchesFilter = filter === 'all' || (filter === 'due' && status === 'duesoon') || status.includes(filter);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 mt-6">
            <div className="p-4 md:p-6 border-b dark:border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Patient List</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track all patient records.</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative w-full sm:w-auto"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search className="w-5 h-5 text-gray-400" /></div><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm dark:bg-slate-700" /></div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"><option value="all">All Status</option><option value="completed">Completed</option><option value="due">Due</option><option value="overdue">Overdue</option></select>
                    <button onClick={onAddPatientClick} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"><UserPlus className="w-5 h-5 mr-2" />Add Patient</button>
                </div>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-slate-700"><tr className="border-b dark:border-slate-600"><th scope="col" className="px-6 py-3">Patient Name</th><th scope="col" className="px-6 py-3">Parent</th><th scope="col" className="px-6 py-3">Age</th><th scope="col" className="px-6 py-3">Progress</th><th scope="col" className="px-6 py-3">Status</th><th scope="col" className="px-6 py-3">Actions</th></tr></thead>
                <tbody>
                    {filteredPatients.map(p => (
                        <tr key={p.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center"><div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg text-white mr-3">{p.avatar}</div><div><div>{p.name}</div><div className="text-xs text-gray-400">{p.gender}</div></div></td>
                            <td className="px-6 py-4"><div>{p.parentName}</div><div className="text-xs text-gray-400">{p.phoneNumber}</div></td>
                            <td className="px-6 py-4">{calculateAge(p.dateOfBirth)}</td>
                            <td className="px-6 py-4"><div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${p.completionRate}%` }}></div></div></td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getPatientStatus(p).color}`}>{getPatientStatus(p).text}</span></td>
                            <td className="px-6 py-4 flex items-center space-x-1"><button onClick={() => onViewPatient(p)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400"><Eye size={16} /></button><button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-green-600 dark:hover:text-green-400"><Edit size={16} /></button></td>
                        </tr>
                    ))}
                     {filteredPatients.length === 0 && (<tr><td colSpan={6} className="text-center py-10 text-gray-500 dark:text-gray-400">No patients found.</td></tr>)}
                </tbody>
            </table></div>
        </div>
    );
};

// PractitionerDashboardView Component
interface PractitionerDashboardViewProps {
    infants: Infant[];
    notifications: any[];
    onAddPatientClick: () => void;
    showStats: boolean;
}

const PractitionerDashboardView: React.FC<PractitionerDashboardViewProps> = ({ infants, notifications, onAddPatientClick, showStats }) => {
    const [selectedPatient, setSelectedPatient] = useState<Infant | null>(null);

    if (selectedPatient) {
        return <PatientDetailView patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
    }

    return (
        <div className="space-y-6">
            {showStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Users} title="Total Patients" value={infants.length.toString()} color="blue" trend="+5 this month" />
                    <StatCard icon={Activity} title="Vaccinations Today" value="32" color="green" trend="+12% from yesterday" />
                    <StatCard icon={Bell} title="Urgent Alerts" value={notifications.filter(n => n.urgent).length.toString()} color="red" trend="Action required" />
                    <StatCard icon={Award} title="Coverage Rate" value="92%" color="yellow" trend="Goal met for Q2" />
                </div>
            )}
            <PatientsView infants={infants} onAddPatientClick={onAddPatientClick} onViewPatient={setSelectedPatient} />
        </div>
    );
};

export default PractitionerDashboardView;