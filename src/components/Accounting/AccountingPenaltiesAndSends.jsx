import { useCallback, useEffect, useState } from 'react';


const AccountingPenaltiesAndSends = ({ rowData, setActive, addValue }) => {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [numberOfEmptyFields, setNumberOfEmptyFields] = useState(0);
    const [isErrorActive, setIsErrorActive] = useState(false);
    
    const [values, setValues] = useState(''); // !

    const [valueFlags, setValueFlags] = useState({
        penalties: { isDirty: false, isEmpty: false },
        sends: { isDirty: false, isEmpty: false },
    });

    // async function get() {
    //     let data = await;

    //     if (data) {
    //     }
    // }

    // useEffect(() => {
    //     get();
    // }, []);

    useEffect(() => {
        let numberOfUnfilled = 0;
        Object.values(valueFlags).forEach(value => numberOfUnfilled += value.isEmpty);
        
        setNumberOfEmptyFields(numberOfUnfilled);

        if (numberOfUnfilled === 0) {
            setIsErrorActive(false);
        }
    }, [valueFlags]);

    const handleBlur = e => {
        if (!valueFlags[e.target.name].isDirty) {
            setValueFlags({...valueFlags, [e.target.name]: {...valueFlags[e.target.name], isDirty: true}});
        }
    }

    const handleChange = e => {
        const value = e.target.value;

        setValues({...values, [e.target.name]: value});

        if (valueFlags.hasOwnProperty(e.target.name)) {
            let isEmpty = e.target.value ? false : true;
            let recorderValue = values[e.target.name];

            if (isEmpty || (!isEmpty && !recorderValue)) {
                setValueFlags({...valueFlags, [e.target.name]: {...valueFlags[e.target.name], isEmpty: isEmpty}});
            }
        }
    }

    const handleClick = () => {
        if (numberOfEmptyFields !== 0) {
            Object.values(valueFlags).forEach(value => {
                if (!value.isDirty && value.isEmpty) {
                    value.isDirty = true; 
                }
            });

            !isErrorActive && setIsErrorActive(true);
            forceUpdate();
        }
        else {
            console.log();
        }
    }

    return (
        <div className='text-base text-[#2c3e50]'>
            <div>
                <div>
                    <div className='flex flex-row items-center justify-between'>
                        <label className='block text-left ml-1 mb-1'>
                            Штрафы
                        </label>
                        <input type='number' name='penalty' className={`remove-arrow w-[150px] py-1 px-3 border rounded`}/>
                    </div>
                    {/* defaultValue={values.reasonOfTermination} */}
                    <textarea name='penaltyComment' className='w-[364px] h-[105px] mt-2 px-2 py-1 border rounded resize-none' disabled/>
                </div>

                <div>
                    <div className='flex flex-row items-center justify-between mt-4'>
                        <label className='block text-left ml-1 mb-1'>
                            Засылы
                        </label>
                        <input type='number' name='send' className={`remove-arrow w-[150px] py-1 px-3 border rounded`}/>
                    </div>
                    {/* defaultValue={values.reasonOfTermination} */}
                    <textarea name='sendComment' className='w-[364px] h-[105px] mt-2 px-2 py-1 border rounded resize-none' disabled/>
                </div>
                
            </div>

            <div className='flex flex-row-reverse items-center justify-between mt-3'>
                <button className='px-3 py-2 font-normal text-white bg-amber-400 hover:bg-yellow-500 rounded-md select-none' onClick={handleClick}>
                    Сохранить
                </button>
                
                {isErrorActive && <div className='ml-2 font-bold text-red-500'>Ошибка. Заполнены не все поля!</div>}
            </div>
        </div>
    )
}

export default AccountingPenaltiesAndSends