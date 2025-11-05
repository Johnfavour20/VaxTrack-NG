import { Vaccination, VaccinationStatus } from './types';

// Helper to add weeks to a date
const addWeeks = (date: Date, weeks: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + weeks * 7);
  return newDate;
};

// Helper to add months to a date
const addMonths = (date: Date, months: number): Date => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
};

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

interface ScheduleRule {
    name: string;
    addWeeks?: number;
    addMonths?: number;
}

const NPI_SCHEDULE_RULES: ScheduleRule[] = [
    { name: 'BCG', addWeeks: 0 },
    { name: 'Hepatitis B (1st dose)', addWeeks: 0 },
    { name: 'OPV (1st dose)', addWeeks: 6 },
    { name: 'Pentavalent (1st dose)', addWeeks: 6 },
    { name: 'PCV (1st dose)', addWeeks: 6 },
    { name: 'OPV (2nd dose)', addWeeks: 10 },
    { name: 'Pentavalent (2nd dose)', addWeeks: 10 },
    { name: 'PCV (2nd dose)', addWeeks: 10 },
    { name: 'OPV (3rd dose)', addWeeks: 14 },
    { name: 'Pentavalent (3rd dose)', addWeeks: 14 },
    { name: 'PCV (3rd dose)', addWeeks: 14 },
    { name: 'IPV', addWeeks: 14 },
    { name: 'Measles (1st dose)', addMonths: 9 },
    { name: 'Yellow Fever', addMonths: 9 },
];

export const generateInitialSchedule = (dateOfBirth: string): Vaccination[] => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedule = NPI_SCHEDULE_RULES.map(rule => {
        let dueDate: Date;
        if (rule.addWeeks !== undefined) {
            dueDate = addWeeks(dob, rule.addWeeks);
        } else { // addMonths
            dueDate = addMonths(dob, rule.addMonths as number);
        }

        let status: VaccinationStatus = 'due';
        let completionDate: string | null = null;
        
        // At-birth vaccines are considered completed on DOB if the birth was in the past
        if (rule.addWeeks === 0 && today >= dob) {
            status = 'completed';
            completionDate = formatDate(dob);
        } else if (today > dueDate) {
            status = 'overdue';
        }

        return {
            name: rule.name,
            date: completionDate,
            status: status,
            nextDue: formatDate(dueDate),
        };
    });

    return schedule;
};


export const calculateCompletionRate = (vaccinations: Vaccination[]): number => {
    if (!vaccinations || vaccinations.length === 0) {
        return 0;
    }
    const completedCount = vaccinations.filter(v => v.status === 'completed').length;
    const rate = Math.round((completedCount / vaccinations.length) * 100);
    return rate;
};
