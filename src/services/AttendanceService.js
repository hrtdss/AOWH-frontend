import AxiosInstance from './AxiosInstance';


export const AttendanceService = {
    getAttendance
};

async function getAttendance(selectedMonth, values) {
    try {
        const response = await AxiosInstance.post('/Attendance', values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        // const data = await response.data;
        let data;
        if (values.month === 8) {
            data = [{"employee": {"fullName": "Лобанов Марк Артемьевич", "positionName": "Кладовщик"}, "shifts": [{"day": 19, "dayOrNight": "Дневная", "workedHours": 9}, {"day": 25, "dayOrNight": "Дневная", "workedHours": 6}]}, {"employee": {"fullName": "Глебов Олег Егорович", "positionName": "Грузчик"}, "shifts": [{"day": 14, "dayOrNight": "Дневная", "workedHours": 7}]}, {"employee": {"fullName": "Кравцов Владислав Демидович", "positionName": "Грузчик"}, "shifts": [{"day": 1, "dayOrNight": "Дневная", "workedHours": 7}, {"day": 2, "dayOrNight": "Ночная", "workedHours": 9}, {"day": 4, "dayOrNight": "Дневная", "workedHours": 7}, {"day": 5, "dayOrNight": "Дневная", "workedHours": 5}, {"day": 7, "dayOrNight": "Дневная", "workedHours": 5}, {"day": 8, "dayOrNight": "Ночная", "workedHours": 10}, {"day": 14, "dayOrNight": "Дневная", "workedHours": 7}, {"day": 15, "dayOrNight": "Ночная", "workedHours": 7}, {"day": 16, "dayOrNight": "Ночная", "workedHours": 0}, {"day": 17, "dayOrNight": "Дневная", "workedHours": 9}, {"day": 23, "dayOrNight": "Ночная", "workedHours": 7}, {"day": 19, "dayOrNight": "Ночная", "workedHours": 9}, {"day": 20, "dayOrNight": "Дневная", "workedHours": 8}, {"day": 23, "dayOrNight": "Ночная", "workedHours": 7}, {"day": 24, "dayOrNight": "Ночная", "workedHours": 9}]}];
        }
        else {
            data = [{"employee": {"fullName": "Лобанов Марк Артемьевич", "positionName": "Кладовщик"}, "shifts": [{"day": 19, "dayOrNight": "Дневная", "workedHours": 9}, {"day": 25, "dayOrNight": "Дневная", "workedHours": 6}]}, {"employee": {"fullName": "Глебов Олег Егорович", "positionName": "Грузчик"}, "shifts": [{"day": 14, "dayOrNight": "Дневная", "workedHours": 7}, {"day": 29, "dayOrNight": "Ночная", "workedHours": 6}]}, {"employee": {"fullName": "Долгов Дамир Витальевич", "positionName": "Грузчик"}, "shifts": []}, {"employee": {"fullName": "Кравцов Владислав Демидович", "positionName": "Грузчик"}, "shifts": [{"day": 1, "dayOrNight": "Дневная", "workedHours": 7}, {"day": 2, "dayOrNight": "Ночная", "workedHours": 9}, {"day": 4, "dayOrNight": "Дневная", "workedHours": 7}, {"day": 5, "dayOrNight": "Дневная", "workedHours": 5}, {"day": 14, "dayOrNight": "Дневная", "workedHours": 7}, {"day": 15, "dayOrNight": "Ночная", "workedHours": 7}, {"day": 16, "dayOrNight": "Ночная", "workedHours": 0}, {"day": 17, "dayOrNight": "Дневная", "workedHours": 9}, {"day": 20, "dayOrNight": "Дневная", "workedHours": 8}, {"day": 23, "dayOrNight": "Ночная", "workedHours": 7}, {"day": 24, "dayOrNight": "Ночная", "workedHours": 9}, {"day": 29, "dayOrNight": "Ночная", "workedHours": 6}]}];
        }

        if (data.length === 0) {
            return '';
        }

        let result = [];

        for (let value of data) {
            let shifts = Array.from({length: selectedMonth.totalDays}, (_, i) => ({
                day: i + 1,
                dayOrNight: '',
                workedHours: 0
            }));

            let numberOfDayShifts = 0, numberOfHoursPerDayShift = 0;
            let numberOfNightShifts = 0, numberOfHoursPerNightShift = 0;

            value.shifts.forEach(shift => {
                shifts[shift.day - 1] = {
                    day: shift.day,
                    dayOrNight: shift.dayOrNight,
                    workedHours: shift.workedHours
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
                    numberOfShifts: numberOfDayShifts,
                    numberOfHours: numberOfHoursPerDayShift,
                },
                nightShits: {
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
