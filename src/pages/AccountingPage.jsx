import { useState } from 'react';
import Select from 'react-select';

import { AccountingService } from '../services/AccountingService';
import { SELECT_STYLE } from '../services/Constants';


const AccountingPage = () => {
    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks'))); 
    const [selectedStock, setSelectedStock] = useState(JSON?.parse(localStorage.getItem('savedAccounting'))?.stock || stocks[0]);

    const [savedMonthAndYear, ] = useState(JSON?.parse(localStorage.getItem('savedAccounting'))?.date || '');
    const [selectedMonthAndYear, setSelectedMonthAndYear] = useState((savedMonthAndYear && `${savedMonthAndYear[0]}-${savedMonthAndYear[1] < 10 ? '0' + savedMonthAndYear[1] : savedMonthAndYear[1]}`) || '');

    const [savedRows, ] = useState(JSON?.parse(localStorage.getItem('savedAccounting'))?.data || '');
    const [rows, setRows] = useState(savedRows === '' ? [] : savedRows.length > 0 ? savedRows : '');

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
                        <th className='px-1 py-1 border-b-2 border-l-2'>
                            Должность
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
                            ЗП, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Аванс, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Штраф, <br/> руб.
                        </th>
                        <th className='px-1 py-1 text-center border-b-2 border-l-2'>
                            Засыл, <br/> руб.
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
                                <td className='px-1 py-[6px] border-b-2 border-l-2'>
                                    {data.positionName}
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
                                    {data.mentoring}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.teaching}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.bonus}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.vacation}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.earned}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.advance}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
                                    {data.penalties}
                                </td>
                                <td className='px-1 py-[6px] text-center border-b-2 border-l-2'>
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
        </div>
    )
}

export default AccountingPage