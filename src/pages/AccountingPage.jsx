import { useState } from 'react';
import Select from 'react-select';

import { AccountingService } from '../services/AccountingService';
import { SELECT_STYLE } from '../services/Constants';

import AccountingCell from '../components/Accounting/AccountingCell';
import Modal from '../components/Modal';
import AccountingPenaltiesAndSends from '../components/Accounting/AccountingPenaltiesAndSends';


const AccountingPage = () => {
    const [savedRows, ] = useState(JSON?.parse(localStorage.getItem('savedAccounting')) ?? '');

    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks'))); 
    const [selectedStock, setSelectedStock] = useState(savedRows?.stock ?? stocks[0]);

    const [savedMonthAndYear, ] = useState(savedRows?.date ?? '');
    const [selectedMonthAndYear, setSelectedMonthAndYear] = useState((savedMonthAndYear && `${savedMonthAndYear[0]}-${savedMonthAndYear[1] < 10 ? '0' + savedMonthAndYear[1] : savedMonthAndYear[1]}`) ?? '');

    const [rows, setRows] = useState(savedRows === '' ? [] : savedRows?.data.length > 0 ? savedRows.data : '');

    async function getTableOfAccounting() {
        if (!selectedMonthAndYear) {
            alert('Ошибка. Для получение информации необходимо указать месяц и год.')
            return;
        }

        const selectedDate = new Date(selectedMonthAndYear);
        
        const data = await AccountingService.getAccounting(selectedDate.getFullYear(), 1 + selectedDate.getMonth(), selectedStock.value);

        if (data.length > 0) {
            setRows(data);
        }
        else {
            setRows('');
        }
    }

    async function handleCellChange(fieldName, employeeIndex, employeeId, value) {
        if (value === rows[employeeIndex][fieldName]) {
            return;
        }

        const date = selectedMonthAndYear.split('-');
        const values = {
            employeeId,
            year: Number(date[0]),
            month: Number(date[1]),
            mentoring: fieldName === 'mentoring' ? Number(value) : -1,
            teaching: fieldName === 'teaching' ? Number(value) : -1,
            bonus: fieldName === 'bonus' ? Number(value) : -1,
            vacation: fieldName === 'vacation' ? Number(value) : -1,
            advance: fieldName === 'advance' ? Number(value) : -1
        };

        const data = await AccountingService.updateEmployeeAccounting(employeeIndex, fieldName, values);

        if (data) {
            rows[employeeIndex][fieldName] = value;
        }
    }

    const [isModalPenaltiesOrSendsActive, setIsModalPenaltiesOrSendsActive] = useState(false);

    const [selectedEmployeeAccounting, setSelectedEmployeeAccounting] = useState('');

    const handlePenaltiesOrSendsClick = (e) => {
        const employeeId = e.currentTarget.getAttribute('data-value'); 

        // const employeeData = await EmployeeService.getDataByEmployeeId(employeeId);
        // setSelectedEmployeeAccounting(employeeData);

        setIsModalPenaltiesOrSendsActive(true);
    }

    return (
        <div className='flex flex-col items-center h-full mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex items-center justify-between w-full max-w-[1300px] mb-4'>  
                <div className='inline-flex'>           
                    {stocks &&
                    <div className='w-[290px] py-1 px-2'>
                        <Select defaultValue={selectedStock} styles={SELECT_STYLE} options={stocks} onChange={setSelectedStock}/>
                    </div>}
                    
                    <div className='py-1 px-2'>
                        <input type='month' name='monthAndYear' className='py-1 px-3 border shadow-sm rounded' value={selectedMonthAndYear} onChange={e => setSelectedMonthAndYear(e.target.value)}/>
                    </div>
                </div>  

                <div className='py-1 px-2'>
                    <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={() => getTableOfAccounting()}>
                        Загрузить
                    </button>
                </div>
            </div>

            {rows === '' ?
            <div className='mt-10 font-bold'>
                Информация за указанный месяц и год отсутствует
            </div> : 
            rows.length > 0 &&
            <table className='block max-w-[99%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap select-none'>
                <thead className='bg-slate-300'>
                    <tr className='text-base/5 text-left'>
                        <th className='px-2 py-1 border-b-2'>
                            ФИО
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Должность
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            ЗП, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Переработано <br/> часов ДН
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Переработано <br/> часов НЧ
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Ставка, <br/> ч
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Ставка, <br/> смн
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Стаж, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Наставник, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Обучение, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Премия, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Отпуск, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            К выплате, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Аванс, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Штрафы, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Засылы, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Итого к <br/> выплате
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-slate-100'>
                    {
                        rows
                        ?.map((data, index) => (
                            <tr key={index} className='hover:bg-slate-200'>
                                <td className='px-2 py-[6px] border-b-2'>
                                    {data.fullName}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.positionName}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.salary.toFixed(2)}
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.overtimeDay}
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.overtimeNight}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.salaryForHour.toFixed(2)}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.salaryForShift.toFixed(2)}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.seniority.toFixed(2)}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'mentoring'} employeeIndex={index} employeeId={data.employeeId} value={data.mentoring.toFixed(2)} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'teaching'} employeeIndex={index} employeeId={data.employeeId} value={data.teaching.toFixed(2)} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'bonus'} employeeIndex={index} employeeId={data.employeeId} value={data.bonus.toFixed(2)} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'vacation'} employeeIndex={index} employeeId={data.employeeId} value={data.vacation.toFixed(2)} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.earned.toFixed(2)}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'advance'} employeeIndex={index} employeeId={data.employeeId} value={data.advance.toFixed(2)} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2' data-value={data.employeeId} onClick={handlePenaltiesOrSendsClick}>
                                    {data.penalties.toFixed(2)}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2' data-value={data.employeeId} onClick={handlePenaltiesOrSendsClick}>
                                    {data.sends.toFixed(2)}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.payment.toFixed(2)}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>}

            {isModalPenaltiesOrSendsActive && <Modal setActive={setIsModalPenaltiesOrSendsActive} modalHeader={'Штрафы и засылы'}>
                <AccountingPenaltiesAndSends rowData={selectedEmployeeAccounting} setActive={setIsModalPenaltiesOrSendsActive} addValue={1}/>
            </Modal>}
        </div>
    )
}

export default AccountingPage