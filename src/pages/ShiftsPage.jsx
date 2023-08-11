import { useEffect, useState } from 'react';

import { EmployeeService } from "../services/EmployeeService"


const ShiftsPage = () => {
    const [stockEmployees, setStockEmployees] = useState([]);

    // const [stockId, setStockId] = useState(localStorage.getItem('stockId'));


    async function getListOfEmployees() {
        let employees = await EmployeeService.getListOfEmployees();

        if (employees) {
            const stockId = 6; // localStorage.getItem('stockId');

            let requiredEmployees = [];
            for (let employee of employees) {
                if (employee.stocks[0].stockId === stockId) {
                    requiredEmployees.push(employee);
                }
            }

            setStockEmployees(requiredEmployees);
        }
    }

    useEffect(() => {
        getListOfEmployees();
    }, [])

    console.log(stockEmployees);

    return (
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex justify-center w-full mb-4'>
                {/* onClick={() => setModalAddActive(true)} */}
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md'>
                    Добавить
                </button>
            </div>

            <table className='block max-w-[95%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                <thead className='bg-slate-300'>
                    <tr className='text-base/5 text-left'>
                        <th className='px-4 py-2 border-b-2'>
                            ФИО
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            Склад
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            Звено
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            {/* <input placeholder='Поиск по сотрудникам' className='px-3 py-1 rounded-md' onChange={e => setSearch(e.target.value)}/>  */}
                        </th>
                    </tr>
                </thead>

                {/* <tbody className='bg-slate-100'>
                    {
                        rows
                        .filter(data => {
                            return data.surname.toLowerCase().includes(search.toLowerCase()) ||
                                    data.name.toLowerCase().includes(search.toLowerCase()) ||
                                    data.patronymic.toLowerCase().includes(search.toLowerCase());
                        })
                        .map((data, index) => (
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
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody> */}
            </table>

            {/* {modalAddActive && <Modal setActive={setModalAddActive}>
                <EmployeeAdd setActive={setModalAddActive} addValue={setNewVal}/>
            </Modal>} */}

            {/* {modalEditActive && <Modal setActive={setModalEditActive}>
                <EmployeeEdit rowData={selectedEmployeeData} setActive={setModalEditActive} changeValue={setNewVal}/>
            </Modal>} */}
        </div>
    )
}

export default ShiftsPage