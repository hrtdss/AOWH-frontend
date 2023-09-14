import { AiOutlineClose } from 'react-icons/ai'


const Modal = ({ setActive, modalHeader, children }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center h-screen w-screen bg-black bg-opacity-40 backdrop-blur-sm'>
            <div className='flex flex-col max-w-[95%] max-h-[90%]'>
                <div className='overflow-auto p-4 bg-[#f0f0f3] text-[#2c3e50] rounded-lg'>
                    <div className='flex items-center justify-between mb-4 px-1 pb-2 border-b border-[#2c3e50] border-opacity-10'>
                        <div className='flex mt-1 text-xl'>
                            {modalHeader}
                        </div>

                        <AiOutlineClose size={33} className='block p-1' onClick={() => setActive(false)}/>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal