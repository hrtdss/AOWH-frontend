import { useState } from 'react';
import Select from 'react-select';

import { AccountingService } from '../services/AccountingService';
import { SELECT_STYLE } from '../services/Constants';
import { Tooltip } from '../services/Tooltip';

import AccountingCell from '../components/Accounting/AccountingCell';
import Modal from '../components/Modal';
import AccountingPenaltiesAndSends from '../components/Accounting/AccountingPenaltiesAndSends';

// import { AiOutlineInfoCircle } from "react-icons/ai";


const AccountingPage = () => {
    const [savedRows, ] = useState(JSON?.parse(localStorage.getItem('savedAccounting')) ?? '');

    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks'))); 
    const [selectedStock, setSelectedStock] = useState(savedRows?.stock ?? stocks[0]);

    const [savedMonthAndYear, ] = useState(savedRows?.date ?? ''); 
    const [selectedMonthAndYear, setSelectedMonthAndYear] = useState((savedMonthAndYear && `${savedMonthAndYear[0]}-${savedMonthAndYear[1].toString().padStart(2, '0')}`) || `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`);

    const [rows, setRows] = useState(savedRows === '' ? [] : savedRows?.data.length > 0 ? savedRows.data : '');

    async function getTableOfAccounting() {
        // if (!selectedMonthAndYear) {
        //     alert('Ошибка. Для получение информации необходимо указать месяц и год.')
        //     return;
        // }

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
                    <button className='px-3 py-[6px] font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={() => getTableOfAccounting()}>
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
                            {/* Ставка, <br/> ч */}
                            <Tooltip text={'Формула расчета стоимости ставки за час'}>
                                <p>Ставка, <br/> руб. ч</p>
                            </Tooltip>
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            <Tooltip text={'Формула расчета стоимости ставки за смену'}>
                                <p>Ставка, <br/> руб. смн</p>
                                {/* <AiOutlineInfoCircle size={15} className='absolute top-[-10px] left-[2px]'/> */}
                            </Tooltip>
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
                            {/* К выплате, <br/> руб. */}
                            <Tooltip text={'Формула расчета '}>
                                <p>К выплате, <br/> руб.</p>
                            </Tooltip>
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
                            {/* Итого к <br/> выплате */}
                            <Tooltip text={'Формула расчета'}>
                                <p>Итого к <br/> выплате</p>
                            </Tooltip>
                        </th>
                    </tr>
                </thead>

                <tbody className='text-sm bg-slate-100'>
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
                                    {data.salary}
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.overtimeDay}
                                </td>
                                <td className='px-4 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.overtimeNight}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.salaryForHour}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.salaryForShift}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.seniority}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'mentoring'} employeeIndex={index} employeeId={data.employeeId} value={data.mentoring} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'teaching'} employeeIndex={index} employeeId={data.employeeId} value={data.teaching} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'bonus'} employeeIndex={index} employeeId={data.employeeId} value={data.bonus} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'vacation'} employeeIndex={index} employeeId={data.employeeId} value={data.vacation} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.earned}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    <AccountingCell fieldName={'advance'} employeeIndex={index} employeeId={data.employeeId} value={data.advance} onChange={handleCellChange}/>
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2' data-value={data.employeeId} onClick={handlePenaltiesOrSendsClick}>
                                    {data.penalties}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2' data-value={data.employeeId} onClick={handlePenaltiesOrSendsClick}>
                                    {data.sends}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.payment}
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