import { useCallback, useState } from 'react';

import { PositionService } from '../../services/PositionService';


const PositionAdd = ({ setActive, addValue }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

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
    const [nameFlag, setNameFlags] = useState({ isDirty: false, isEmpty: true });

    async function addPosition() {
        let data = await PositionService.addPosition(values);

        if (data) {
            addValue(values);
            setActive(false);
        }
    }

    const handleBlur = () => {
        setNameFlags({...nameFlag, isDirty: true});
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

        if (e.target.name === 'name') { 
            setNameFlags({...nameFlag, isEmpty: e.target.value ? false : true});

            (isErrorActive && e.target.value) && setIsErrorActive(false);
        }
    }

    const handleClick = () => {
        if(nameFlag.isEmpty) {
            setNameFlags({...nameFlag, isDirty: true});

            setIsErrorActive(true);
            forceUpdate();
        }
        else {
            addPosition();
        }
    }

    return (
        <div className='text-base text-[#2c3e50] whitespace-nowrap'>
            <h2 className='flex mb-4 pl-1 pb-2 text-xl border-b border-[#2c3e50] border-opacity-10'>Добавление должности</h2>

            <div className='grid grid-rows-3 grid-flow-col gap-2'>
                <div className='row-span-3'>
                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Название
                        </label>
                        <input name='name' className={`w-full py-2 px-3 leading-tight shadow border ${(nameFlag.isDirty && nameFlag.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>

                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Оклад
                        </label>
                        <input type='number' name='salary' className='remove-arrow w-full py-2 px-3 leading-tight shadow border rounded' onChange={handleChange}/>
                    </div>

                    <div className='mb-3'>
                        <label className='block mb-1 font-bold'>
                            Квартальная премия
                        </label>
                        <input type='number' name='quarterlyBonus' className='remove-arrow w-full py-2 px-3 leading-tight shadow border rounded' onChange={handleChange}/>
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
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md' onClick={handleClick}>
                    Добавить
                </button>

                {isErrorActive && <div className='font-bold text-red-500'>Поле с названием не может быть пустым!</div>}
            </div>
        </div>
    )
}

export default PositionAdd