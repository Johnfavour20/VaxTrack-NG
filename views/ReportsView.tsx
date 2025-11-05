
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Infant } from '../types';
import { Award, Users, FileText, Clipboard } from '../components/icons';
import { Modal, MarkdownRenderer } from '../components/common';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div>{children}</div>
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    if (data.length === 0) return <p className="text-center text-gray-500 dark:text-gray-400 py-10">No data available.</p>;
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="flex justify-around items-end h-64 space-x-2">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center flex-1">
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.value}</div>
                    <div
                        className={`w-full rounded-t-md ${item.color} transition-all duration-500`}
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const DonutChart: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => (
    <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-gray-200 dark:text-slate-700" stroke="currentColor" strokeWidth="4" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className={color} stroke="currentColor" strokeWidth="4" strokeDasharray={`${percentage}, 100`} strokeLinecap="round" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-white">{percentage}%</span>
        </div>
    </div>
);

interface ReportsViewProps {
    infants: Infant[];
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({ infants, showToast }) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportContent, setReportContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const reportData = useMemo(() => {
        if (!infants || infants.length === 0) {
            return { coverageData: [], overallCoverage: 0, caregiverDistribution: [], completedSchedules: 0, totalPatients: 0 };
        }

        const keyVaccines = ['BCG', 'OPV (1st dose)', 'Pentavalent (1st dose)', 'PCV (1st dose)', 'Measles (1st dose)'];
        const vaccineCounts = Object.fromEntries(keyVaccines.map(v => [v, { completed: 0, total: 0 }]));

        infants.forEach(infant => {
            infant.vaccinations.forEach(vax => {
                if (keyVaccines.includes(vax.name)) {
                    vaccineCounts[vax.name].total++;
                    if (vax.status === 'completed') vaccineCounts[vax.name].completed++;
                }
            });
        });
        
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
        const coverageData = Object.entries(vaccineCounts).map(([name, counts], i) => ({
            label: name.replace(' (1st dose)', ''),
            value: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0,
            color: colors[i % colors.length],
        }));

        const caregiverCounts: { [key:string]: number } = {};
        infants.forEach(infant => {
            caregiverCounts[infant.parentName] = (caregiverCounts[infant.parentName] || 0) + 1;
        });
        const caregiverColors = ['bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-indigo-500'];
        const caregiverDistribution = Object.entries(caregiverCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, count], i) => ({
                label: name,
                value: count,
                color: caregiverColors[i % caregiverColors.length],
            }));
        
        return {
            coverageData,
            overallCoverage: Math.round(infants.reduce((sum, i) => sum + i.completionRate, 0) / infants.length),
            caregiverDistribution,
            completedSchedules: infants.filter(i => i.completionRate === 100).length,
            totalPatients: infants.length,
        };
    }, [infants]);
    
    const handleExportClick = async () => {
        setIsReportModalOpen(true);
        setIsGenerating(true);
        setReportContent('');
        
        const statsSummary = `
          - Total Patients: ${reportData.totalPatients}
          - Overall Vaccination Coverage: ${reportData.overallCoverage}%
          - Key Vaccine Coverage: ${reportData.coverageData.map(d => `${d.label}: ${d.value}%`).join(', ')}
          - Caregivers with most patients: ${reportData.caregiverDistribution.map(c => `${c.label} (${c.value} children)`).join(', ')}
        `;
        const prompt = `You are a health clinic data analyst. Based on the following summary statistics for a clinic using the VaxTrack NG app, generate a concise and professional summary report in Markdown format. The report should be suitable for a clinic administrator. Start with a title "Monthly Vaccination Summary". Include sections for "Key Metrics", "Vaccine Coverage Analysis", and "Caregiver Demographics". End with a brief "Conclusion and Recommendations" section suggesting areas for improvement (e.g., focus on measles coverage if it's low). Here is the data:\n\n${statsSummary}`;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setReportContent(response.text);
        } catch (error) {
            console.error("Failed to generate report:", error);
            setReportContent("Error: Could not generate the report. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(reportContent);
        showToast('Report copied to clipboard!', 'success');
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Key insights into your patient vaccination data.</p>
                    </div>
                    <button onClick={handleExportClick} className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate & Export Report
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ChartCard title="Vaccination Coverage by Type">
                            <BarChart data={reportData.coverageData} />
                        </ChartCard>
                    </div>
                    <div className="space-y-6">
                        <ChartCard title="Overall Coverage">
                            <DonutChart percentage={reportData.overallCoverage} color="text-green-500" />
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Target: 90%</p>
                        </ChartCard>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Patients per Caregiver">
                        <BarChart data={reportData.caregiverDistribution} />
                    </ChartCard>
                    <ChartCard title="Activity Snapshot">
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-4"><Users className="w-6 h-6"/></div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.totalPatients}</p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mr-4"><Award className="w-6 h-6"/></div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportData.completedSchedules}</p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Schedules Completed</p>
                                </div>
                            </div>
                        </div>
                    </ChartCard>
                </div>
            </div>
            <Modal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Generated Clinic Report" maxWidth="max-w-3xl">
                {isGenerating && (
                    <div className="min-h-[300px] flex items-center justify-center">
                         <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            <span className="font-medium">Generating report with VaxTrack AI...</span>
                         </div>
                    </div>
                )}
                {!isGenerating && reportContent && (
                    <div>
                        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border dark:border-slate-600 max-h-[50vh] overflow-y-auto">
                           <MarkdownRenderer text={reportContent} />
                        </div>
                        <div className="flex justify-end pt-4 space-x-2">
                             <button onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">Close</button>
                             <button onClick={handleCopyToClipboard} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                                <Clipboard className="w-4 h-4 mr-2" /> Copy to Clipboard
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ReportsView;