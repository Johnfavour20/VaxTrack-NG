import React, { useMemo } from 'react';
import { Infant } from '../types';
import { TrendingUp, Users, CheckCircle, AlertTriangle, User } from '../components/icons';

interface AnalysisViewProps {
    infants: Infant[];
}

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{title}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div>{children}</div>
    </div>
);

const AnalysisView: React.FC<AnalysisViewProps> = ({ infants }) => {

    const analysisData = useMemo(() => {
        if (infants.length === 0) {
            return {
                totalPatients: 0,
                avgCompletion: 0,
                overduePatients: 0,
                vaccineCompliance: [],
                overdueHotspots: [],
                priorityPatients: []
            };
        }

        const totalPatients = infants.length;
        const avgCompletion = Math.round(infants.reduce((acc, i) => acc + i.completionRate, 0) / totalPatients);
        const overduePatients = infants.filter(i => i.vaccinations.some(v => v.status === 'overdue')).length;

        const vaccineNames = ['BCG', 'Pentavalent (1st dose)', 'Pentavalent (2nd dose)', 'Pentavalent (3rd dose)', 'Measles (1st dose)'];
        const vaccineCompliance = vaccineNames.map(name => {
            const totalWithVaccine = infants.filter(i => i.vaccinations.some(v => v.name === name)).length;
            const completedCount = infants.filter(i => i.vaccinations.some(v => v.name === name && v.status === 'completed')).length;
            return {
                name: name.replace(' (1st dose)', '').replace(' (2nd dose)', ' 2').replace(' (3rd dose)', ' 3'),
                value: totalWithVaccine > 0 ? Math.round((completedCount / totalWithVaccine) * 100) : 0,
            };
        });

        const overdueCounts: { [key: string]: number } = {};
        infants.forEach(infant => {
            infant.vaccinations.forEach(vax => {
                if (vax.status === 'overdue') {
                    overdueCounts[vax.name] = (overdueCounts[vax.name] || 0) + 1;
                }
            });
        });
        const overdueHotspots = Object.entries(overdueCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));
        
        const priorityPatients = infants.map(infant => ({
                ...infant,
                overdueCount: infant.vaccinations.filter(v => v.status === 'overdue').length
            }))
            .filter(i => i.overdueCount > 0)
            .sort((a, b) => b.overdueCount - a.overdueCount)
            .slice(0, 5);

        return { totalPatients, avgCompletion, overduePatients, vaccineCompliance, overdueHotspots, priorityPatients };
    }, [infants]);

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Advanced Analytics</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Actionable insights from your patient data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={Users} title="Total Patients" value={analysisData.totalPatients} color="bg-blue-100 dark:bg-blue-900/50 text-blue-600" />
                <StatCard icon={CheckCircle} title="Avg. Completion Rate" value={`${analysisData.avgCompletion}%`} color="bg-green-100 dark:bg-green-900/50 text-green-600" />
                <StatCard icon={AlertTriangle} title="Patients with Overdue" value={analysisData.overduePatients} color="bg-red-100 dark:bg-red-900/50 text-red-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ChartCard title="Vaccine Compliance Funnel">
                    <div className="space-y-3">
                        {analysisData.vaccineCompliance.map((item, index) => (
                            <div key={item.name}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-white">{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div className={`${colors[index % colors.length]} h-2.5 rounded-full`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </ChartCard>

                 <ChartCard title="Overdue Hotspots">
                     <div className="space-y-3">
                        {analysisData.overdueHotspots.map((item, index) => (
                            <div key={item.name} className="flex items-center">
                                <span className="w-48 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                                <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-5 mr-2">
                                    <div
                                        className={`${colors[index % colors.length]} h-5 rounded-full text-white text-xs flex items-center justify-end pr-2`}
                                        style={{ width: `${(item.value / Math.max(...analysisData.overdueHotspots.map(i => i.value))) * 100}%` }}
                                    >
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {analysisData.overdueHotspots.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No overdue vaccinations found!</p>}
                    </div>
                 </ChartCard>
            </div>
            
            <ChartCard title="Priority Patients (Most Overdue)">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-4 py-3">Patient Name</th>
                                <th className="px-4 py-3">Parent</th>
                                <th className="px-4 py-3 text-center">Overdue Count</th>
                                <th className="px-4 py-3 text-center">Completion Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysisData.priorityPatients.map(p => (
                                <tr key={p.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-sm text-white mr-3 flex-shrink-0">{p.avatar}</div>
                                        {p.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.parentName}</td>
                                    <td className="px-4 py-3 font-bold text-red-500 text-center">{p.overdueCount}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-center">{p.completionRate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {analysisData.priorityPatients.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-8">No patients with overdue vaccinations.</p>}
                </div>
            </ChartCard>

        </div>
    );
};

export default AnalysisView;