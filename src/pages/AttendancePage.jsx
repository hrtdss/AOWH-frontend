import { useState } from 'react';
import Select from 'react-select';

import { AttendanceService } from '../services/AttendanceService';
import { SELECT_STYLE } from '../services/Constants';


function getNumberOfDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

const AttendancePage = () => {
    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks'))); 
    const [selectedStock, setSelectedStock] = useState(stocks[0]);

    const [selectedMonthAndYear, setSelectedMonthAndYear] = useState('');

    const [fullMonthDataFlag, setFullMonthDataFlag] = useState(false);
    const [isMonthDataFlagDisabled, setIsMonthDataFlagDisabled] = useState(false);

    const [daysInMonth, setDaysInMonth] = useState('');

    const [columnsWithDaysOfMonth, setColumnsWithDaysOfMonth] = useState([]);

    // const [dateRestriction, setDateRestriction] = useState('');
    const [rows, setRows] = useState([]);

    async function getTableOfAttendance() {
        if (!selectedMonthAndYear) {
            alert('Ошибка. Для получение информации необходимо указать месяц и год.')
            return;
        }

        const currDate = new Date();
        const selectedDate = new Date(selectedMonthAndYear);

        const values = {
            stockId: selectedStock.value,
            month: 1 + selectedDate.getMonth(),
            year: selectedDate.getFullYear()
        }

        const selectedMonth = {
            daysFromBeginningOfMonth: currDate.getDate(),
            totalDays: getNumberOfDaysInMonth(values.month, values.year)
        }

        setDaysInMonth(selectedMonth); 
        setColumnsWithDaysOfMonth(Array.from({length: selectedMonth.totalDays}, (_, i) => i + 1));
        
        let data = await AttendanceService.getAttendance(selectedMonth, values);

        if (data) {
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
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex items-center justify-between w-full mb-4'>  
                <div className='inline-flex'>           
                    {stocks &&
                    <div className='w-[290px] py-1 px-2'>
                        <Select defaultValue={selectedStock} styles={SELECT_STYLE} options={stocks} onChange={setSelectedStock}/>
                    </div>}
                    
                    <div className='py-1 px-2'>
                        <input type='month' name='monthAndYear' className='py-1 px-3 border shadow-sm rounded' onChange={e => setSelectedMonthAndYear(e.target.value)}/>
                    </div>

                    <div className='flex items-center mx-2'>
                        <input type='checkbox' name='fullMonth' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' checked={fullMonthDataFlag} onChange={() => setFullMonthDataFlag(!fullMonthDataFlag)} disabled={isMonthDataFlagDisabled}/>
                        <label className='ml-2 whitespace-nowrap'>За полный месяц</label>
                    </div>
                </div>  

                <div className='py-1 px-2'>
                    <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={() => getTableOfAttendance()}>
                        Загрузить
                    </button>
                </div>
            </div>

            {rows === '' ?
            <div className='mt-10 font-bold'>
                Информация за указанный месяц и год отсутствует
            </div> : 
            rows.length > 0 &&
            <table className='block max-w-[95%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                <thead className='bg-slate-300'>
                    <tr className='text-base/5 text-left'>
                        <th rowSpan={2} className='px-4 py-1 border-b-2'>
                            ФИО
                        </th>
                        <th rowSpan={2} className='px-4 py-1 border-b-2 border-l-2'>
                            Должность
                        </th>
                        <th rowSpan={2} className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Дневных <br/> смен
                        </th>
                        <th rowSpan={2} className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Кол-во <br/> часов в <br/> дневную <br/> смену
                        </th>
                        <th rowSpan={2} className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Ночных <br/> смен
                        </th>
                        <th rowSpan={2} className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Кол-во <br/> часов в <br/> ночную <br/> смену
                        </th>
                        {
                            columnsWithDaysOfMonth.map((data, index) => (
                                (index + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                                <th key={index} colSpan={2} className='px-4 py-1 text-center border-b-2 border-l-2'>
                                    {data}
                                </th>
                            ))
                        }
                    </tr>
                    <tr className='text-base/5 text-left'>
                        {
                            columnsWithDaysOfMonth.map((_, index) => (
                                (index + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                                <>
                                    <th key={index} className='px-4 py-1 text-center border-b-2 border-l-2'>
                                        Д
                                    </th>
                                    <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                                        Н
                                    </th>
                                </>
                            ))
                        }
                    </tr>
                </thead>

                <tbody className='bg-slate-100'>
                    {
                        rows
                        ?.map((data, index) => (
                            (index + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                            <tr key={index} className='hover:bg-slate-200'>
                                <td className='px-4 py-[6px] border-b-2'>
                                    {data.fullName}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.positionName}
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {/* {data.dayShifts.numberOfShifts} */}
                                    {`${data.dayShifts.numberOfShifts} / ${data.dayShifts.planForNumberOfShifts}`} 
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.dayShifts.numberOfHours}
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {/* {data.nightShits.numberOfShifts} */}
                                    {`${data.nightShits.numberOfShifts} / ${data.nightShits.planForNumberOfShifts}`}
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.nightShits.numberOfHours}
                                </td>
                                {
                                    data.shifts.map((shiftData, shiftIndex) => (
                                        (shiftIndex + 1 <= ((fullMonthDataFlag && daysInMonth.totalDays) || (!fullMonthDataFlag && daysInMonth.daysFromBeginningOfMonth))) &&
                                        <>
                                            <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                                {(shiftIndex + 1 === shiftData.day && shiftData.dayOrNight === 'Дневная') ? shiftData.workedHours : '-'}
                                            </td>
                                            <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                                {(shiftIndex + 1 === shiftData.day && shiftData.dayOrNight === 'Ночная') ? shiftData.workedHours : '-'}
                                            </td>
                                        </>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>}
        </div>
    )
}

export default AttendancePage