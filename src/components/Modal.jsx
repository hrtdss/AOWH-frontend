import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'


const Modal = ({setActive, children}) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-40 backdrop-blur-sm'>
            <div className='flex flex-col max-w-[95%] max-h-[85%]'>
                <div className='overflow-auto p-4 bg-[#f0f0f3] text-[#2c3e50] rounded-lg'>
                    <div className='flex justify-end mb-4'>
                        <AiOutlineClose size={25} onClick={() => setActive(false)}/>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal