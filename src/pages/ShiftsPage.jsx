import { useEffect, useState } from 'react';

import { EmployeeService } from '../services/EmployeeService'
import { ShiftService } from '../services/ShiftService';

import Modal from '../components/Modal';
import ShiftAdd from '../components/Shifts/ShiftAdd';
// import ShiftEdit from '../components/Shifts/ShiftEdit';


let selectedShiftData;

const ShiftsPage = () => {
    const [modalAddActive, setModalAddActive] = useState(false);
    const [modalEditActive, setModalEditActive] = useState(false);

    const stockId = 6; // localStorage.getItem('stockId');
    const [rows, setRows] = useState([]);

    const [newVal, setNewVal] = useState([]);



    async function getListOfShifts() {
        let shifts = await ShiftService.getListOfOpenShifts(stockId);

        if (shifts) {
            setRows(shifts);
        }
    }

    useEffect(() => {
        getListOfShifts();
    }, [])

    const handleClick = e => {
        selectedShiftData = e.currentTarget.getAttribute('data-value'); 
        setModalEditActive(true);
    };  

    // "45e547e4-8180-43cb-b543-b614d8774d6e"  day 
    // "10004d7e-1186-42b9-b10b-8afc7f5a1c74"  night

    const tempFunc = () => {
        console.log(rows);
    }

    return (
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex justify-center w-full mb-4'>
                {/* () => tempFunc() */}
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md' onClick={() => setModalAddActive(true)}>
                    Добавить
                </button>
            </div>

            <div className='mt-2 mb-4 text-xl'>
                Открытые смены:
            </div>

            <table className='block max-w-[95%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                <thead className='bg-slate-300'>
                    <tr className='text-base/5 text-left'>
                        <th className='px-4 py-2 border-b-2'>
                            №
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            Время
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            Сотрудники
                        </th>
                        <th className='px-4 py-2 border-b-2 border-l-2'>
                            {/* <input placeholder='Поиск по сотрудникам' className='px-3 py-1 rounded-md' onChange={e => setSearch(e.target.value)}/>  */}
                        </th>
                    </tr>
                </thead>

                <tbody className='bg-slate-100'>
                    <tr className='hover:bg-slate-200'>
                        <td className='px-4 py-[6px] border-b-2'>
                            {rows.shiftId}
                        </td>
                        <td className='px-4 py-[6px] border-b-2 border-l-2'>
                            {rows.dayOrNight}
                        </td>
                        <td className='px-4 py-[6px] border-b-2 border-l-2'>
                            <ul className='list-disc pl-4'>
                                {
                                    rows.employees?.map((data, index) => (
                                        <li key={index}>
                                            {data.fullName}
                                        </li>
                                    ))
                                }
                            </ul>
                        </td>
                        <td className='px-4 py-[6px] border-b-2 border-l-2'>
                            <div className="flex items-center justify-center">
                                <button className='py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md' data-value={rows.shiftId} onClick={handleClick}>
                                    Изменить
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>

                {/* <tbody className='bg-slate-100'>
                    {
                        rows?.map((data, index) => (
                            <tr key={index} className='hover:bg-slate-200'>
                                <td className='px-4 py-[6px] border-b-2'>
                                    {data.shiftId}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.dayOrNight}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.employees}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    <div className="flex items-center justify-center">
                                        <button className='py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md' data-value={data.shiftId} onClick={handleClick}>
                                            Изменить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody> */}
            </table>

            {modalAddActive && <Modal setActive={setModalAddActive}>
                <ShiftAdd setActive={setModalAddActive} addValue={setNewVal}/>
            </Modal>}

            {/* {modalEditActive && <Modal setActive={setModalEditActive}>
                <ShiftEdit rowData={selectedEmployeeData} setActive={setModalEditActive} changeValue={setNewVal}/>
            </Modal>} */}
        </div>
    )
}

export default ShiftsPage