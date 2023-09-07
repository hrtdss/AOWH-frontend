import { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

import { SELECT_STYLE } from '../services/Constants';
import { EmployeeService } from '../services/EmployeeService'
import { ShiftService } from '../services/ShiftService';

import Modal from '../components/Modal';
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

    const [isModalCloseActive, setIsModalCloseActive] = useState(false);
    const [shiftСlosingIndicator, setShiftСlosingIndicator] = useState(false);

    const [dayLinkFlag, setDayLinkFlag] = useState(true);
    const [nightLinkFlag, setNightLinkFlag] = useState(true);
    const [onlySelectedEmployeesFlag, setOnlySelectedEmployeesFlag] = useState(false);

    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks')));
    const [selectedStock, setSelectedStock] = useState(stocks[0]);

    const [links, ] = useState([
        { value: 'Дневная', label: 'Дневная' },
        { value: 'Ночная', label: 'Ночная' }
    ]);
    const [selectedLink, setSelectedLink] = useState(links[0]);

    const [selectedDateAndTime, setSelectedDateAndTime] = useState('');

    const [employees, setEmployees] = useState([]);
    const [employeeSelectionFlag, setEmployeeSelectionFlag] = useState([]);

    const [stockShifts, setStockShifts] = useState([]);

    const [selectedShift, setSelectedShift] = useState('');

    const [activeShift, setActiveShift] = useState('');
    const [editedActiveShift, setEditedActiveShift] = useState('');

    const [isShiftEditingActive, setIsShiftEditingActive] = useState(false);

    async function getTableOfEmployees() {
        const employees = await EmployeeService.getListOfEmployees();

        if (employees) {            
            const notTerminatedEmployees = [];
            const employeeFlags = [];

            for (let employee of employees) {
                if (!employee.dateOfTermination) {
                    notTerminatedEmployees.push(employee);
                    employeeFlags.push(employee.employeeId);
                }
            }

            setEmployees(notTerminatedEmployees);

            const obj = {};
            employeeFlags.forEach(element => {
                obj[`${element}`] = false;
            });

            setEmployeeSelectionFlag(obj);
        }
    }

    async function getShifts(stockId) {
        let pastShifts = await ShiftService.getPastShifts(stockId) || [];

        const activeShift = await ShiftService.getListOfOpenShifts(stockId);

        if (activeShift === 'Смена не найдена') {
            setActiveShift('');
        }
        else {
            setActiveShift(activeShift);
            !shiftСlosingIndicator && setSelectedShift(activeShift);

            pastShifts.push(activeShift);
        }

        setStockShifts(pastShifts);
    }

    async function openShift() {
        let selectedRows = [];
        Object.entries(employeeSelectionFlag).forEach(value => value[1] && selectedRows.push(value[0]));

        const values = {
            stockId: selectedStock.value,
            employees: selectedRows,
            dayOrNight: selectedLink.value,
            openingDateAndTime: new Date(selectedDateAndTime).toISOString(),
        };

        const data = await ShiftService.openShift(values);

        if (data) {
            values.openingDateAndTime = '';

            updateSelectionFlags(employeeSelectionFlag);

            getShifts(selectedStock.value);
        }
    }

    async function editShift() {
        let selectedRows = [];
        Object.entries(employeeSelectionFlag).forEach(value => value[1] && selectedRows.push(value[0]));

        editedActiveShift.employees = selectedRows;

        if (editedActiveShift.employees.length === 0) {
            alert('Ошибка. Необходимо выбрать хотя бы одного работника.')
            return;
        }

        const shiftId = editedActiveShift.shiftId;
        const newValues = {
            dayOrNight: editedActiveShift.dayOrNight.value,
            employees: editedActiveShift.employees
        }

        const data = await ShiftService.editShift(shiftId, newValues);

        if (data) {
            let newListOfEmployees = [];
            for (let val of selectedRows) {
                employees.some(data => {
                    return val === data.employeeId && newListOfEmployees.push({ 
                        employeeId: data.employeeId,
                        fullName: `${data.surname} ${data.name} ${data.patronymic}`
                    })
                });
            }

            selectedShift.value.dayOrNight = newValues.dayOrNight;
            selectedShift.value.employees = newListOfEmployees;

            forceUpdate();
        }
    }

    useEffect(() => {
        getTableOfEmployees();
    }, [])

    useEffect(() => {
        getShifts(selectedStock.value);
    }, [selectedStock.value])

    useEffect(() => {
        if (shiftСlosingIndicator) {
            getShifts(selectedStock.value);
            setSelectedShift(stockShifts[stockShifts.length - 1]);

            setShiftСlosingIndicator(false);
        }
    }, [shiftСlosingIndicator, stockShifts])

    const handleRowCheckboxChange = e => {
        setEmployeeSelectionFlag({...employeeSelectionFlag, [e.target.name]: e.target.checked});
    }

    const handleChange = (field, value) => {
        if (isShiftEditingActive) {
            setEditedActiveShift({...editedActiveShift, [field]: value});
            return;
        }

        if (field === 'stockId') {
            updateSelectionFlags(employeeSelectionFlag);

            setSelectedShift('');
            setSelectedStock(value);
        }
        else if (field === 'dayOrNight') {
            setSelectedLink(value);
        }
        else if (field === 'openingDateAndTime') {
            setSelectedDateAndTime(value);
        }
    }

    const handleClick = () => {
        let numberOfSelectedEmployees = 0;
        Object.values(employeeSelectionFlag).forEach(value => numberOfSelectedEmployees += value);

        if (numberOfSelectedEmployees > 0 && selectedDateAndTime) {
            openShift();
        }
        else if (numberOfSelectedEmployees > 0 && !selectedDateAndTime) {
            alert('Ошибка. Необходимо указать дату и время.');
        }
        else if (numberOfSelectedEmployees === 0 && selectedDateAndTime) {
            alert('Ошибка. Необходимо выбрать хотя бы одного работника.');
        }
        else {
            alert('Ошибка. Необходимо указать дату и время, а также выбрать хотя бы одного работника.');
        }
    }
    
    const handleEditClick = () => {
        if (!isShiftEditingActive) {
            setIsShiftEditingActive(true);

            updateSelectionFlags(employeeSelectionFlag);

            const values = {
                shiftId: selectedShift.value.shiftId,
                employees: selectedShift.value.employees,
                dayOrNight: { label: selectedShift.value.dayOrNight, value: selectedShift.value.dayOrNight }
            }
            setEditedActiveShift(values);
            
            selectedShift.value.employees.map(data => employeeSelectionFlag[data.employeeId] = true);
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
            <div className='flex items-center justify-between w-full mb-6'>
                <div className='inline-flex'>
                    <div className='flex items-center mx-2'>
                        <input type='checkbox' name='dayShift' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' defaultChecked={true} onChange={() => setDayLinkFlag(!dayLinkFlag)}/>
                        <label className='ml-2 whitespace-nowrap'>Дневная смена</label>
                    </div>

                    <div className='flex items-center mx-2'>
                        <input type='checkbox' name='nightShift' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' defaultChecked={true} onChange={() => setNightLinkFlag(!nightLinkFlag)}/>
                        <label className='ml-2 whitespace-nowrap'>Ночная смена</label>
                    </div>

                    <div className='flex items-center mx-2'>
                        <input type='checkbox' name='onlySelectedEmployeesFlag' className='w-5 h-5 bg-gray-100 border-gray-300 rounded' onChange={() => setOnlySelectedEmployeesFlag(!onlySelectedEmployeesFlag)}/>
                        <label className='ml-2 whitespace-nowrap'>Только выбранные</label>
                    </div>
                </div>
                
                <div className='flex-col items-center justify-center'>
                    <div className='py-1 px-2'>
                        <div className='py-1'>
                            <input type='datetime-local' name='startOfLuchSeniority' className='w-full py-1 px-3 border shadow-sm rounded' value={selectedDateAndTime} onChange={e => handleChange('openingDateAndTime', e.target.value)} hidden={isShiftEditingActive}/>
                        </div>
                        
                        {stocks &&
                        <div className='w-[270px] py-1'>
                            <Select styles={SELECT_STYLE} options={stocks} value={selectedStock} onChange={data => handleChange('stockId', data)} isDisabled={isShiftEditingActive}/>
                        </div>}

                        <div className='w-full py-1'>
                            <Select styles={SELECT_STYLE} options={links} value={!isShiftEditingActive ? selectedLink : editedActiveShift.dayOrNight} onChange={data => handleChange('dayOrNight', data)}/>
                        </div>

                        <div className='py-1' hidden={isShiftEditingActive}>
                            <button className='w-full px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={() => handleClick()}>
                                Открыть
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-[95%] grid grid-rows-1 grid-flow-col auto-cols-max gap-10'>
                <div className=''>
                    <table className='block overflow-y-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                        <thead className='bg-slate-300'>
                            <tr className='text-base/5 text-left'>
                                <th className='w-[53px] px-4 py-2 text-center border-b-2'>#</th>
                                <th className='min-w-[350px] px-4 py-2 border-b-2 border-l-2'>
                                    ФИО
                                </th>
                            </tr>
                        </thead>

                        <tbody className='bg-slate-100'>
                            {
                                employees
                                ?.filter(data => {
                                    return data.stocks.some(stock => stock.stockId === selectedStock.value) && data;
                                })
                                ?.filter(data => {
                                    return (data.link === 'Дневная' && dayLinkFlag) || (data.link === 'Ночная' && nightLinkFlag);
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
                
                <div className='flex flex-col items-center'>
                    <div className='min-w-[350px] w-full mt-[2px] mb-2'>
                        <Select placeholder='Выберите смену' styles={SELECT_STYLE} options={stockShifts} value={selectedShift} onChange={setSelectedShift} isDisabled={isShiftEditingActive}/>
                    </div>
                    
                    {selectedShift &&
                    <div>
                        <div className='flex items-center justify-center mb-2 text-lg'>
                            Выбранная смена:
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

                                    {selectedShift.label === activeShift.label &&
                                    <th className='w-[229px] px-2 py-2 border-b-2 border-l-2'/>}
                                </tr>
                            </thead>

                            <tbody className='bg-slate-100'>
                                <tr className='hover:bg-slate-200'>
                                    <td className='px-4 py-[6px] border-b-2'>
                                        {selectedShift.value.dayOrNight}
                                    </td>
                                    <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                        <ul className='list-disc pl-4'>
                                            {
                                                selectedShift.value.employees?.map((data, index) => (
                                                    <li key={index}>
                                                        {data.fullName}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </td>

                                    {selectedShift.label === activeShift.label &&
                                    <td className='px-2 py-[6px] border-b-2 border-l-2'>
                                        <div className='flex justify-center'>
                                            <button className='py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md select-none' onClick={handleEditClick}>
                                                {isShiftEditingActive ? 'Сохранить' : 'Изменить'}
                                            </button>
                                            <button className='ml-2 py-2 px-3 font-normal text-white bg-red-600 hover:bg-red-700 rounded-md select-none' onClick={handleDeleteClick}>
                                                {isShiftEditingActive ? 'Отменить' : 'Закрыть'}
                                            </button>
                                        </div>
                                    </td>}
                                </tr>
                            </tbody>
                        </table>
                    </div>}
                </div>
            </div>

            {isModalCloseActive && <Modal setActive={setIsModalCloseActive} modalHeader={`Закрытие смены (${selectedShift.value.dayOrNight})`}>
                <ShiftClose shiftData={selectedShift.value} setActive={setIsModalCloseActive} indicator={setShiftСlosingIndicator}/>
            </Modal>}
        </div>
    )
}

export default ShiftsPage