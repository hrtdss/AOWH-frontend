import { useEffect, useState } from 'react';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';
import Select from 'react-select';

import { SELECT_STYLE } from '../services/Constants';
import { EmployeeService } from '../services/EmployeeService';

import Modal from '../components/Modal';
import EmployeeAdd from '../components/Employees/EmployeeAdd';
import EmployeeEdit from '../components/Employees/EmployeeEdit';
import EmployeeTerminate from '../components/Employees/EmployeeTerminate';
import EmployeeRestore from '../components/Employees/EmployeeRestore';


const EmployeesPage = () => {
    const [isModalAddActive, setIsModalAddActive] = useState(false);
    const [isModalEditActive, setIsModalEditActive] = useState(false);
    const [isModalTerminationActive,setIsModalTerminationActive] = useState(false);
    const [isModalRestoreActive,setIsModalRestoreActive] = useState(false);

    const [stocks, setStocks] = useState(JSON?.parse(localStorage.getItem('employeeStocks'))); 
    const [links, ] = useState([
        { value: '', label: 'Все' },
        { value: 'Дневная', label: 'Дневная' },
        { value: 'Ночная', label: 'Ночная' }
    ]);

    const [selectedStock, setSelectedStock] = useState(stocks.length >= 2 ? {value: '', label: 'Все'} : stocks[0]);
    const [selectedLink, setSelectedLink] = useState(links[0]);

    const [rows, setRows] = useState([]);

    const [selectedEmployeeData, setSelectedEmployeeData] = useState('');
    const [newVal, setNewVal] = useState([]);

    const [employeeSearch, setEmployeeSearch] = useState('');
    const [order, setOrder] = useState('');

    const sortColumn = column => {
        if (order === 'DESC') {
            const sorted = rows.sort((a, b) =>
                a[column].toLowerCase() > b[column].toLowerCase() ? 1 : -1
            );

            setOrder('ASC');
            setRows(sorted);

            return;
        }

        const sorted = rows.sort((a, b) =>
            a[column].toLowerCase() > b[column].toLowerCase() ? -1 : 1
        );

        setOrder('DESC');
        setRows(sorted);
    }

    async function getTableOfEmployees() {
        const data = await EmployeeService.getListOfEmployees();

        if (data) {
            if (stocks.length >= 2) { 
                setStocks([{value: '', label: 'Все'}, ...stocks]);
            }

            setRows(data);
        }
    }

    useEffect(() => {
        if (newVal.employeeId) {
            const index = rows.findIndex(value => value.employeeId === newVal.employeeId);
            
            if (index !== -1) {
                const pastRowValues = [...rows];
                pastRowValues[index] = newVal;

                setRows(pastRowValues);
            }
            else {
                const newRowValues = [...rows, newVal];
                setRows(newRowValues);
            }
        }
        else {
            getTableOfEmployees();
        }
    }, [newVal])
    
    const handleEditClick = async e => {
        const employeeId = e.currentTarget.getAttribute('data-value'); 

        const employeeData = await EmployeeService.getDataByEmployeeId(employeeId);
        setSelectedEmployeeData(employeeData);

        setIsModalEditActive(true);
    };

    const handleTerminationClick = e => {
        const employeeId = e.currentTarget.getAttribute('data-value'); 

        setSelectedEmployeeData(employeeId);

        setIsModalTerminationActive(true);
    };

    const handleRestoreClick = async e => {
        const employeeId = e.currentTarget.getAttribute('data-value'); 

        const employeeData = await EmployeeService.getDataByEmployeeId(employeeId);
        setSelectedEmployeeData(employeeData);

        setIsModalRestoreActive(true);
    };

    return (
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex items-center justify-between w-full mb-4'>
                <div className='inline-flex'> 
                    {stocks &&
                    <div className='w-[290px] py-1 px-2'>
                        <Select defaultValue={selectedStock} styles={SELECT_STYLE} options={stocks} onChange={setSelectedStock}/>
                    </div>}

                    <div className='w-[150px] py-1 px-2'>
                        <Select defaultValue={selectedLink} styles={SELECT_STYLE} options={links} onChange={setSelectedLink}/>
                    </div>
                </div>

                <div className='py-1 px-2'>
                    <button className='mx-2 px-3 py-[6px] font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={() => setIsModalAddActive(true)}>
                        Добавить
                    </button>
                </div>
            </div>

            <table className='block max-w-[95%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                <thead className='bg-slate-300'>
                    <tr className='text-base/5 text-left'>
                        <th className='px-4 py-2 border-b-2' onClick={() => sortColumn('surname')}>
                            <span className='flex flex-row justify-between'>
                                ФИО
                                {order === 'ASC' ? <GoTriangleUp size={20}/> : order === 'DESC' ? <GoTriangleDown size={20}/> : ''}
                            </span>
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            Склад
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            Смена
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            <input placeholder='Поиск по сотрудникам' className='px-3 py-1 font-normal rounded-md' onChange={e => setEmployeeSearch(e.target.value)}/> 
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-slate-100'>
                    {
                        rows
                        ?.filter(data => {
                            return data.surname.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                                    data.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                                    data.patronymic.toLowerCase().includes(employeeSearch.toLowerCase());
                        })
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
                            <tr key={index} className='hover:bg-slate-200'>
                                <td className='px-4 py-[6px] border-b-2'>
                                    {!data.dateOfTermination ?
                                    `${data.surname} ${data.name} ${data.patronymic}` :
                                    <div className='flex flex-row items-center justify-between'>
                                        {`${data.surname} ${data.name} ${data.patronymic}`}
                                        <div className='ml-10 font-bold text-red-600 select-none'>
                                            Уволен
                                        </div>
                                    </div>}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {
                                        data.stocks.map((stockData, stockIndex) => (
                                            <ul key={stockIndex} className='list-disc pl-4'>
                                                <li>
                                                    {stockData.stockName}
                                                </li>
                                            </ul>
                                        ))
                                    }
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.link}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {!data.dateOfTermination ?
                                    <div className='flex items-center justify-center'>
                                        <button id='edit' className='py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md select-none' data-value={data.employeeId} onClick={handleEditClick}>
                                            Изменить
                                        </button>
                                        <button className='ml-4 py-2 px-3 font-normal text-white bg-red-600 hover:bg-red-700 rounded-md select-none' data-value={data.employeeId} onClick={handleTerminationClick}>
                                            Уволить
                                        </button>
                                    </div> :
                                    <div className='flex items-center justify-center'>
                                        <button id='restore' className='w-full py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md select-none' data-value={data.employeeId} onClick={handleRestoreClick}>
                                            Восстановить
                                        </button>
                                    </div>}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {isModalAddActive && <Modal setActive={setIsModalAddActive} modalHeader={'Добавление сотрудника'}>
                <EmployeeAdd setActive={setIsModalAddActive} addValue={setNewVal}/>
            </Modal>}

            {isModalEditActive && <Modal setActive={setIsModalEditActive} modalHeader={'Редактирование личных данных сотрудника'}>
                <EmployeeEdit rowData={selectedEmployeeData} setActive={setIsModalEditActive} changeValue={setNewVal}/>
            </Modal>}

            {isModalTerminationActive && <Modal setActive={setIsModalTerminationActive} modalHeader={'Увольнение сотрудника'}>
                <EmployeeTerminate employeeId={selectedEmployeeData} setActive={setIsModalTerminationActive}/>
            </Modal>}

            {isModalRestoreActive && <Modal setActive={setIsModalRestoreActive} modalHeader={'Восстановление сотрудника'}>
                <EmployeeRestore rowData={selectedEmployeeData} setActive={setIsModalRestoreActive} changeValue={setNewVal}/>
            </Modal>}
        </div>
    )
}

export default EmployeesPage