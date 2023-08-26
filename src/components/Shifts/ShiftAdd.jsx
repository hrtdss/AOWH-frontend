import { useCallback, useEffect, useState } from 'react';

import { EmployeeService } from '../../services/EmployeeService';
import { ShiftService } from '../../services/ShiftService';


const ShiftAdd = ({ setActive, addValue }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(2); // const size = Object.keys(valueFlags).length ?
    const [isErrorActive, setIsErrorActive] = useState(false);

    const [values, setValues] = useState({
        stockId: 0,
        employees: '',
        dayOrNight: '',
    });

    // const [valueFlags, setValueFlags] = useState({
    //     employees: { isDirty: false, isEmpty: true },
    //     dayOrNight: { isDirty: false, isEmpty: true },
    // });

    const stockId = 6; // localStorage.getItem('stockId');
    const [stockEmployees, setStockEmployees] = useState([]);

    async function getListOfEmployees() {
        let employees = await EmployeeService.getListOfEmployees();

        if (employees) {
            let requiredEmployees = [];
            for (let employee of employees) {
                if (employee.stocks[0].stockId === stockId) {
                    requiredEmployees.push(employee);
                }
            }

            setStockEmployees(requiredEmployees);
        }
    }

    async function addShift() {
        // let data = await ShiftService.openShift(values);

        // if (data) {
        //     addValue(data);   [data, values]
        //     setActive(false);
        // }
    }

    useEffect(() => {
        // getListOfEmployees();
    }, []); 

    // useEffect(() => {
    //     if (values.stock !== '') {
    //         let data = StockService.getLinksByStock(values.stock.replace(/[^0-9]+/g, ""));
    //         data.then(data => {
    //             if (data.length === 0) {
    //                 setLinks([]);
    //                 setValues(prevState => ({...prevState, link: ''}));
    //             }
    //             else {
    //                 setLinks(data);
    //             }
    //         });
    //     }
    //     else {
    //         setLinks([]);
    //         setValues(prevState => ({...prevState, link: ''}));
    //     }
    // }, [values.stock]); 

    // useEffect(() => {
    //     let numberOfUnfilled = 0;
    //     Object.values(valueFlags).forEach(value => numberOfUnfilled += value.isEmpty);
        
    //     setNumberOfEmptyFields(numberOfUnfilled);

    //     if (numberOfUnfilled === 0) {
    //         setIsErrorActive(false);
    //     }
    // }, [valueFlags]);

    // const handleBlur = e => {
    //     if (!valueFlags[e.target.name].isDirty) {
    //         setValueFlags({...valueFlags, [e.target.name]: {...valueFlags[e.target.name], isDirty: true}});
    //     }
    // }

    // const handleChange = e => {
    //     let value; 

    //     if (e.target.type === 'number') {
    //         value = e.target.value || 0;
    //     }
    //     else if (e.target.type === 'select-one' && e.target.name === 'stock') { 
    //         value = e.target.value ? `[${e.target.value}]` : e.target.value;
    //     }
    //     else if (e.target.type === 'checkbox') {
    //         value = e.target.checked;
    //     }
    //     else {
    //         value = e.target.value;
    //     }

    //     setValues({...values, [e.target.name]: value});

    //     if (valueFlags.hasOwnProperty(e.target.name)) {
    //         let isEmpty = e.target.value ? false : true;
    //         let recorderValue = values[e.target.name];

    //         if (isEmpty || (!isEmpty && !recorderValue)) {
    //             setValueFlags({...valueFlags, [e.target.name]: {...valueFlags[e.target.name], isEmpty: isEmpty}});
    //         }
    //     }
    // }

    const handleClick = () => {
        // if (numberOfEmptyFields !== 0) {
        //     Object.values(valueFlags).forEach(value => {
        //         if (!value.isDirty && value.isEmpty) {
        //             value.isDirty = true; 
        //         }
        //     });

        //     !isErrorActive && setIsErrorActive(true);
        //     forceUpdate();
        // }
        // else {
        //     // addShift();
        //     console.log('success');
        // }

        console.log(values);
        // console.log(stockEmployees);
    }

    return (
        <div className='text-base text-[#2c3e50]'>
            <h2 className='flex mb-4 pl-1 pb-2 text-xl border-b border-[#2c3e50] border-opacity-10'>Добавление смены</h2>

            <div className='grid grid-rows-1 grid-flow-col gap-2'>
                <div className='flex flex-col mt-1'>
                    <div className='flex items-center mb-2'>
                        <input type='radio' id='dayShift' name='shiftTime' value='Дневная'/>
                        <label className='ml-2'>Дневная</label>
                    </div>
                    <div className='flex items-center mb-2'>
                        <input type='radio' id='nightShift' name='shiftTime' value='Ночная'/>
                        <label className='ml-2'>Ночная</label>
                    </div>
                </div>
                
                <div className='ml-8'>
                    <table className='block overflow-auto mb-1 border-x-2 border-t-2 whitespace-nowrap'>
                        <thead className='bg-slate-300'>
                            <tr className='text-base/5 text-left'>
                                <th className='px-4 py-2 border-b-2'/>
                                <th className='px-4 py-2 border-b-2 border-l-2'>
                                    ФИО
                                </th>
                            </tr>
                        </thead>

                        <tbody className='bg-slate-100'>
                            {
                                stockEmployees?.map((data, index) => (
                                    <tr key={index} className='hover:bg-slate-200'>
                                        <td className='px-4 py-[6px] pt-3 border-b-2'>
                                            <input type='checkbox' className='w-5 h-5 bg-gray-100 border-gray-300 rounded'/>
                                        </td>
                                        <td className='px-4 py-[6px] border-b-2 border-l-2'>
                                            {`${data.surname} ${data.name} ${data.patronymic}`}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md' onClick={handleClick}>
                    Добавить
                </button>
                
                {isErrorActive && <div className='ml-2 font-bold text-red-500'>Ошибка. Заполнены не все поля!</div>}
            </div>
        </div>
    )
}

export default ShiftAdd