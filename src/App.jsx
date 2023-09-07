import React from 'react';
import { Routes, Route } from 'react-router-dom';


import RequireAuth from './hocs/RequireAuth';
import Layout from './components/Layout';
import AccountingPage from './pages/AccountingPage';
import AttendancePage from './pages/AttendancePage';
import EmployeesPage from './pages/EmployeesPage';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PositionsPage from './pages/PositionsPage';
import ShiftsPage from './pages/ShiftsPage';


function App() {
    return (
        <Routes>
            <Route path='/AOWH-frontend/login' element={<Layout/>}>
                <Route index element={<LoginPage/>}/>
            </Route>

            <Route element={<RequireAuth allowedPages={['employeeCard', 'positionDirectory', 'changes', 'visitSchedule', 'accounting']}/>}>
                <Route path='/AOWH-frontend/' element={<Layout/>}>
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

            <Route path='/AOWH-frontend/*' element={<ErrorPage/>}/>
        </Routes>

        // <Routes>
        //     {/* <Route path='/AOWH-frontend/login' element={<LoginPage/>}/> */}

        //     <Route path='/AOWH-frontend/' element={<Layout/>}>
        //         <Route index element={<HomePage/>}/>

        //         <Route element={<RequireAuth allowedPages={['employeeCard', 'positionDirectory', 'changes', 'visitSchedule', 'accounting']}/>}>
        //             <Route element={<RequireAuth allowedPages={['employeeCard']}/>}>
        //                 <Route path='employeeCard' element={<EmployeesPage/>}/>
        //             </Route>

        //             <Route element={<RequireAuth allowedPages={['positionDirectory']}/>}>
        //                 <Route path='positions' element={<PositionsPage/>}/>
        //             </Route>
                    
        //             <Route element={<RequireAuth allowedPages={['changes']}/>}>
        //                 <Route path='shifts' element={<ShiftsPage/>}/>
        //             </Route>

        //             <Route element={<RequireAuth allowedPages={['visitSchedule']}/>}>
        //                 <Route path='attendance' element={<AttendancePage/>}/>
        //             </Route>

        //             <Route element={<RequireAuth allowedPages={['accounting']}/>}>
        //                 <Route path='accounting' element={<AccountingPage/>}/>
        //             </Route>
        //         </Route>
        //     </Route>

        //     <Route path='/AOWH-frontend/*' element={<ErrorPage/>}/>
        // </Routes>
    );
}

export default App;