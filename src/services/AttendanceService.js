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

        const attendanceData = await response.data;

        for (let value of attendanceData) {
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

        const allStocks = JSON?.parse(localStorage.getItem('allStocks'));
        const index = allStocks.findIndex(stock => stock.value === values.stockId);

        const attendance = {
            stock: allStocks[index],
            date: [values.year, values.month],
            data: attendanceData,
            daysInMonth: selectedMonth
        };

        localStorage.setItem('savedAttendance', JSON.stringify(attendance));

        return attendanceData;
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
