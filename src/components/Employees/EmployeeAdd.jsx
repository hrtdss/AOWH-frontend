import { useCallback, useEffect, useState } from 'react';

import { EmployeeService } from '../../services/EmployeeService';
import { PositionService } from '../../services/PositionService';
import { StockService } from '../../services/StockService';


const EmployeeAdd = ({ setActive, addValue }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(14); // const size = Object.keys(valueFlags).length ?
    const [isErrorActive, setIsErrorActive] = useState(false);

    const [values, setValues] = useState({
        password: 0,
        name: '',
        surname: '',
        patronymic: '',
        birthday: '',
        passportNumber: '',
        passportIssuer: '',
        passportIssueDate: '',
        startOfTotalSeniority: '',
        startOfLuchSeniority: '',
        dateOfTermination: '',
        positionId: '',
        salary: 0,
        link: '',
        stock: '',
        forkliftControl: false,
        rolleyesControl: false,
        percentageOfSalaryInAdvance: 0,
        dateOfStartInTheCurrentPosition: '',
        dateOfStartInTheCurrentStock: '',
        dateOfStartInTheCurrentLink: ''
    });

    const [valueFlags, setValueFlags] = useState({
        password: { isDirty: false, isEmpty: true },
        name: { isDirty: false, isEmpty: true },
        surname: { isDirty: false, isEmpty: true },
        patronymic: { isDirty: false, isEmpty: true },
        birthday: { isDirty: false, isEmpty: true },
        passportNumber: { isDirty: false, isEmpty: true },
        passportIssuer: { isDirty: false, isEmpty: true },
        passportIssueDate: { isDirty: false, isEmpty: true },
        startOfTotalSeniority: { isDirty: false, isEmpty: true },
        startOfLuchSeniority: { isDirty: false, isEmpty: true },
        positionId: { isDirty: false, isEmpty: true },
        salary: { isDirty: false, isEmpty: true },
        stock: { isDirty: false, isEmpty: true },
        percentageOfSalaryInAdvance: { isDirty: false, isEmpty: true }
    });

    const [positions, setPositions] = useState([]);
    const stocks = JSON?.parse(sessionStorage.getItem('stocks'));
    const [links, setLinks] = useState([]);

    async function getPositions() {
        let data = await PositionService.getListOfPositions();

        if (data) {
            setPositions(data);
        }
    }

    async function addEmployee() {
        let data = await EmployeeService.addEmployee(values);

        if (data) {
            addValue(data);
            setActive(false);
        }
    }

    useEffect(() => {
        getPositions();
    }, []); 

    useEffect(() => {
        if (values.stock !== '') {
            let data = StockService.getLinksByStock(values.stock.replace(/[^0-9]+/g, ""));
            data.then(data => {
                if (data.length === 0) {
                    setLinks([]);
                    setValues(prevState => ({...prevState, link: ''}));
                }
                else {
                    setLinks(data);
                }
            });
        }
        else {
            setLinks([]);
            setValues(prevState => ({...prevState, link: ''}));
        }
    }, [values.stock]); 

    useEffect(() => {
        let numberOfUnfilled = 0;
        Object.values(valueFlags).forEach(value => numberOfUnfilled += value.isEmpty);
        
        setNumberOfEmptyFields(numberOfUnfilled);

        if (numberOfUnfilled === 0) {
            setIsErrorActive(false);
        }
    }, [valueFlags]);

    const handleBlur = e => {
        setValueFlags({...valueFlags, [e.target.name]: {...valueFlags[e.target.name], isDirty: true}});
    }

    const handleChange = e => {
        let value; 

        if (e.target.type === 'number') {
            value = e.target.value || 0;
        }
        else if (e.target.type === 'select-one' && e.target.name === 'stock') { 
            value = e.target.value ? `[${e.target.value}]` : e.target.value;
        }
        else if (e.target.type === 'checkbox') {
            value = e.target.checked;
        }
        else {
            value = e.target.value;
        }

        setValues({...values, [e.target.name]: value});

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
            addEmployee();
        }
    }

    return (
        <div className='text-base text-[#2c3e50]'>
            <h2 className='flex mb-4 pl-1 pb-2 text-xl border-b border-[#2c3e50] border-opacity-10'>Добавление сотрудника</h2>

            <div className='grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-2 lg:grid-rows-2 gap-4'>
                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3'>
                            Фамилия
                        </label>
                        <input name='surname' className={`py-1 px-3 shadow border ${(valueFlags.surname.isDirty && valueFlags.surname.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Имя
                        </label>
                        <input name='name' className={`py-1 px-3 shadow border ${(valueFlags.name.isDirty && valueFlags.name.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Отчество
                        </label>
                        <input name='patronymic' className={`py-1 px-3 shadow border ${(valueFlags.patronymic.isDirty && valueFlags.patronymic.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Дата рождения
                        </label>
                        <input type='date' name='birthday' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.birthday.isDirty && valueFlags.birthday.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Пароль
                        </label>
                        <input type='number' name='password' className={`remove-arrow py-1 px-3 shadow border ${(valueFlags.password.isDirty && valueFlags.password.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                </div>

                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3'>
                            Номер паспорта
                        </label>
                        <input name='passportNumber' className={`py-1 px-3 shadow border ${(valueFlags.passportNumber.isDirty && valueFlags.passportNumber.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Паспорт выдан
                        </label>
                        <input name='passportIssuer' className={`py-1 px-3 shadow border ${(valueFlags.passportIssuer.isDirty && valueFlags.passportIssuer.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Дата выдачи
                        </label>
                        <input type='date' name='passportIssueDate' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.passportIssueDate.isDirty && valueFlags.passportIssueDate.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                </div>

                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3'>
                            Должность
                        </label>
                        <select name='positionId' className={`w-[204px] h-[34px] py-1 px-2 shadow border ${(valueFlags.positionId.isDirty && valueFlags.positionId.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}>
                            <option value=''></option>
                            <option value='test'>заглушка</option>
                            {
                                positions?.map((data, index) =>
                                    <option key={index} value={data.positionId}>
                                        {data.name}
                                    </option>
                                )
                            }
                        </select>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Склад
                        </label>
                        <select name='stock' className={`w-[204px] h-[34px] py-1 px-2 shadow border ${(valueFlags.stock.isDirty && valueFlags.stock.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}>
                            <option value=''></option>
                            {
                                stocks?.map((data, index) =>
                                    <option key={index} value={data.stockId}>
                                        {data.stockName}
                                    </option>
                                )
                            }
                        </select>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Звено
                        </label>
                        <select name='link' className='w-[204px] h-[34px] py-1 px-2 shadow border rounded' onChange={handleChange} disabled={values.stock === '' && true}>
                            <option value=''></option>
                            {
                                links?.map((data, index) =>
                                    <option key={index} value={data}>
                                        {data}
                                    </option>
                                )
                            }
                        </select>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <div className='mr-3 leading-5'>
                            Управление <br/> погрузчиком
                        </div>
                        <div className='min-w-[204px] flex flex-row items-start'>
                            <label className='relative inline-block w-11 h-6 rounded-full'>
                                <input type='checkbox' name='forkliftControl' className='peer opacity-0 w-0 h-0' onClick={handleChange}/>
                                <span className='absolute cursor-pointer inset-0 bg-gray-300 rounded-full duration-300 before:content-[""] before:absolute before:w-4 before:h-4 before:bottom-1 before:left-1 before:rounded-full before:bg-white before:duration-300 peer-checked:before:translate-x-5 peer-checked:bg-blue-500'/>
                            </label>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <div className='mr-3 leading-5'>
                            Управление <br/> рохлей
                        </div>
                        <div className='min-w-[204px] flex flex-row items-start'>
                            <label className='relative inline-block w-11 h-6 rounded-full'>
                                <input type='checkbox' name='rolleyesControl' className='peer opacity-0 w-0 h-0' onClick={handleChange}/>
                                <span className='absolute cursor-pointer inset-0 bg-gray-300 rounded-full duration-300 before:content-[""] before:absolute before:w-4 before:h-4 before:bottom-1 before:left-1 before:rounded-full before:bg-white before:duration-300 peer-checked:before:translate-x-5 peer-checked:bg-blue-500'/>
                            </label>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3 leading-5'>
                            Дата начала <br/> <p className='whitespace-nowrap'>общего стажа</p>
                        </label>
                        <input type='date' name='startOfTotalSeniority' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.startOfTotalSeniority.isDirty && valueFlags.startOfTotalSeniority.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Дата начала <br/> <p className='whitespace-nowrap'>работы в ЛУЧ</p>
                        </label>
                        <input type='date' name='startOfLuchSeniority' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.startOfLuchSeniority.isDirty && valueFlags.startOfLuchSeniority.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Оклад
                        </label>
                        <input type='number' name='salary' className={`remove-arrow py-1 px-3 shadow border ${(valueFlags.salary.isDirty && valueFlags.salary.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3 leading-5'>
                            Аванс <br/> <p className='whitespace-nowrap'>(% от оклада)</p>
                        </label>
                        <input type='number' name='percentageOfSalaryInAdvance' className={`remove-arrow py-1 px-3 shadow border ${(valueFlags.percentageOfSalaryInAdvance.isDirty && valueFlags.percentageOfSalaryInAdvance.isEmpty) && 'border-red-500'} rounded`} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    {/* <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Дата увольнения
                        </label>
                        <input type='date' name='dateOfTermination' className='min-w-[204px] py-1 px-3 shadow border rounded' onChange={handleChange}/>
                    </div>   */}
                </div>
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md' onClick={handleClick}>
                    Добавить
                </button>
                
                {isErrorActive && <div className='ml-2 font-bold text-red-500'>Ошибка. Заполнены не все поля!</div>}
            </div>
        </div>
    )
}

export default EmployeeAdd