import { useCallback, useEffect, useState } from 'react';

import { PositionService } from '../../services/PositionService';


const PositionEdit = ({ rowData, setActive, changeValue }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(0);
    const [isErrorActive, setIsErrorActive] = useState(false);
    
    const [values, setValues] = useState(JSON.parse(rowData));

    const [valueFlags, setValueFlags] = useState({
        name: { isDirty: false, isEmpty: false },
        salary: { isDirty: false, isEmpty: false },
        quarterlyBonus: { isDirty: false, isEmpty: false },
        numberOfDayShifts: { isDirty: false, isEmpty: false },
        numberOfHoursPerDayShift: { isDirty: false, isEmpty: false },
        numberOfNightShifts: { isDirty: false, isEmpty: false },
        numberOfHoursPerNightShift: { isDirty: false, isEmpty: false }
    });

    async function editPosition() {
        let data = PositionService.editPosition(values);

        if (data) {
            changeValue(values);
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
        if (e.target.type === 'checkbox') { 
            setValues({...values, interfaceAccesses: {...values.interfaceAccesses, [e.target.name]: e.target.checked}});
        }
        else if (e.target.type === 'number') {
            setValues({...values, [e.target.name]: e.target.value || 0});
        }
        else {
            setValues({...values, [e.target.name]: e.target.value});
        }

        if (valueFlags.hasOwnProperty(e.target.name)) {
            let isEmpty = e.target.value ? false : true;
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
            editPosition();
        }
    }

    return (
        <div className='text-base text-[#2c3e50] whitespace-nowrap'>
            <div className='grid grid-rows-4 grid-flow-col gap-2'>
                <div className='row-span-4'>
                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Название
                        </label>
                        <input name='name' className={`w-full py-2 px-3 leading-tight shadow border ${(valueFlags.name.isDirty && valueFlags.name.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.name} onChange={handleChange} onBlur={handleBlur}/>
                    </div>

                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Оклад
                        </label>
                        <input type='number' name='salary' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.salary.isDirty && valueFlags.salary.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.salary} onChange={handleChange} onBlur={handleBlur}/>
                    </div>

                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Квартальная премия
                        </label>
                        <input type='number' name='quarterlyBonus' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.quarterlyBonus.isDirty && valueFlags.quarterlyBonus.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.quarterlyBonus} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                </div>

                <div className='row-span-4 ml-4'>
                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Дневных смен
                        </label>
                        <input type='number' name='numberOfDayShifts' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.numberOfDayShifts.isDirty && valueFlags.numberOfDayShifts.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.numberOfDayShifts} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Длительность дневной смены
                        </label>
                        <input type='number' name='numberOfHoursPerDayShift' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.numberOfHoursPerDayShift.isDirty && valueFlags.numberOfHoursPerDayShift.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.numberOfHoursPerDayShift} onChange={handleChange} onBlur={handleBlur}/>
                    </div>

                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Ночных смен
                        </label>
                        <input type='number' name='numberOfNightShifts' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.numberOfNightShifts.isDirty && valueFlags.numberOfNightShifts.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.numberOfNightShifts} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Длительность ночной смены
                        </label>
                        <input type='number' name='numberOfHoursPerNightShift' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.numberOfHoursPerNightShift.isDirty && valueFlags.numberOfHoursPerNightShift.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.numberOfHoursPerNightShift} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                </div>

                <div className='row-span-4 ml-4'>
                    <label className='block mb-1 font-bold'>
                        Доступ
                    </label>

                    <div> 
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='employeeCard' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' defaultChecked={values.interfaceAccesses.employeeCard} onChange={handleChange}/>
                            <label className='ml-2'>Карточка сотрудника</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='positionDirectory' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' defaultChecked={values.interfaceAccesses.positionDirectory} onChange={handleChange}/>
                            <label className='ml-2'>Список должностей</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='changes' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' defaultChecked={values.interfaceAccesses.changes} onChange={handleChange}/>
                            <label className='ml-2'>Смены</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='visitSchedule' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' defaultChecked={values.interfaceAccesses.visitSchedule} onChange={handleChange}/>
                            <label className='ml-2'>Посещения</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='accounting' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' defaultChecked={values.interfaceAccesses.accounting} onChange={handleChange}/>
                            <label className='ml-2'>Учет</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3 whitespace-normal'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={handleClick}>
                    Сохранить
                </button>

                {isErrorActive && <div className='font-bold text-red-500'>Ошибка. Заполнены не все поля!</div>}
            </div>
        </div>
    )
}

export default PositionEdit