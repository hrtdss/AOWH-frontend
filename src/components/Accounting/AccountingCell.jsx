import { useEffect, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';


const AccountingCell = ({ fieldName, employeeIndex, employeeId, value, onChange }) => {
    const [mode, setMode] = useState('read');
    const [text, setText] = useState(value ?? '');

    useEffect(() => {
        setText(value);
    }, [value]);

    if (mode === 'edit') {
        const handleInputChange = e => {
            setText(e.target.value);
        }

        const handleSaveClick = () => {
            setMode('read');

            if (onChange) {
                onChange(fieldName, employeeIndex, employeeId, text);
            }
        }

        return (
            <div className='flex flex-row items-center justify-center'>
                <input type='number' className='remove-arrow w-[70px] px-2 rounded' value={text} onChange={handleInputChange}/>
                <button className='ml-1' onClick={handleSaveClick}>
                    <AiOutlineCheck size={20}/>
                </button>
            </div>
        );
    }
    else if (mode === 'read') {
        const handleEditClick = () => {
            setMode('edit');
        }

        return (
            <div onClick={handleEditClick}>
                {text}
            </div>
        )
    }
}

export default AccountingCell