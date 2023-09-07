import { useCallback, useEffect, useState } from 'react';

import { ShiftService } from '../../services/ShiftService';


const ShiftClose = ({ shiftData, setActive, indicator }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(shiftData.employees.length);
    const [isErrorActive, setIsErrorActive] = useState(false);

    const [stockEmployees, ] = useState(shiftData.employees);

    const [generalEndTime, setGeneralEndTime] = useState('');
    const [employeeTimes, setEmployeeTimes] = useState('');

    const [values, ] = useState({
        shiftId: shiftData.shiftId,
        workedHours: '',
    });

    const [isClosingConfirmed, setIsClosingConfirmed] = useState(false);

    async function closeShift() {
        const currentTime = new Date();

        Object.entries(employeeTimes).forEach(value => {
            const hoursAndMinutes = value[1].split(':');

            currentTime.setHours(hoursAndMinutes[0]);
            currentTime.setMinutes(hoursAndMinutes[1]);

            employeeTimes[value[0]] = currentTime.toISOString();
        });
      
        values.workedHours = employeeTimes;

        let data = await ShiftService.closeShift(values);

        if (data) {
            setActive(false);
            indicator(true);
        }
    }

    useEffect(() => {
        let employees = shiftData.employees;

        const obj = {};
        employees.forEach(element => {
            obj[`${element.employeeId}`] = '';
        });

        setEmployeeTimes(obj);
    }, []); 

    useEffect(() => {
        if (numberOfEmptyFields === 0) {
            setIsErrorActive(false);
        }
    }, [numberOfEmptyFields]);

    const handleChange = e => {
        setEmployeeTimes({...employeeTimes, [e.target.name]: e.target.value});

        if (e.target.value === '' && employeeTimes[e.target.name] !== '') {
            setNumberOfEmptyFields(numberOfEmptyFields + 1);
        }
        else if (employeeTimes[e.target.name] === ''){
            setNumberOfEmptyFields(numberOfEmptyFields - 1);
        }
    }

    const handleApplyClick = () => {
        if (generalEndTime !== '') {            
            Object.keys(employeeTimes).forEach(key => employeeTimes[key] = generalEndTime);

            setNumberOfEmptyFields(0);

            forceUpdate();
        }
    }

    const handleClick = () => {
        if (numberOfEmptyFields !== 0) {
            setIsClosingConfirmed(false);

            !isErrorActive && setIsErrorActive(true);

            forceUpdate();
        }
        else if (isClosingConfirmed) {
            closeShift();
        }
    }

    return (
        <div className='text-base text-[#2c3e50]'>           
            <div className='flex justify-between mb-4 mx-1'>
                <div>
                    <label className='font-bold'>
                        Время окончания смены:
                    </label>
                    <input type='time' name='generalEndTime' className='w-[80px] ml-3 py-1 px-1 shadow-sm border rounded' onChange={e => setGeneralEndTime(e.target.value)}/>
                </div>

                <button className='ml-8 px-2 py-1 border border-gray-300 rounded-md select-none' onClick={handleApplyClick}>
                    Применить ко всем
                </button>
            </div>

            <div className=''>
                <table className='block overflow-y-auto border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                    <thead className='bg-slate-300'>
                        <tr className='text-base/5 text-left'>
                            <th className='px-4 py-2 text-center border-b-2'>
                                №
                            </th>
                            <th className='min-w-[300px] px-4 py-2 border-b-2 border-l-2'>
                                ФИО
                            </th>
                            <th className='px-4 py-2 border-b-2 border-l-2'>
                                Конец смены
                            </th>
                        </tr>
                    </thead>

                    <tbody className='bg-slate-100'>
                        {
                            stockEmployees
                            ?.map((data, index) => (
                                <tr key={index} className='hover:bg-slate-200'>
                                    <td className='px-4 py-[4px] text-center border-b-2'>
                                        {index + 1}
                                    </td>
                                    <td className='px-4 py-[4px] border-b-2 border-l-2'>
                                        {data.fullName}
                                    </td>
                                    <td className='px-2 py-[4px] border-b-2 border-l-2'>
                                        <div className='flex items-center justify-center'>
                                            <input type='time' name={data.employeeId} className={`w-[80px] py-1 px-1 border ${(isErrorActive && employeeTimes[data.employeeId] === '') ? 'border-red-500' : 'border-slate-100'} bg-slate-100 rounded`} value={employeeTimes && employeeTimes[data.employeeId]} onChange={handleChange}/>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={handleClick}>
                    Закрыть смену
                </button>

                {/* <button className='' 
                    onClick={() => {
                        const confirmBox = window.confirm('Вы уверены, что все данные внесены корректно?')
                        if (confirmBox === true) {
                        }
                    }}>
                </button> */}
                
                {isErrorActive ? 
                <div className='ml-2 font-bold text-red-500'>
                    Ошибка. Заполнены не все поля!
                </div> :
                <div className='flex items-center ml-1'>
                    <input type='checkbox' name='confirmationOfClosing' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={(e) => setIsClosingConfirmed(e.target.checked)}/>
                    <label className='ml-2 whitespace-nowrap'>Все данные внесены корректно</label>
                </div>}
            </div>
        </div>
    )
}

export default ShiftClose