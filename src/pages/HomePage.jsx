import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/UseAuth';


const HomePage = () => {
    const { signIn } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/AOWH-frontend';

    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        signIn(password, () => navigate(fromPage, {replace: true}));
    }

    return (
        // <div className='flex items-center h-full p-4 text-[#2c3e50]'>
        //     <div className='flex flex-col items-center mx-auto'>
        //         <h1 className='uppercase font-bold text-center text-5xl'>Идентификатор</h1>

        //         <form className='p-8' onSubmit={handleSubmit}>
        //             <div className='mb-6'>
        //                 <input type='password' className='w-full py-2 px-3 leading-tight shadow border rounded' value={password} onChange={e => setPassword(e.target.value)} required/>
        //             </div>

        //             <div className='text-center'>
        //                 <button className='px-4 py-2 font-semibold bg-gray-100 border border-gray-300 rounded-md select-none'>
        //                     Log In
        //                 </button>
        //             </div>
        //         </form>
        //     </div> 
        // </div>
        <div></div>
    )
}

export default HomePage