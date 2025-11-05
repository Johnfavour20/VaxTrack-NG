import React from 'react';
import { Infant, Vaccination, VaccinationStatus, User } from '../types';
import { Plus, ArrowLeft, CheckCircle, Clock, AlertTriangle, Baby } from '../components/icons';

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

// ChildCard for the list view
const ChildListCard: React.FC<{ child: Infant, onSelect: () => void }> = ({ child, onSelect }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-4 md:p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white">
                    {child.avatar}
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{child.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{calculateAge(child.dateOfBirth)}</p>
                </div>
            </div>
            <div className="text-right">
                 <p className="font-semibold text-gray-800 dark:text-white">{child.completionRate}%</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Complete</p>
            </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${child.completionRate}%` }}></div>
        </div>
    </div>
);


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


const ChildDetailView: React.FC<{ child: Infant, onBack: () => void }> = ({ child, onBack }) => (
    <div>
        <button onClick={onBack} className="flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Children</span>
        </button>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700">
            <div className="p-6 border-b dark:border-slate-700">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl text-white flex-shrink-0">
                        {child.avatar}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{child.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{child.gender}, {calculateAge(child.dateOfBirth)}</p>
                    </div>
                </div>
                 <div className="mt-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vaccination Progress</span>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{child.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${child.completionRate}%` }}></div>
                    </div>
                </div>
            </div>
            <div>
                {child.vaccinations.length > 0 ? (
                    child.vaccinations.map((vax, index) => <VaccinationRow key={index} vax={vax} />)
                ) : (
                    <p className="p-6 text-center text-gray-500 dark:text-gray-400">No vaccination records available for this child.</p>
                )}
            </div>
        </div>
    </div>
);

interface MyChildrenViewProps {
    infants: Infant[];
    user: User;
    onAddChildClick: () => void;
    selectedInfantId: number | null;
    setSelectedInfantId: (id: number | null) => void;
}

const MyChildrenView: React.FC<MyChildrenViewProps> = ({ infants, user, onAddChildClick, selectedInfantId, setSelectedInfantId }) => {
    const selectedInfant = infants.find(infant => infant.id === selectedInfantId);
    const caregiverInfants = infants.filter(i => i.parentName === user.name);

    if (selectedInfant) {
        return <ChildDetailView child={selectedInfant} onBack={() => setSelectedInfantId(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Children</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your children's vaccination schedules.</p>
                </div>
                <button onClick={onAddChildClick} className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Child
                </button>
            </div>
            {caregiverInfants.length > 0 ? (
                 <div className="space-y-4">
                    {caregiverInfants.map(infant => (
                        <ChildListCard key={infant.id} child={infant} onSelect={() => setSelectedInfantId(infant.id)} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-300 rounded-full mx-auto flex items-center justify-center">
                        <Baby className="w-8 h-8" />
                    </div>
                    <h4 className="mt-4 text-lg font-semibold text-gray-800 dark:text-white">No Children Added Yet</h4>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by adding your child's information.</p>
                     <button onClick={onAddChildClick} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center mx-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Child
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyChildrenView;