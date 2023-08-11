import { useLocation, Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/UseAuth";


const RequireAuth = ({ allowedPages }) => { 
    const { userData } = useAuth();
    const location = useLocation();

    if (userData) {
        return Object.keys(userData).some(role => (allowedPages.includes(role) && userData[role])) ? <Outlet/> : <Navigate to='/login' state={{ from: location }}/>;
    }

    return <Navigate to='/login' state={{ from: location }}/>;

    // return Object.keys(userData).some(role => (allowedPages.includes(role) && userData[role])) ? <Outlet/> : <Navigate to='/login' state={{ from: location }}/>;
    // return userData ? <Outlet/> : <Navigate to='/login' state={{ from: location }}/>;
}

export default RequireAuth;