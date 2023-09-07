import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import { ADMINISTRATOR, FRANCHISE_MANAGER } from '../../services/Constants';
import { EmployeeService } from '../../services/EmployeeService';
import { PositionService } from '../../services/PositionService';


const EmployeeEdit = ({ rowData, setActive, changeValue }) => {
    const [selectStyles, ] = useState({
        position: {
            control: base => ({ ...base, minHeight: '36px', height: '36px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', borderColor: (valueFlags.positionId.isDirty && valueFlags.positionId.isEmpty) && 'rgb(239 68 68)', borderRadius: '4px' }),
            valueContainer: base => ({ ...base, height: '36px', padding: '0 8px' }),
            indicatorsContainer: base => ({ ...base, height: '36px' })
        },
        stock: {
            control: base => ({ ...base, minHeight: '36px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', borderColor: (valueFlags.stocks.isDirty && valueFlags.stocks.isEmpty) && 'rgb(239 68 68)', borderRadius: '4px' }),
            valueContainer: base => ({ ...base, minHeight: '36px', padding: '2px 8px' })
        },
        link: {
            control: base => ({ ...base, minHeight: '36px', height: '36px', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', borderColor: (valueFlags.link.isDirty && valueFlags.link.isEmpty) && 'rgb(239 68 68)', borderRadius: '4px' }),
            valueContainer: base => ({ ...base, height: '36px', padding: '0 8px' }),
            indicatorsContainer: base => ({ ...base, height: '36px' })
        }
    })
    
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(3);
    const [isErrorActive, setIsErrorActive] = useState(false);

    const [values, setValues] = useState(rowData.employeeData);

    const [valueFlags, setValueFlags] = useState({
        password: { isDirty: false, isEmpty: false },
        name: { isDirty: false, isEmpty: false },
        surname: { isDirty: false, isEmpty: false },
        patronymic: { isDirty: false, isEmpty: false },
        birthday: { isDirty: false, isEmpty: false },
        passportNumber: { isDirty: false, isEmpty: false },
        passportIssuer: { isDirty: false, isEmpty: false },
        passportIssueDate: { isDirty: false, isEmpty: false },
        startOfTotalSeniority: { isDirty: false, isEmpty: false },
        startOfLuchSeniority: { isDirty: false, isEmpty: false },
        positionId: { isDirty: false, isEmpty: true },
        salary: { isDirty: false, isEmpty: false },
        stocks: { isDirty: false, isEmpty: true },
        link: { isDirty: false, isEmpty: true },
        percentageOfSalaryInAdvance: { isDirty: false, isEmpty: false }
    });

    const [positions, setPositions] = useState([]);
    const [selectedPositionIsAdmin, setSelectedPositionIsAdmin] = useState(false);
    const [selectedPositionIsFrManager, setSelectedPositionIsFrManager] = useState(false);
    
    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks')));
    const [links, ] = useState([
        { value: 'Дневная', label: 'Дневная' },
        { value: 'Ночная', label: 'Ночная' }
    ]);

    async function getPositions() {
        let data = await PositionService.getListOfPositions('restore');

        if (data) {
            setPositions(data);
        }
    }

    async function restoreEmployee() {
        values.reasonOfTermination = null;

        const selectedStocks = values.stocks;
        const requiredData = [];

        if (Array.isArray(selectedStocks)) {
            for (let stock of selectedStocks) {
                requiredData.push(stock.value)
            }

            requiredData.sort((a, b) => { return a - b; });
        }
        else if (selectedStocks !== []) {
            requiredData.push(selectedStocks.value);
        }

        values.stocks = JSON.stringify(requiredData);

        let data = await EmployeeService.editEmployee(rowData.employeeId, values);

        if (data) {
            console.log(data);

            changeValue(data);
            setActive(false);
        }
    }

    useEffect(() => {
        getPositions();

        if (values.positionId === ADMINISTRATOR) {
            setSelectedPositionIsAdmin(true);
        }
        else if (values.positionId === FRANCHISE_MANAGER) {
            setSelectedPositionIsFrManager(true);
        }
    }, []);

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

    const handleSelectBlur = field => {
        if (!valueFlags[field].isDirty) {
            setValueFlags({...valueFlags, [field]: {...valueFlags[field], isDirty: true}});
        }
    }

    const handleChange = e => {
        let value; 

        if (e.target.type === 'number') {
            value = e.target.value || 0;
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

    const handleSelectChange = (field, value) => {
        if (field === 'positionId') {
            values.stocks = [];
            values.link = '';

            if (value === ADMINISTRATOR) {
                setSelectedPositionIsAdmin(true);
                setSelectedPositionIsFrManager(false);

                valueFlags.stocks.isEmpty = false;
                valueFlags.stocks.isDirty = true;
                valueFlags.link.isEmpty = false;
                valueFlags.link.isDirty = true;
            }
            else if (value === FRANCHISE_MANAGER) {
                setSelectedPositionIsAdmin(false);
                setSelectedPositionIsFrManager(true);

                valueFlags.stocks.isEmpty = true;
                valueFlags.stocks.isDirty = true;
                valueFlags.link.isEmpty = false;
                valueFlags.link.isDirty = true;
            }
            else {
                setSelectedPositionIsAdmin(false); 
                setSelectedPositionIsFrManager(false);

                valueFlags.stocks.isEmpty = true;
                valueFlags.link.isEmpty = true;
            }
        }

        setValues({...values, [field]: value});

        if (field === 'stocks' && value.length === 0) {
            setValueFlags({...valueFlags, [field]: {...valueFlags[field], isEmpty: true}});
        }
        else {
            setValueFlags({...valueFlags, [field]: {...valueFlags[field], isEmpty: false}});
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
            restoreEmployee();
        }
    }

    return (
        <div className='text-base text-[#2c3e50]'>
            <div className='grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-2 lg:grid-rows-2 gap-4'>
                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3'>
                            Фамилия
                        </label>
                        <input name='surname' className={`w-[254px] py-1 px-3 shadow border ${(valueFlags.surname.isDirty && valueFlags.surname.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.surname} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Имя
                        </label>
                        <input name='name' className={`w-[254px] py-1 px-3 shadow border ${(valueFlags.name.isDirty && valueFlags.name.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.name} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Отчество
                        </label>
                        <input name='patronymic' className={`w-[254px] py-1 px-3 shadow border ${(valueFlags.patronymic.isDirty && valueFlags.patronymic.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.patronymic} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Должность
                        </label>
                        <div className='w-[254px] text-left'>
                            {positions.length > 0 &&
                            <Select placeholder='' maxMenuHeight={168} styles={selectStyles.position} options={positions} value={positions.filter(data => data.value === values.positionId)} onChange={data => handleSelectChange('positionId', data.value)} onBlur={() => handleSelectBlur('positionId')}/>}
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Пароль
                        </label>
                        <input type='number' name='password' className={`remove-arrow w-[254px] py-1 px-3 shadow border ${(valueFlags.password.isDirty && valueFlags.password.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.password} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                </div>

                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3'>
                            Номер паспорта
                        </label>
                        <input name='passportNumber' className={`py-1 px-3 shadow border ${(valueFlags.passportNumber.isDirty && valueFlags.passportNumber.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.passportNumber} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Паспорт выдан
                        </label>
                        <input name='passportIssuer' className={`py-1 px-3 shadow border ${(valueFlags.passportIssuer.isDirty && valueFlags.passportIssuer.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.passportIssuer} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3 leading-5'>
                            Дата выдачи <br/> паспорта
                        </label>
                        <input type='date' name='passportIssueDate' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.passportIssueDate.isDirty && valueFlags.passportIssueDate.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.passportIssueDate} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Дата рождения
                        </label>
                        <input type='date' name='birthday' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.birthday.isDirty && valueFlags.birthday.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.birthday} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                </div>

                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3'>
                            Склад
                        </label>
                        <div className='w-[254px] text-left'>
                            <Select placeholder='' maxMenuHeight={168} styles={selectStyles.stock} options={stocks} value={values.stocks} onChange={data => handleSelectChange('stocks', data)} onBlur={() => handleSelectBlur('stocks')} isDisabled={selectedPositionIsAdmin} isMulti={selectedPositionIsFrManager} closeMenuOnSelect={selectedPositionIsFrManager ? false : true}/>
                        </div>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Звено
                        </label>
                        <div className='w-[254px] text-left'>
                            <Select placeholder='' styles={selectStyles.link} options={links} value={{label : values.link}} onChange={data => handleSelectChange('link', data.value)} onBlur={() => handleSelectBlur('link')} isDisabled={selectedPositionIsAdmin || selectedPositionIsFrManager}/>
                        </div> 
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Оклад
                        </label>
                        <input type='number' name='salary' className={`remove-arrow w-[254px] py-1 px-3 shadow border ${(valueFlags.salary.isDirty && valueFlags.salary.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.salary} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3 leading-5'>
                            Аванс <br/> <p className='whitespace-nowrap'>(% от оклада)</p>
                        </label>
                        <input type='number' name='percentageOfSalaryInAdvance' className={`remove-arrow w-[254px] py-1 px-3 shadow border ${(valueFlags.percentageOfSalaryInAdvance.isDirty && valueFlags.percentageOfSalaryInAdvance.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.percentageOfSalaryInAdvance} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row justify-between mt-3'>
                        <div className='flex flex-row items-center justify-end pl-5'>
                            <div className='mr-3 leading-5'>
                                Управление <br/> погрузчиком
                            </div>
                            <div className='flex flex-row items-start'>
                                <label className='relative inline-block w-11 h-6 rounded-full'>
                                    <input type='checkbox' name='forkliftControl' className='peer opacity-0 w-0 h-0' defaultChecked={values.forkliftControl && true} onClick={handleChange}/>
                                    <span className='absolute cursor-pointer inset-0 bg-gray-300 rounded-full duration-300 before:content-[""] before:absolute before:w-4 before:h-4 before:bottom-1 before:left-1 before:rounded-full before:bg-white before:duration-300 peer-checked:before:translate-x-5 peer-checked:bg-blue-500'/>
                                </label>
                            </div>
                        </div>
                        <div className='flex flex-row items-center justify-end pr-5'>
                            <div className='mr-3 leading-5'>
                                Управление <br/> рохлей
                            </div>
                            <div className='flex flex-row items-start'>
                                <label className='relative inline-block w-11 h-6 rounded-full'>
                                    <input type='checkbox' name='rolleyesControl' className='peer opacity-0 w-0 h-0' defaultChecked={values.rolleyesControl && true} onClick={handleChange}/>
                                    <span className='absolute cursor-pointer inset-0 bg-gray-300 rounded-full duration-300 before:content-[""] before:absolute before:w-4 before:h-4 before:bottom-1 before:left-1 before:rounded-full before:bg-white before:duration-300 peer-checked:before:translate-x-5 peer-checked:bg-blue-500'/>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col justify-center py-5 px-6 text-right shadow-md rounded-lg'>
                    <div className='flex flex-row items-center justify-end'>
                        <label className='mr-3 leading-5'>
                            Дата начала <br/> <p className='whitespace-nowrap'>общего стажа</p>
                        </label>
                        <input type='date' name='startOfTotalSeniority' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.startOfTotalSeniority.isDirty && valueFlags.startOfTotalSeniority.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.startOfTotalSeniority} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Дата начала <br/> <p className='whitespace-nowrap'>работы в ЛУЧ</p>
                        </label>
                        <input type='date' name='startOfLuchSeniority' className={`min-w-[204px] py-1 px-3 shadow border ${(valueFlags.startOfLuchSeniority.isDirty && valueFlags.startOfLuchSeniority.isEmpty) && 'border-red-500'} rounded`} defaultValue={values.startOfLuchSeniority} onChange={handleChange} onBlur={handleBlur}/>
                    </div>  
                    <div className='flex flex-row items-center justify-end mt-3'>
                        <label className='mr-3'>
                            Дата увольнения
                        </label>
                        <input type='date' name='dateOfTermination' className='min-w-[204px] py-1 px-3 shadow border rounded' defaultValue={values.dateOfTermination} disabled/>
                    </div>
                    <div className='mt-3'>
                        <label className='block text-left ml-1 mb-1'>
                            Причина увольнения
                        </label>
                        <textarea name='reasonOfTermination' className='w-[364px] h-[80px] px-2 py-1 border rounded resize-none' defaultValue={values.reasonOfTermination} disabled/>
                    </div>
                </div>
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={handleClick}>
                    Восстановить
                </button>
                
                {isErrorActive && <div className='ml-2 font-bold text-red-500'>Ошибка. Заполнены не все поля!</div>}
            </div>
        </div>
    )
}

export default EmployeeEdit