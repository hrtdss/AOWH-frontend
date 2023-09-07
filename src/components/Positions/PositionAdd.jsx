import { useCallback, useEffect, useState } from 'react';

import { PositionService } from '../../services/PositionService';


const PositionAdd = ({ setActive, addValue }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(3); // const size = Object.keys(valueFlags).length ?
    const [isErrorActive, setIsErrorActive] = useState(false);

    const [values, setValues] = useState({
        name: '',
        salary: 0,
        quarterlyBonus: 0,
        interfaceAccesses: {
            employeeCard: false,
            positionDirectory: false,
            changes: false,
            visitSchedule: false,
            accounting: false
        }
    });

    const [valueFlags, setValueFlags] = useState({
        name: { isDirty: false, isEmpty: true },
        salary: { isDirty: false, isEmpty: true },
        quarterlyBonus: { isDirty: false, isEmpty: true }
    });

    async function addPosition() {
        let data = await PositionService.addPosition(values);

        if (data) {
            addValue(values);
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
            addPosition();
        }
    }

    return (
        <div className='text-base text-[#2c3e50] whitespace-nowrap'>
            <div className='grid grid-rows-3 grid-flow-col gap-2'>
                <div className='row-span-3'>
                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Название
                        </label>
                        <input name='name' className={`w-full py-2 px-3 leading-tight shadow border ${(valueFlags.name.isDirty && valueFlags.name.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>

                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Оклад
                        </label>
                        <input type='number' name='salary' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.salary.isDirty && valueFlags.salary.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>

                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Квартальная премия
                        </label>
                        <input type='number' name='quarterlyBonus' className={`remove-arrow w-full py-2 px-3 leading-tight shadow border ${(valueFlags.quarterlyBonus.isDirty && valueFlags.quarterlyBonus.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                </div>
                
                <div className='row-span-3 ml-4'>
                    <label className='block mb-1 font-bold'>
                        Доступ
                    </label>

                    <div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='employeeCard' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={handleChange}/>
                            <label className='ml-2'>Карточка сотрудника</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='positionDirectory' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={handleChange}/>
                            <label className='ml-2'>Список должностей</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='changes' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={handleChange}/>
                            <label className='ml-2'>Смены</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='visitSchedule' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={handleChange}/>
                            <label className='ml-2'>Посещения</label>
                        </div>
                        <div className='flex items-center mb-2'>
                            <input type='checkbox' name='accounting' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={handleChange}/>
                            <label className='ml-2'>Учет</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3 whitespace-normal'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={handleClick}>
                    Добавить
                </button>

                {isErrorActive && <div className='font-bold text-red-500'>Ошибка. Заполнены не все поля!</div>}
            </div>
        </div>
    )
}

export default PositionAdd