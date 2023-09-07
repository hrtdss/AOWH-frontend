import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

import Logo from '../assets/images/logo.png';
import useAuth from '../hooks/UseAuth';


const Layout = () => {
    const [nav, setNav] = useState(false);
    const handleNav = () => setNav(!nav);
    const closeNav = () => setNav(false);

    const { userData, signOut } = useAuth();

    const navigate = useNavigate();

    let numberOfPages = 0;
    userData && Object.values(userData).forEach(value => numberOfPages += value);

    return (
        <div className='flex flex-col h-screen max-h-screen'>
            <header>
                <div className='flex justify-between items-center h-20 max-w-[1340px] mx-auto px-4 font-ttnorms font-medium uppercase text-[#2c3e50] shadow-md rounded-b-2xl'>
                    <NavLink to='/AOWH-frontend' className='flex text-base/5 text-left items-center uppercase'>
                        <img className='h-16' src={Logo} alt='header logo'/>
                        <span>Ежедневная срочная<br/>доставка груза</span>
                    </NavLink>

                    <ul className='hidden md:flex items-center text-base'>
                        {userData?.employeeCard && 
                        <li className='p-4 hover:text-[#ffc107] hover:drop-shadow-sm hover:shadow-[#808080] hover:duration-200'>
                            <NavLink to='employeeCard' className={({ isActive }) => isActive ? 'px-4 py-2 text-[#ffc107] drop-shadow-sm shadow-[#808080] border-x-2 border-[#ffc107] ease duration-300' : 'py-[30px]'}>
                                Список сотрудников
                            </NavLink>
                        </li>}

                        {userData?.positionDirectory && 
                        <li className='p-4 hover:text-[#ffc107] hover:drop-shadow-sm hover:shadow-[#808080] hover:duration-200'>
                            <NavLink to='positions' className={({ isActive }) => isActive ? 'px-4 py-2 text-[#ffc107] border-x-2 border-[#ffc107] ease duration-300' : 'py-[30px]'}>
                                Список должностей
                            </NavLink>
                        </li>}

                        {userData?.changes && 
                        <li className='p-4 hover:text-[#ffc107] hover:drop-shadow-sm hover:shadow-[#808080] hover:duration-200'>
                            <NavLink to='shifts' className={({ isActive }) => isActive ? 'px-4 py-2 text-[#ffc107] border-x-2 border-[#ffc107] ease duration-300' : 'py-[30px]'}>
                                Смены
                            </NavLink>
                        </li>}

                        {userData?.visitSchedule && 
                        <li className='p-4 hover:text-[#ffc107] hover:drop-shadow-sm hover:shadow-[#808080] hover:duration-200'>
                            <NavLink to='attendance' className={({ isActive }) => isActive ? 'px-4 py-2 text-[#ffc107] border-x-2 border-[#ffc107] ease duration-300' : 'py-[30px]'}>
                                Посещения
                            </NavLink>
                        </li>}

                        {userData?.accounting && 
                        <li className='p-4 hover:text-[#ffc107] hover:drop-shadow-sm hover:shadow-[#808080] hover:duration-200'>
                            <NavLink to='accounting' className={({ isActive }) => isActive ? 'px-4 py-2 text-[#ffc107] border-x-2 border-[#ffc107] ease duration-300' : 'py-[30px]'}>
                                Учёт
                            </NavLink>
                        </li>}
                    </ul>

                    <div className='block md:hidden' onClick={handleNav}>
                        {nav ? <AiOutlineClose size={30}/> : <AiOutlineMenu size={30}/>}
                    </div>

                    <div className={nav ? `fixed left-0 top-[72px] w-full h-[calc(${numberOfPages}*57px+8px)] bg-[#f0f0f3] ease-in-out duration-500 shadow-lg rounded-b-2xl` : 'ease duration-500 fixed top-[72px] left-[-100%]'}>
                        <ul className='text-base mt-2'>
                            {userData?.employeeCard && 
                            <li className='p-4 border-t border-gray-600 active:text-[#ffc107] active:drop-shadow-sm active:shadow-[#808080]'>
                                <NavLink to='employeeCard' onClick={closeNav} className={({ isActive }) => isActive ? 'px-4 text-[#ffc107] border-x-2 border-[#ffc107]' : ''}>
                                    Список сотрудников
                                </NavLink>
                            </li>}

                            {userData?.positionDirectory && 
                            <li className='p-4 border-t border-gray-600 active:text-[#ffc107] active:drop-shadow-sm active:shadow-[#808080]'>
                                <NavLink to='positions' onClick={closeNav} className={({ isActive }) => isActive ? 'px-4 text-[#ffc107] border-x-2 border-[#ffc107]' : ''}>
                                    Список должностей
                                </NavLink>
                            </li>}

                            {userData?.changes && 
                            <li className='p-4 border-t border-gray-600 active:text-[#ffc107] active:drop-shadow-sm active:shadow-[#808080]'>
                                <NavLink to='shifts' onClick={closeNav} className={({ isActive }) => isActive ? 'px-4 text-[#ffc107] border-x-2 border-[#ffc107]' : ''}>
                                    Смены
                                </NavLink>
                            </li>}

                            {userData?.visitSchedule && 
                            <li className='p-4 border-t border-gray-600 active:text-[#ffc107] active:drop-shadow-sm active:shadow-[#808080]'>
                                <NavLink to='attendance' onClick={closeNav} className={({ isActive }) => isActive ? 'px-4 text-[#ffc107] border-x-2 border-[#ffc107]' : ''}>
                                    Посещения
                                </NavLink>
                            </li>}
                            
                            {userData?.accounting && 
                            <li className='p-4 border-t border-gray-600 active:text-[#ffc107] active:drop-shadow-sm active:shadow-[#808080]'>
                                <NavLink to='accounting' onClick={closeNav} className={({ isActive }) => isActive ? 'px-4 text-[#ffc107] border-x-2 border-[#ffc107]' : ''}>
                                    Учёт
                                </NavLink>
                            </li>}
                        </ul>
                    </div>
                </div>
            </header>
            
            {/* max-h-[calc()] */}
            {/* h-[calc(964px-160px)] */}
            <main className={!nav ? 'flex-grow' : 'flex-grow overflow-hidden'}>
                <Outlet/>
            </main>
            
            <footer>
                <div className='flex justify-between items-center h-20 max-w-[1340px] mx-auto px-4 text-[#2c3e50] shadow-mdt rounded-t-2xl'>
                    <div className='flex items-center font-ttnorms font-medium uppercase text-base/5 text-left'>
                        <img className='h-16 grayscale z-[-1]' src={Logo} alt='footer logo'/>
                        <span>Транспортная компания <br/> &copy; 2023 «ЛУЧ»</span>
                    </div>
                    
                    {numberOfPages !== 0 &&
                    <div className='text-center mr-4'>
                        <button className='px-4 py-2 font-semibold bg-gray-100 border border-gray-300 rounded-md select-none' onClick={() => signOut(() => navigate('/AOWH-frontend', {replace: true}))}>
                            Выйти
                        </button>
                    </div>}
                </div>
            </footer>
        </div>
    )
}

export default Layout