import { useCallback, useState } from 'react';

import { EmployeeService } from '../../services/EmployeeService';


const EmployeeTerminate = ({ employeeId, setActive }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [isErrorActive, setIsErrorActive] = useState(false);

    const [dateOfTermination, setDateOfTermination] = useState('')

    async function terminateEmployee() {
        let data = await EmployeeService.terminateEmployee(employeeId, { dateOfTermination: dateOfTermination });

        if (data) {
            setActive(false);
        }
    }

    const handleChange = e => {
        const value = e.target.value;

        setDateOfTermination(value)

        if (isErrorActive && value) {
            setIsErrorActive(false);
        }
        else if (!value) {
            setIsErrorActive(true);
        }
    }

    const handleClick = () => {
        if (!dateOfTermination) {
            !isErrorActive && setIsErrorActive(true);

            forceUpdate();
        }
        else {
            terminateEmployee();
        }
    }

    return (
        <div className='text-base text-[#2c3e50]'>
            <h2 className='flex mb-4 pl-1 pb-2 text-xl border-b border-[#2c3e50] border-opacity-10'>Увольнение сотрудника</h2>

            <div>
                <div className='flex flex-row items-center justify-end mt-3'>
                    <label className='mr-3'>
                        Укажите дату увольнения
                    </label>
                    <input type='date' name='dateOfTermination' className={`min-w-[204px] py-1 px-3 shadow border ${isErrorActive && 'border-red-500'} rounded`} onChange={handleChange}/>
                </div>  
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={handleClick}>
                    Подтвердить
                </button>

                {isErrorActive && <div className='ml-1 font-bold text-red-500'>Ошибка. Необходимо указать дату!</div>}
            </div>
        </div>
    )
}

export default EmployeeTerminate