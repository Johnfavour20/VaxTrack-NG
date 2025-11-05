import React from 'react';
import { Infant, Vaccination, User } from '../types';
import { Clock, AlertTriangle, Baby } from '../components/icons';

// Helper to get all upcoming vaccinations
const getUpcomingVaccinations = (infants: Infant[]): (Vaccination & { childName: string, childId: number })[] => {
  const upcoming: (Vaccination & { childName: string, childId: number })[] = [];
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  infants.forEach(infant => {
    infant.vaccinations.forEach(vax => {
      if (vax.status === 'due' && vax.nextDue) {
        const dueDate = new Date(vax.nextDue);
        if (dueDate >= today && dueDate <= nextMonth) {
          upcoming.push({ ...vax, childName: infant.name, childId: infant.id });
        }
      }
    });
  });

  return upcoming.sort((a, b) => new Date(a.nextDue!).getTime() - new Date(b.nextDue!).getTime());
};

// Helper to get all overdue vaccinations
const getOverdueVaccinations = (infants: Infant[]): (Vaccination & { childName: string, childId: number })[] => {
    return infants.flatMap(infant => 
        infant.vaccinations
            .filter(v => v.status === 'overdue')
            .map(v => ({ ...v, childName: infant.name, childId: infant.id }))
    );
};


const QuickChildSummaryCard: React.FC<{ child: Infant; onSelect: () => void }> = ({ child, onSelect }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
        <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xl text-white">
                {child.avatar}
            </div>
            <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{child.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{child.completionRate}% complete</p>
            </div>
        </div>
        <div className="w-12 h-12 relative">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200 dark:text-slate-600" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-green-500" stroke="currentColor" strokeWidth="3" strokeDasharray={`${child.completionRate}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
             <div className="absolute inset-0 flex items-center justify-center"><span className="text-xs font-bold text-gray-700 dark:text-gray-300">{child.completionRate}%</span></div>
        </div>
    </div>
);


const UpcomingVaxCard: React.FC<{ vax: Vaccination & { childName: string } }> = ({ vax }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800/50">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300">
            <Clock className="w-5 h-5" />
        </div>
        <div>
            <p className="font-medium text-yellow-900 dark:text-yellow-100">{vax.name}</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-200">For <span className="font-semibold">{vax.childName}</span> - Due on {vax.nextDue}</p>
        </div>
    </div>
);

const OverdueVaxCard: React.FC<{ vax: Vaccination & { childName: string } }> = ({ vax }) => (
     <div className="flex items-start space-x-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800/50">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300">
            <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
            <p className="font-medium text-red-900 dark:text-red-100">{vax.name}</p>
            <p className="text-sm text-red-700 dark:text-red-200">For <span className="font-semibold">{vax.childName}</span> - Overdue since {vax.nextDue}</p>
        </div>
    </div>
);

interface ParentDashboardViewProps {
    infants: Infant[];
    user: User;
    onViewChildren: () => void;
    onSelectChild: (infantId: number) => void;
}

const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({ infants, user, onViewChildren, onSelectChild }) => {
    const parentInfants = infants.filter(i => i.parentName === user.name);

    const upcoming = getUpcomingVaccinations(parentInfants).slice(0, 3);
    const overdue = getOverdueVaccinations(parentInfants);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {overdue.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center"><AlertTriangle className="mr-2"/> Overdue Vaccinations</h3>
                            <div className="space-y-3">
                                {overdue.map((vax, i) => <OverdueVaxCard key={`overdue-${i}`} vax={vax} />)}
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center"><Clock className="mr-2"/> Due Soon (Next 30 Days)</h3>
                        <div className="space-y-3">
                            {upcoming.length > 0 ? (
                                upcoming.map((vax, i) => <UpcomingVaxCard key={`upcoming-${i}`} vax={vax} />)
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">No vaccinations due in the next 30 days. All caught up!</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center"><Baby className="mr-2"/> My Children</h3>
                        <div className="space-y-3">
                            {parentInfants.map(infant => (
                                <QuickChildSummaryCard key={infant.id} child={infant} onSelect={() => onSelectChild(infant.id)} />
                            ))}
                             <button onClick={onViewChildren} className="w-full text-center px-4 py-2 mt-2 border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:border-blue-500 hover:text-blue-600 transition-colors text-sm font-medium">
                                Manage All Children
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboardView;