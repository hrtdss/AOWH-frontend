import { useState } from 'react';
import Select from 'react-select';

import { AttendanceService } from '../services/AttendanceService';
import { SELECT_STYLE } from '../services/Constants';


function getNumberOfDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

const AttendancePage = () => {
    const [savedRows, ] = useState(JSON?.parse(localStorage.getItem('savedAttendance')) ?? '');

    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks')));
    const [selectedStock, setSelectedStock] = useState(savedRows?.stock ?? stocks[0]);

    const [savedMonthAndYear, ] = useState(savedRows?.date ?? '');
    const [selectedMonthAndYear, setSelectedMonthAndYear] = useState((savedMonthAndYear && `${savedMonthAndYear[0]}-${savedMonthAndYear[1].toString().padStart(2, '0')}`) || `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`);

    const [daysInMonth, setDaysInMonth] = useState(savedRows?.daysInMonth ?? '');

    const [columnsWithDaysOfMonth, setColumnsWithDaysOfMonth] = useState((daysInMonth && Array.from({length: daysInMonth.totalDays}, (_, i) => i + 1)) || []);

    const [fullMonthDataFlag, setFullMonthDataFlag] = useState((daysInMonth && daysInMonth.daysFromBeginningOfMonth === daysInMonth.totalDays) ? true : false);
    const [isMonthDataFlagDisabled, setIsMonthDataFlagDisabled] = useState((daysInMonth && daysInMonth.daysFromBeginningOfMonth === daysInMonth.totalDays) ? true : false);

    const [rows, setRows] = useState(savedRows === '' ? [] : savedRows?.data.length > 0 ? savedRows.data : '');

    async function getTableOfAttendance() {
        // if (!selectedMonthAndYear) {
        //     alert('Ошибка. Для получение информации необходимо указать месяц и год.')
        //     return;
        // }

        const currDate = new Date();
        const selectedDate = new Date(selectedMonthAndYear);

        const values = {
            stockId: selectedStock.value,
            month: 1 + selectedDate.getMonth(),
            year: selectedDate.getFullYear()
        }

        const totalDays = getNumberOfDaysInMonth(values.month, values.year);
        const selectedMonth = {
            daysFromBeginningOfMonth: currDate.getMonth() === selectedDate.getMonth() ? currDate.getDate() : totalDays,
            totalDays
        }

        setDaysInMonth(selectedMonth); 
        setColumnsWithDaysOfMonth(Array.from({length: selectedMonth.totalDays}, (_, i) => i + 1));
        
        const data = await AttendanceService.getAttendance(selectedMonth, values);

        if (data.length > 0) {
            setRows(data);

            if (currDate.getMonth() === selectedDate.getMonth() && currDate.getFullYear() === selectedDate.getFullYear()) {
                setFullMonthDataFlag(false);
                setIsMonthDataFlagDisabled(false);
            }
            else {
                setFullMonthDataFlag(true);
                setIsMonthDataFlagDisabled(true);
            }
        }
        else {
            setRows('');
        }
    }

    return (
        <div className='flex flex-col items-center h-full mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex items-center justify-between w-full max-w-[1300px] mb-4'>  
                <div className='inline-flex'>           
                    {stocks &&
                    <div className='w-[290px] py-1 px-2'>
                        <Select defaultValue={selectedStock} styles={SELECT_STYLE} options={stocks} onChange={setSelectedStock}/>
                    </div>}
                    
                    <div className='py-1 px-2'>
                        <input type='month' name='monthAndYear' className='py-1 px-3 border shadow-sm rounded' value={selectedMonthAndYear} onChange={e => setSelectedMonthAndYear(e.target.value)}/>
                    </div>

                    <div className='flex items-center mx-2'>
                        <input type='checkbox' name='fullMonth' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' checked={fullMonthDataFlag} onChange={() => setFullMonthDataFlag(!fullMonthDataFlag)} disabled={isMonthDataFlagDisabled}/>
                        <label className='ml-2 whitespace-nowrap'>За полный месяц</label>
                    </div>
                </div>  

                <div className='py-1 px-2'>
                    <button className='px-3 py-[6px] font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={() => getTableOfAttendance()}>
                        Загрузить
                    </button>
                </div>
            </div>

            {rows === '' ?
            <div className='mt-10 font-bold'>
                Информация за указанный месяц и год отсутствует
            </div> : 
            rows.length > 0 &&
            <table className='block max-w-[99%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap select-none'>
                <thead className='text-xs bg-slate-300'>
                    <tr>
                        <th rowSpan={2} className='px-2 py-1 text-left border-b-2'>
                            ФИО
                        </th>
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Должность
                        </th>
                        {/* <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Кол-во <br/> дневн. <br/> смен
                        </th>
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Часов в <br/> дневн. <br/> смен
                        </th>
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Кол-во <br/> ночн. <br/> смен
                        </th>
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Часов в <br/> ночн. <br/> смен
                        </th> */}
                        {
                            columnsWithDaysOfMonth.map((data, index) => (
                                (index + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                                <th key={`header-${index + 1}`} colSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                                    {data}
                                </th>
                            ))
                        }
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Смен <br/> ДЕНЬ
                        </th>
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Часов <br/> ДЕНЬ
                        </th>
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Смен <br/> НОЧЬ
                        </th>
                        <th rowSpan={2} className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Часов <br/> НОЧЬ
                        </th>
                    </tr>
                    <tr>
                        {
                            columnsWithDaysOfMonth.map((_, index) => (
                                (index + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                                <>
                                    <th key={`headerDay-${index + 1}`} className='px-1 py-1 text-center border-b-2 border-l-2'>
                                        Д
                                    </th>
                                    <th key={`headerNight-${index + 1}`} className='px-1 py-1 text-center border-b-2 border-l-2'>
                                        Н
                                    </th>
                                </>
                            ))
                        }
                    </tr>
                </thead>

                <tbody className='text-xs bg-slate-100'>
                    {
                        rows
                        ?.map((data, index) => (
                            (index + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                            <tr key={`row-${index}`} className='hover:bg-slate-200'>
                                <td className='px-2 py-[6px] border-b-2'>
                                    {data.employee.fullName}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.positionName}
                                </td>
                                {/* <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.planForNumberOfDayShifts}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.planForNumberOfHoursPerDayShift}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.planForNumberOfNightShifts}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.planForNumberOfHoursPerNightShift}
                                </td> */}
                                {
                                    data.shifts.map((shiftData, shiftIndex) => (
                                        (shiftIndex + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                                        <>
                                            <td key={`day-${shiftIndex + 1}`} className='px-2 py-[6px] text-center border-b-2 border-l-2'> 
                                                {(shiftIndex + 1 === shiftData.day && shiftData.dayOrNight === 'Дневная') ? shiftData.workedHours : '-'}
                                            </td>
                                            <td key={`night-${shiftIndex + 1}`} className='px-2 py-[6px] text-center bg-slate-200 border-b-2 border-l-2'>
                                                {(shiftIndex + 1 === shiftData.day && shiftData.dayOrNight === 'Ночная') ? shiftData.workedHours : '-'}
                                            </td>
                                        </>
                                    ))
                                }
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.countOfDayShifts}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.countOfDayHours}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.countOfNightShifts}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.employee.countOfNightHours}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>}
        </div>
    )
}

export default AttendancePage