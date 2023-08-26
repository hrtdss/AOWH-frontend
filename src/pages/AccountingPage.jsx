import { useState } from 'react';
import Select from 'react-select';

import { AccountingService } from '../services/AccountingService';
import { SELECT_STYLE } from '../services/Constants';


const AccountingPage = () => {
    const [stocks, ] = useState(JSON?.parse(localStorage.getItem('employeeStocks'))); 
    const [selectedStock, setSelectedStock] = useState(stocks[0]);

    const [selectedMonthAndYear, setSelectedMonthAndYear] = useState('');

    const [rows, setRows] = useState([]);

    async function getTableOfAccounting() {
        if (!selectedMonthAndYear) {
            alert('Ошибка. Для получение информации необходимо указать месяц и год.')
            return;
        }

        const selectedDate = new Date(selectedMonthAndYear);
        
        let data = await AccountingService.getAccounting(selectedDate.getFullYear(), 1 + selectedDate.getMonth(), selectedStock.value);

        if (data.length > 0) {
            setRows(data);
        }
        else {
            setRows('');
        }
    }

    return (
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex items-center justify-between w-full mb-4'>  
                <div className='inline-flex'>           
                    {stocks &&
                    <div className='w-[290px] py-1 px-2'>
                        <Select defaultValue={selectedStock} styles={SELECT_STYLE} options={stocks} onChange={setSelectedStock}/>
                    </div>}
                    
                    <div className='py-1 px-2'>
                        <input type='month' name='monthAndYear' className='py-1 px-3 border shadow-sm rounded' onChange={e => setSelectedMonthAndYear(e.target.value)}/>
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
            <table className='block max-w-[95%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                <thead className='bg-slate-300'>
                    <tr className='text-base/5 text-left'>
                        <th className='px-4 py-1 border-b-2'>
                            ФИО
                        </th>
                        <th className='px-4 py-1 border-b-2 border-l-2'>
                            Должность
                        </th>
                        {/* <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Дневных <br/> смен
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Кол-во <br/> часов в <br/> дневную <br/> смену
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Ночных <br/> смен
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Кол-во <br/> часов в <br/> ночную <br/> смену
                        </th> */}
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Сверхурочные <br/> часы в дневную <br/> смену
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Сверхурочные <br/> часы в ночную <br/> смену
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Заработная <br/> плата за час
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Заработная <br/> плата за смену
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Надбавка за <br/> наставничество
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Надбавка за <br/> стаж
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Надбавка за <br/> обучение
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Премия
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Отпускные
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Заработная <br/> плата
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Аванс
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Штрафы
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Засылы
                        </th>
                        <th className='px-4 py-1 text-center border-b-2 border-l-2'>
                            Итого к <br/> выплате
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-slate-100'>
                    {
                        rows
                        ?.map((data, index) => (
                            <tr key={index} className='hover:bg-slate-200'>
                                <td className='px-4 py-[6px] border-b-2'>
                                    {data.fullName}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.positionName}
                                </td>
                                {/* <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.dayShifts.numberOfShifts}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.dayShifts.numberOfHours}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.nightShits.numberOfShifts}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.nightShits.numberOfHours}
                                </td> */}
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.overtimeDay}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.overtimeNight}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.salaryForHour.toFixed(2)}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.salaryForShift.toFixed(2)}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.mentoring}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.seniority}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.teaching}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.bonus}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.vacation}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.earned.toFixed(2)}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.advance}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.penalties}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.sends}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.payment.toFixed(2)}
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