import AxiosInstance from './AxiosInstance';

import { WorkPlanService } from './WorkPlanService'


export const AttendanceService = {
    getAttendance
};

async function getAttendance(selectedMonth, values) {
    try {
        const response = await AxiosInstance.post('/Attendance', values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.data;

        if (data.length === 0) {
            return '';
        }

        let result = [];

        for (let value of data) {
            const employeeWorkPlan = await WorkPlanService.getWorkPlan(value.employee.employeeId, values.year, values.month);

            let shifts = Array.from({length: selectedMonth.totalDays}, (_, i) => ({
                day: i + 1,
                dayOrNight: '',
                workedHours: 0
            }));

            let numberOfDayShifts = 0, numberOfHoursPerDayShift = 0;
            let numberOfNightShifts = 0, numberOfHoursPerNightShift = 0;

            value.shifts.forEach(shift => {
                shifts[shift.day - 1] = {
                    shiftInfoId: shift.shiftId,
                    day: shift.day,
                    dayOrNight: shift.dayOrNight,
                    workedHours: shift.workedHours,
                    penalty: shift.penalty,
                    penaltyComment: shift.penaltyComment,
                    send: shift.send,
                    sendComment: shift.sendComment
                }

                if (shift.dayOrNight === 'Дневная') {
                    numberOfDayShifts++;
                    numberOfHoursPerDayShift += shift.workedHours;
                }
                else {
                    numberOfNightShifts++;
                    numberOfHoursPerNightShift += shift.workedHours;
                }
            })

            result.push({
                fullName: value.employee.fullName,
                positionName: value.employee.positionName,
                dayShifts: {
                    planForNumberOfShifts: employeeWorkPlan ? employeeWorkPlan.numberOfDayShifts : '?',
                    numberOfShifts: numberOfDayShifts,
                    numberOfHours: numberOfHoursPerDayShift,
                },
                nightShits: {
                    planForNumberOfShifts: employeeWorkPlan ? employeeWorkPlan.numberOfNightShifts : '?',
                    numberOfShifts: numberOfNightShifts,
                    numberOfHours: numberOfHoursPerNightShift,
                },
                shifts: shifts
            });
        }

        return result;
    }
    catch (error) {
        if (!error?.response) {
            console.log('Сервер не отвечает.');
        } 
        else {
            console.log('Запрос был прерван:', error.message);
        }
    }
}
