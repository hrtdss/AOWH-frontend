import { useCallback, useEffect, useState } from 'react';

import { EmployeeService } from '../../services/EmployeeService';


const EmployeeTerminate = ({ employeeId, setActive }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(2); // ?
    const [isErrorActive, setIsErrorActive] = useState(false);

    const [values, setValues] = useState({
        dateOfTermination: '',
        reasonOfTermination: ''
    })

    const [valueFlags, setValueFlags] = useState({
        dateOfTermination: { isDirty: false, isEmpty: true },
        reasonOfTermination: { isDirty: false, isEmpty: true }
    });

    async function terminateEmployee() {
        let data = await EmployeeService.terminateEmployee(employeeId, { dateOfTermination: values.dateOfTermination, reasonOfTermination: values.reasonOfTermination });

        if (data) {
            setActive(false);
        }
    }

    useEffect(() => {
        let numberOfUnfilled = 0;
        Object.values(valueFlags).forEach(value => numberOfUnfilled += value.isEmpty);

        setNumberOfEmptyFields(numberOfUnfilled);

        if (numberOfUnfilled === 0) {
            setIsErrorActive(false);
        }
    }, [valueFlags]);

    const handleBlur = e => {
        if (!valueFlags[e.target.name].isDirty) {
            setValueFlags({...valueFlags, [e.target.name]: {...valueFlags[e.target.name], isDirty: true}});
        }
    }

    const handleChange = e => {
        const value = e.target.value;

        setValues({...values, [e.target.name]: value});

        if (valueFlags.hasOwnProperty(e.target.name)) {
            let isEmpty = value ? false : true;
            let recorderValue = values[e.target.name];

            if (isEmpty || (!isEmpty && !recorderValue)) {
                setValueFlags({...valueFlags, [e.target.name]: {...valueFlags[e.target.name], isEmpty: isEmpty}});
            }
        }
    }

    const handleClick = () => {
        if (numberOfEmptyFields !== 0) {
            Object.values(valueFlags).forEach(value => {
                if (!value.isDirty && value.isEmpty) {
                    value.isDirty = true;
                }
            });

            !isErrorActive && setIsErrorActive(true);
            forceUpdate();
        }
        else {
            terminateEmployee();
        }
    }

    return (
        <div className='text-base text-[#2c3e50]'>
            <div className='p-1'>
                <div className='flex flex-row items-center'>
                    <label className='mr-3'>
                        Укажите дату увольнения
                    </label>
                    <input type='date' name='dateOfTermination' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.dateOfTermination.isDirty && valueFlags.dateOfTermination.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                </div>
                <div className='mt-5'>
                    <label className='block mb-1'>
                        Причина увольнения
                    </label>
                    <textarea name='reasonOfTermination' className={`w-[410px] h-[120px] px-2 py-1 border ${(valueFlags.reasonOfTermination.isDirty && valueFlags.reasonOfTermination.isEmpty) && 'border-red-500'} rounded resize-none`} onChange={handleChange} onBlur={handleBlur}/>
                </div>
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={handleClick}>
                    Подтвердить
                </button>

                {isErrorActive && <div className='ml-1 font-bold text-red-500'>Ошибка. Заполнены не все поля!</div>}
            </div>
        </div>
    )
}

export default EmployeeTerminate