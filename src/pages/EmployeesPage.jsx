import { useEffect, useState } from 'react';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';

import { EmployeeService } from '../services/EmployeeService';
import { StockService } from '../services/StockService';

import Modal from '../components/Modal';
import EmployeeAdd from '../components/Employees/EmployeeAdd';
import EmployeeEdit from '../components/Employees/EmployeeEdit';


let selectedEmployeeData;

const EmployeesPage = () => {
    const [modalAddActive, setModalAddActive] = useState(false);
    const [modalEditActive, setModalEditActive] = useState(false);

    // const [selectedStock, setSelectedStock] = useState('');
    // const [selectedStockLink, setSelectedStockLink] = useState('');
    const [stocks, setStocks] = useState(JSON?.parse(sessionStorage.getItem('stocks'))); // []   
    // const [stockLinks, setStockLinks] = useState([]);

    const [rows, setRows] = useState([]);

    const [newVal, setNewVal] = useState([]);

    const [search, setSearch] = useState('');
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
        let data = await EmployeeService.getListOfEmployees();

        if (data) {
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

    useEffect(() => {
        let storageContent = sessionStorage.getItem('stocks');

        if (!storageContent) {
            let list = StockService.getListOfStocks();
            list.then(data => {
                sessionStorage.setItem('stocks', JSON.stringify(data));
                setStocks(data);
            });
        }
    }, [stocks])

    const handleClick = async e => {
        const employeeId = e.currentTarget.getAttribute("data-value"); 

        selectedEmployeeData = await EmployeeService.getDataByEmployeeId(employeeId);

        setModalEditActive(true);
    };

    return (
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex items-center justify-between w-full mb-4'>
                {/* value={selectedStock} onChange={e => setSelectedStock(e.target.value)} */}
                <select name='stock' className='h-[34px] py-1 px-2 shadow-sm border rounded'>
                    <option value=''></option>
                    {
                        stocks?.map((data, index) =>
                            <option key={index} value={data.stockId}>
                                {data.stockName}
                            </option>
                        )
                    }
                </select>

                {/* <select name='link' className='w-[204px] h-[34px] py-1 px-2 shadow-sm border rounded'>
                    <option value=''></option>
                    {
                        links?.map((data, index) =>
                            <option key={index} value={data}>
                                {data}
                            </option>
                        )
                    }
                </select> */}
                
                {/* <input list='stock' name='stock' placeholder='Выбрать склад' className='max-w-[204px] py-1 px-3 shadow border rounded'/>
                <datalist id='stock'>
                    {
                        stocks?.map((data, index) =>
                            <option key={index}>
                                {data.stockName}
                            </option>
                        )
                    }
                </datalist> */}

                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md' onClick={() => setModalAddActive(true)}>
                    Добавить
                </button>
            </div>

            {/* <p className='mb-4'>Выбранный склад: {selectedStock} <br/> Выбранное звено: {selectedStockLink}</p> */}

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
                            Звено
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            <input placeholder='Поиск по сотрудникам' className='px-3 py-1 rounded-md' onChange={e => setSearch(e.target.value)}/> 
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-slate-100'>
                    {
                        rows
                        ?.filter(data => {
                            return data.surname.toLowerCase().includes(search.toLowerCase()) ||
                                    data.name.toLowerCase().includes(search.toLowerCase()) ||
                                    data.patronymic.toLowerCase().includes(search.toLowerCase());
                        })
                        ?.map((data, index) => (
                            <tr key={index} className='hover:bg-slate-200'>
                                <td className='px-4 py-[6px] border-b-2'>
                                    {`${data.surname} ${data.name} ${data.patronymic}`}
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
                                    <div className="flex items-center justify-center">
                                        <button className='py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md' data-value={data.employeeId} onClick={handleClick}>
                                            Изменить
                                        </button>
                                        {/* <button className='bg-red-600 hover:bg-red-800 text-white font-normal ml-4 py-2 px-3 rounded-md'>
                                            Уволить
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            {modalAddActive && <Modal setActive={setModalAddActive}>
                <EmployeeAdd setActive={setModalAddActive} addValue={setNewVal}/>
            </Modal>}

            {modalEditActive && <Modal setActive={setModalEditActive}>
                <EmployeeEdit rowData={selectedEmployeeData} setActive={setModalEditActive} changeValue={setNewVal}/>
            </Modal>}
        </div>
    )
}

export default EmployeesPage