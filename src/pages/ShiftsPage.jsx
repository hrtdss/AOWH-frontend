import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import { ADMINISTRATOR, SELECT_STYLE } from '../services/Constants';
import { EmployeeService } from '../services/EmployeeService'
import { ShiftService } from '../services/ShiftService';

import Modal from '../components/Modal';
// import ShiftAdd from '../components/Shifts/ShiftAdd';
// import ShiftEdit from '../components/Shifts/ShiftEdit';
import ShiftClose from '../components/Shifts/ShiftClose';


function updateSelectionFlags(object) {
    Object.keys(object).forEach(key => {
        if (object[key]) {
            object[key] = false;
        }
    });
}

const ShiftsPage = () => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    // const [isModalAddActive, setIsModalAddActive] = useState(false);
    // const [isModalEditActive, setIsModalEditActive] = useState(false);
    const [isModalCloseActive, setIsModalCloseActive] = useState(false);

    const [stocks, setStocks] = useState(JSON?.parse(localStorage.getItem('employeeStocks')));
    const [selectedStock, setSelectedStock] = useState(stocks.length >= 2 ? {value: '', label: 'Все'} : stocks[0]);

    const [links, ] = useState([
        { value: '', label: 'Все' },
        { value: 'Дневная', label: 'Дневная' },
        { value: 'Ночная', label: 'Ночная' }
    ]);
    const [selectedLink, setSelectedLink] = useState(links[0]);
    
    const [onlySelectedEmployeesFlag, setOnlySelectedEmployeesFlag] = useState(false);
    
    const [values, setValues] = useState({
        stockId: 0,
        employees: [],
        dayOrNight: '',
        openingDateAndTime: '',
    });

    const [employees, setEmployees] = useState([]);
    const [employeeSelectionFlag, setEmployeeSelectionFlag] = useState([]);

    const [shiftOnStock, setShiftOnStock] = useState('');
    const [editedShiftOnStock, setEditedShiftOnStock] = useState('');

    const [isShiftEditingActive, setIsShiftEditingActive] = useState(false);

    async function getTableOfEmployees() {
        let employees = await EmployeeService.getListOfEmployees();

        if (employees) {
            if (stocks.length >= 2) { 
                setStocks([{value: '', label: 'Все'}, ...stocks]);
            }
            
            const notTerminatedEmployees = [];
            for (let employee of employees) {
                if (!employee.dateOfTermination) {
                    notTerminatedEmployees.push(employee);
                }
            }

            const userPositionId = localStorage.getItem('positionId');
            if (userPositionId === ADMINISTRATOR) {
                setEmployees(notTerminatedEmployees);
                return;
            }

            let requiredEmployees = [];
            let employeeFlags = [];

            for (let employee of notTerminatedEmployees) {
                if (employee.stocks.some(dataStock => stocks.some(stock => stock.value === dataStock.stockId))) {
                    requiredEmployees.push(employee);
                    employeeFlags.push(employee.employeeId);
                }
            }

            setEmployees(requiredEmployees);

            const obj = {};
            employeeFlags.forEach(element => {
                obj[`${element}`] = false;
            });

            setEmployeeSelectionFlag(obj);
        }
    }

    async function getShift(stockId) {
        let shift = await ShiftService.getListOfOpenShifts(stockId);

        if (shift === 'Смена не найдена') {
            setShiftOnStock('');
        }
        else {
            setShiftOnStock(shift);
        }
    }

    async function openShift() {
        let selectedRows = [];
        Object.entries(employeeSelectionFlag).forEach(value => value[1] && selectedRows.push(value[0]));

        values.employees = selectedRows;

        values.openingDateAndTime = new Date(values.openingDateAndTime).toISOString();

        let data = await ShiftService.openShift(values);

        if (data) {
            updateSelectionFlags(employeeSelectionFlag);

            values.dayOrNight = '';
            values.openingDateAndTime = '';

            forceUpdate();

            getShift(selectedStock.value);
        }
    }

    async function editShift() {
        let selectedRows = [];
        Object.entries(employeeSelectionFlag).forEach(value => value[1] && selectedRows.push(value[0]));

        editedShiftOnStock.employees = selectedRows;

        if (editedShiftOnStock.employees.length === 0) {
            alert('Ошибка. Необходимо выбрать хотя бы одного работника.')
            return;
        }

        const shiftId = editedShiftOnStock.shiftId;
        const newValues = {
            dayOrNight: editedShiftOnStock.dayOrNight,
            employees: editedShiftOnStock.employees
        }

        let data = await ShiftService.editShift(shiftId, newValues);

        if (data) {
            getShift(selectedStock.value);
        }
    }

    useEffect(() => {
        getTableOfEmployees();
    }, [])

    useEffect(() => {
        if (!isModalCloseActive && selectedStock.value !== '') {
            getShift(selectedStock.value);
        }
    }, [isModalCloseActive])

    const handleRowCheckboxChange = e => {
        setEmployeeSelectionFlag({...employeeSelectionFlag, [e.target.name]: e.target.checked});
    }

    const handleChange = (field, value) => {
        if (field === 'stockId') {
            setSelectedStock(value);

            updateSelectionFlags(employeeSelectionFlag);

            setValues({...values, [field]: value.value});

            if (value.value !== '') {
                getShift(value.value);
            }
        }
        else {
            if (isShiftEditingActive) {
                setEditedShiftOnStock({...editedShiftOnStock, [field]: value});
            }
            else {
                setValues({...values, [field]: value});
            }
        }
    }

    const handleClick = () => {
        let numberOfSelectedEmployees = 0;
        Object.values(employeeSelectionFlag).forEach(value => numberOfSelectedEmployees += value);

        if (values.stockId && numberOfSelectedEmployees > 0 && values.dayOrNight && values.openingDateAndTime) {
            openShift();
        }
        else {
            alert('Ошибка. Заполнены не все поля.')
        }
    }
    
    const handleEditClick = () => {
        if (!isShiftEditingActive) {
            setIsShiftEditingActive(true);

            updateSelectionFlags(employeeSelectionFlag);

            setEditedShiftOnStock({...shiftOnStock});
            
            shiftOnStock.employees.map(data => employeeSelectionFlag[data.employeeId] = true);
        }
        else {
            editShift();

            updateSelectionFlags(employeeSelectionFlag);

            setIsShiftEditingActive(false);
        }
    }
    
    const handleDeleteClick = () => {
        if (isShiftEditingActive) {
            updateSelectionFlags(employeeSelectionFlag);

            setIsShiftEditingActive(false);
        }
        else {
            setIsModalCloseActive(true);
        }
    }

    return (
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex items-center justify-between w-full mb-4'>
                <div className='inline-flex'>
                    {stocks &&
                    <div className='w-[290px] py-1 px-2'>
                        <Select defaultValue={selectedStock} styles={SELECT_STYLE} options={stocks} onChange={data => handleChange('stockId', data)}/>
                    </div>}

                    <div className='w-[150px] py-1 px-2'>
                        <Select defaultValue={selectedLink} styles={SELECT_STYLE} options={links} onChange={setSelectedLink}/>
                    </div>

                    <div className='flex items-center mx-2'>
                        <input type='checkbox' name='onlySelectedEmployeesFlag' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={() => setOnlySelectedEmployeesFlag(!onlySelectedEmployeesFlag)}/>
                        <label className='ml-2 whitespace-nowrap'>Только выбранные</label>
                    </div>
                </div>
                
                <div className='inline-flex items-center justify-center'>
                    <div className='py-1 px-2'> 
                        <input type='datetime-local' name='startOfLuchSeniority' className='py-1 px-3 border shadow-sm rounded' value={values.openingDateAndTime} onChange={e => handleChange('openingDateAndTime', e.target.value)} hidden={isShiftEditingActive}/>

                        <div className='flex flex-row items-center justify-center mt-1'>
                            <div className='flex items-center'>
                                <input type='radio' id='dayShift' name='shiftTime' value='Дневная' checked={((isShiftEditingActive && editedShiftOnStock.dayOrNight === 'Дневная') && true) || (values.dayOrNight === 'Дневная' && true)} onChange={e => handleChange('dayOrNight', e.target.value)}/>
                                <label className='ml-1 select-none'>Дневная</label>
                            </div>
                            <div className='flex items-center ml-5'>
                                <input type='radio' id='nightShift' name='shiftTime' value='Ночная' checked={((isShiftEditingActive && editedShiftOnStock.dayOrNight === 'Ночная') && true) || (values.dayOrNight === 'Ночная' && true)} onChange={e => handleChange('dayOrNight', e.target.value)}/>
                                <label className='ml-1 select-none'>Ночная</label>
                            </div>
                        </div>
                    </div>
                    
                    <div className=' py-1 px-2' hidden={isShiftEditingActive}>
                        <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={() => handleClick()}>
                            Открыть
                        </button>
                    </div>
                </div>
            </div>

            <div className='max-w-[95%] grid grid-rows-1 grid-flow-col auto-cols-max gap-14'>
                <div className=''>
                    {/* max-w-[95%] max-h-[535px] */}
                    <table className='block overflow-y-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                        <thead className='bg-slate-300'>
                            <tr className='text-base/5 text-left'>
                                <th className='px-4 py-2 text-center border-b-2'>#</th>
                                <th className='px-4 py-2 border-b-2 border-l-2'>
                                    ФИО
                                </th>
                            </tr>
                        </thead>

                        <tbody className='bg-slate-100'>
                            {
                                employees
                                ?.filter(data => {
                                    if (selectedStock.label === 'Все') {
                                        return data;
                                    }

                                    return data.stocks.some(stock => stock.stockId === selectedStock.value) && data;
                                })
                                ?.filter(data => {
                                    return selectedLink.label === 'Все' ? data : data.link === selectedLink.label;
                                })
                                ?.map((data, index) => (
                                    <tr key={index} className='hover:bg-slate-200' hidden={(onlySelectedEmployeesFlag && !employeeSelectionFlag[data.employeeId])}>
                                        <td className='px-4 py-[4px] pt-3 border-b-2'>
                                            <input type='checkbox' name={data.employeeId} className='w-5 h-5 bg-gray-100 border-gray-300 rounded' checked={employeeSelectionFlag[data.employeeId]} onChange={handleRowCheckboxChange}/>
                                        </td>
                                        <td className='px-4 py-[4px] border-b-2 border-l-2'>
                                            {`${data.surname} ${data.name} ${data.patronymic}`}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                
                {selectedStock.value !== '' &&
                                // justify-center max-h-[400px]
                <div className='flex flex-col items-center mt-20'>
                    <div className='flex items-center justify-center mb-2 text-lg'>
                        Открытая смена:
                    </div>

                    <table className='block overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                        <thead className='bg-slate-300'>
                            <tr className='text-base/5 text-left'>
                                <th className='px-4 py-2 border-b-2'>
                                    Время
                                </th>
                                <th className='px-4 py-2 border-b-2 border-l-2'>
                                    Сотрудники
                                </th>
                                <th className='px-4 py-2 border-b-2 border-l-2'/>
                            </tr>
                        </thead>
                        
                        <tbody className='bg-slate-100'>
                            {shiftOnStock ?
                            (<tr className='hover:bg-slate-200'>
                                <td className='px-4 py-[6px] border-b-2'>
                                    {shiftOnStock.dayOrNight}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    <ul className='list-disc pl-4'>
                                        {
                                            shiftOnStock.employees?.map((data, index) => (
                                                <li key={index}>
                                                    {data.fullName}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    <div className='flex'>
                                        {/* data-value={employees.shiftId} */}
                                        <button className='py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md select-none' onClick={handleEditClick}>
                                            {/* Изменить */}
                                            {isShiftEditingActive ? 'Сохранить' : 'Изменить'}
                                        </button>

                                        {/* data-value={JSON.stringify({data, index})} onClick={handleDeleteClick} */}
                                        <button className='ml-4 py-2 px-3 font-normal text-white bg-red-600 hover:bg-red-700 rounded-md select-none' onClick={handleDeleteClick}>
                                            {/* Закрыть */}
                                            {isShiftEditingActive ? 'Отменить' : 'Закрыть'}
                                        </button>
                                    </div>
                                </td>
                            </tr>) : 
                            (<tr>
                                <td colSpan={3} className='w-[400px] px-4 py-2 border-b-2'>
                                    <div className='flex items-center justify-center'>
                                        Открытые смены не найдены
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>}
            </div>

            {/* {isModalAddActive && <Modal setActive={setIsModalAddActive}>
                <ShiftAdd setActive={setIsModalAddActive} addValue={setNewVal}/>
            </Modal>} */}
            
            {/* {isModalEditActive && <Modal setActive={setIsModalEditActive}>
                <ShiftEdit rowData={selectedEmployeeData} setActive={setIsModalEditActive} changeValue={setNewVal}/>
            </Modal>} */}

            {isModalCloseActive && <Modal setActive={setIsModalCloseActive}>
                <ShiftClose shiftData={shiftOnStock} setActive={setIsModalCloseActive}/>
            </Modal>}
        </div>
    )
}

export default ShiftsPage