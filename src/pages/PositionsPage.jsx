import { useEffect, useState } from "react";

import { PositionService } from '../services/PositionService';

import Modal from '../components/Modal';
import PositionAdd from '../components/Positions/PositionAdd';
import PositionEdit from '../components/Positions/PositionEdit';


let selectedPositionData;

const PositionsPage = () => {    
    const [modalAddActive, setModalAddActive] = useState(false);
    const [modalEditActive, setModalEditActive] = useState(false);
    
    const [rows, setRows] = useState([]);
    
    const [newVal, setNewVal] = useState([]);

    async function getTableOfPositions() {
        let positions = await PositionService.getListOfPositions();

        if (positions) {
            let positionsData = [];
            for (let position of positions) {
                let data = await PositionService.getDataAboutPosition(position.positionId);
                positionsData.push(data);
            }

            setRows(positionsData);
        }
    }

    useEffect(() => {
        if (newVal.positionId) {
            const index = rows.findIndex(data => data.positionId === newVal.positionId)

            const pastRowValues = [...rows];
            pastRowValues[index] = newVal;

            setRows(pastRowValues);
        }
        else {
            getTableOfPositions();
        }
    }, [newVal])

    const handleClick = e => {
        selectedPositionData = e.currentTarget.getAttribute('data-value'); 
        setModalEditActive(true);
    };  

    return (
        <div className='flex flex-col items-center h-full max-w-[1300px] mx-auto my-8 font-ttnorms text-[#2c3e50]'>
            <div className='flex justify-center w-full mb-4'>
                <button className='py-2 px-3 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md' onClick={() => setModalAddActive(true)}>
                    Добавить
                </button>
            </div>

            <table className='block max-w-[95%] overflow-auto mb-1 border-x-2 border-t-2 rounded-md whitespace-nowrap'>
                <thead className='bg-slate-300'>
                    <tr className='text-base/5 text-left'>
                        <th className='px-4 py-3 border-b-2'>
                            Должность
                        </th>   
                        <th className='px-4 py-3 border-b-2 border-l-2'>
                            Оклад
                        </th>
                        <th className='px-4 py-3 border-b-2 border-l-2'>
                            Квартальная премия
                        </th>
                        <th className='px-4 py-3 border-b-2 border-l-2'>
                            Доступ
                        </th>
                        <th className='px-4 py-3 border-b-2 border-l-2'>
                            Редактирование
                        </th>
                    </tr>
                </thead>
                
                <tbody className='bg-slate-100'>
                    {
                        rows?.map((data, index) => (
                            <tr key={index} className='hover:bg-slate-200'>
                                <td className='px-4 py-[6px] border-b-2'>
                                    {data.name}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.salary}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    {data.quarterlyBonus}
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    <ul className='list-disc pl-4'>
                                        {data.interfaceAccesses.employeeCard && <li>Карточка сотрудника</li>}
                                        {data.interfaceAccesses.positionDirectory && <li>Список должностей</li>}
                                        {data.interfaceAccesses.changes && <li>Смены</li>}
                                        {data.interfaceAccesses.visitSchedule && <li>Посещения</li>}
                                        {data.interfaceAccesses.accounting && <li>Учет</li>}
                                    </ul>
                                </td>
                                <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                    <div className="flex items-center justify-center">
                                        <button className='py-2 px-3 font-normal text-white bg-orange-400 hover:bg-orange-500 rounded-md' data-value={JSON.stringify(data)} onClick={handleClick}>
                                            Изменить
                                        </button>
                                        {/* // <button className='bg-red-600 hover:bg-red-800 text-white font-normal ml-4 py-2 px-3 rounded-md'>
                                        //     Удалить
                                        // </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            
            {modalAddActive && <Modal setActive={setModalAddActive}>
                <PositionAdd setActive={setModalAddActive} addValue={setNewVal}/>
            </Modal>}

            {modalEditActive && <Modal setActive={setModalEditActive}>
                <PositionEdit rowData={selectedPositionData} setActive={setModalEditActive} changeValue={setNewVal}/>
            </Modal>}
        </div>
    )
}

export default PositionsPage