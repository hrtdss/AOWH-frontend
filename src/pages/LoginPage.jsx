import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/UseAuth';


const LoginPage = () => {
    const { signIn } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/AOWH-frontend/';

    // const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        signIn(password, () => navigate(fromPage, {replace: true}));
    }

    return (
        <div className='flex items-center h-screen p-4'>
            <div className='flex flex-col items-center mx-auto'>
                <h1 className='uppercase font-bold text-center text-2xl xl:text-5xl'>Идентификатор</h1>

                <form className='p-8' onSubmit={handleSubmit}>
                    {/* <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2'>
                            Login
                        </label>
                        <input className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' onChange={e => setLogin(e.target.value)}/>
                    </div> */}

                    <div className='mb-6'>
                        {/* <label className='block text-sm font-bold mb-2'>
                            Password
                        </label> */}
                        <input type='password' className='w-full py-2 px-3 leading-tight shadow border rounded' value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>

                    <div className='text-center'>
                        <button className='px-4 py-2 font-semibold bg-gray-100 border border-gray-300 rounded-md'>
                            Log In
                        </button>
                    </div>
                </form>
            </div> 
        </div>
    )
}

export default LoginPage