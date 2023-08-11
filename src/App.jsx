import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import AccountingPage from './pages/AccountingPage';
import AttendancePage from './pages/AttendancePage';
import EmployeesPage from './pages/EmployeesPage';
import PositionsPage from './pages/PositionsPage';
import ShiftsPage from './pages/ShiftsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './hocs/RequireAuth';
import ErrorPage from './pages/ErrorPage';


function App() {
    return (
        // <Routes>
        //     <Route path='login' element={<LoginPage/>}/>

        //     <Route element={<RequireAuth/>}>
        //         <Route path='/' element={<Layout/>}>
        //             <Route index element={<HomePage/>}/>
        //             <Route path='employeeCard' element={<EmployeesPage/>}/>
        //             <Route path='positions' element={<PositionsPage/>}/>
        //             <Route path='shifts' element={<ShiftsPage/>}/>
        //             <Route path='attendance' element={<AttendancePage/>}/>
        //             <Route path='accounting' element={<AccountingPage/>}/>
        //         </Route>
        //     </Route>

        //     <Route path='*' element={<ErrorPage/>}/>
        // </Routes>

        <Routes>
            <Route path='/login' element={<LoginPage/>}/>

            <Route element={<RequireAuth allowedPages={['employeeCard', 'positionDirectory', 'changes', 'visitSchedule', 'accounting']}/>}>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<HomePage/>}/>

                    <Route element={<RequireAuth allowedPages={['employeeCard']}/>}>
                        <Route path='employeeCard' element={<EmployeesPage/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedPages={['positionDirectory']}/>}>
                        <Route path='positions' element={<PositionsPage/>}/>
                    </Route>
                    
                    <Route element={<RequireAuth allowedPages={['changes']}/>}>
                        <Route path='shifts' element={<ShiftsPage/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedPages={['visitSchedule']}/>}>
                        <Route path='attendance' element={<AttendancePage/>}/>
                    </Route>

                    <Route element={<RequireAuth allowedPages={['accounting']}/>}>
                        <Route path='accounting' element={<AccountingPage/>}/>
                    </Route>
                </Route>
            </Route>

            <Route path='*' element={<ErrorPage/>}/>
        </Routes>
    );
}

export default App;