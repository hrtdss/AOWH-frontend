import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/UseAuth';


const LoginPage = () => {
    const { signInFirstStage, signInSecondStage } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/AOWH-frontend/';

    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [userName, setUserName] = useState('');

    const handleFirstSubmit = async e => {
        e.preventDefault();

        setPassword('');

        const firstStagePromise = await signInFirstStage(password);

        if (firstStagePromise !== undefined) {
            setIsPasswordCorrect(true);
            setPasswordCopy(password);

            setUserName(firstStagePromise);
        }
    }

    const handleSecondSubmit = async e => {
        e.preventDefault();

        signInSecondStage(passwordCopy, () => navigate(fromPage, {replace: true}));
    }

    return (
        <div className='flex items-center h-full p-4 text-[#2c3e50]'>
            {!isPasswordCorrect ?
            <div className='flex flex-col items-center mx-auto'>
                <h1 className='uppercase font-bold text-center text-5xl'>Идентификация</h1>

                <form className='p-8' onSubmit={handleFirstSubmit}>
                    <div className='mb-6'>
                        <input type='password' className='w-full px-3 py-2 leading-tight shadow border rounded' value={password} onChange={e => setPassword(e.target.value)} required/>
                    </div>

                    <div className='text-center'>
                        <button className='px-4 py-[6px] font-semibold bg-gray-100 border border-gray-300 rounded-md select-none'>
                            Авторизоваться
                        </button>
                    </div>
                </form>
            </div> :
            <div className='flex flex-col items-center mx-auto'>
                <div className='text-center text-xl'>
                    <div className='mb-2'>Вы вошли как пользователь</div>

                    <h1 className='mb-2 uppercase font-bold text-5xl'>{userName}</h1>

                    <div>подтвердить вход?</div>
                </div>
                
                <div className='flex flex-row mt-6'>
                    <div className='text-center'>
                        {/* <button className='w-[70px] px-4 py-[6px] mr-6 font-semibold bg-gray-100 border border-gray-300 rounded-md select-none'>
                            Да
                        </button> */}
                        <button className='w-[146px] px-6 py-2 mr-10 font-semibold text-white rounded-md bg-orange-400 select-none' onClick={handleSecondSubmit}>
                            Подтвердить
                        </button>

                        {/* <button className='w-[70px] px-4 py-[6px] ml-6 font-semibold bg-gray-100 border border-gray-300 rounded-md select-none'>
                            Нет
                        </button> */}
                        <button className='w-[146px] px-6 py-[7px] ml-10 font-semibold text-orange-400 border border-gray-300 rounded-md select-none' onClick={() => setIsPasswordCorrect(false)}> 
                            Назад
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default LoginPage