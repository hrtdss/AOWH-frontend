import AxiosInstance from './AxiosInstance';


export const AttendanceService = {
    getAttendance
};

const allStocks = JSON?.parse(sessionStorage.getItem('allStocks'));

async function getAttendance(selectedMonth, values) {
    try {
        const response = await AxiosInstance.post('/Attendance', values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.data;

        for (let value of data) {
            let shifts = Array.from({length: selectedMonth.totalDays}, (_, i) => ({
                day: i + 1,
                dayOrNight: '',
                workedHours: 0
            }));

            value.shifts.forEach(shift => {
                shifts[shift.day - 1] = {...shift};
            })

            value.shifts = shifts;
        }

        const index = allStocks.findIndex(data => data.value === values.stockId);

        const attendance = {
            stock: allStocks[index],
            date: [values.year, values.month],
            data: data,
            daysInMonth: selectedMonth
        };

        localStorage.setItem('savedAttendance', JSON.stringify(attendance));

        return data;
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
