import { createContext, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'

import { API_URL } from '../services/Constants';
import { EmployeeService } from '../services/EmployeeService';
import { StockService } from '../services/StockService';


const AuthContext = createContext('');

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(JSON?.parse(localStorage.getItem('access')));
    const navigate = useNavigate();

    const signInFirstStage = async (password) => {
        try {
            const response = await axios.post(`${API_URL}/LogIn`, { password }, { withCredentials: true })

            if (response.status !== 200) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.data;

            return data.fullName;
        }
        catch (error) {
            if (!error?.response) {
                console.log('Сервер не отвечает.');
            } 
            else {
                console.log('Запрос был прерван:', error.message);
            }
        }
    }

    const signInSecondStage = async (password, callback) => {
        try {
            const response = await axios.post(`${API_URL}/LogIn`, { password }, { withCredentials: true })

            if (response.status !== 200) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.data;

            const accesses = data.accesses;
            const availableStocks = data.stocks;

            let numberOfPages = 0;
            Object.values(accesses).forEach(value => numberOfPages += value);
                        
            if (numberOfPages !== 0) {
                setUserData(accesses);

                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('access', JSON.stringify(accesses));               

                const allStocks = await StockService.getListOfStocks();
                localStorage.setItem('allStocks', JSON.stringify(allStocks));

                if (availableStocks.length === 0) {
                    localStorage.setItem('employeeStocks', JSON.stringify(allStocks));
                }
                else {
                    const result = [];
                    for (let i = 0; i < availableStocks.length; i++) {
                        result.push({ value: availableStocks[i].stockId, label: availableStocks[i].stockName });
                    }

                    if (availableStocks.length === 1) {
                        localStorage.setItem('employeeStocks', JSON.stringify(result));
                    }
                    else {
                        localStorage.setItem('employeeStocks', JSON.stringify(result));
                    }
                }

                const decoded = jwtDecode(data.token);
                let currentEmployee = await EmployeeService.getDataByEmployeeId(decoded.EmployeeId);
                localStorage.setItem('positionId', currentEmployee.employeeData.positionId);

                callback();
            }
            else {
                navigate('/AOWH-frontend', {replace: true})
            }
        }
        catch (error) {
            if (!error?.response) {
                console.log('Сервер не отвечает.');
            } 
            else {
                console.log('Запрос был прерван:', error.message);
            }
        }
    }

    const signIn = async (password, callback) => {
        try {
            const response = await axios.post(`${API_URL}/LogIn`, { password }, { withCredentials: true })

            if (response.status !== 200) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.data;

            const accesses = data.accesses;
            const availableStocks = data.stocks;

            let numberOfPages = 0;
            Object.values(accesses).forEach(value => numberOfPages += value);
                        
            if (numberOfPages !== 0) {
                setUserData(accesses);

                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('access', JSON.stringify(accesses));               

                const allStocks = await StockService.getListOfStocks();
                localStorage.setItem('allStocks', JSON.stringify(allStocks));

                if (availableStocks.length === 0) {
                    localStorage.setItem('employeeStocks', JSON.stringify(allStocks));
                }
                else {
                    const result = [];
                    for (let i = 0; i < availableStocks.length; i++) {
                        result.push({ value: availableStocks[i].stockId, label: availableStocks[i].stockName });
                    }

                    if (availableStocks.length === 1) {
                        localStorage.setItem('employeeStocks', JSON.stringify(result));
                    }
                    else {
                        localStorage.setItem('employeeStocks', JSON.stringify(result));
                    }
                }

                const decoded = jwtDecode(data.token);
                let currentEmployee = await EmployeeService.getDataByEmployeeId(decoded.EmployeeId);
                localStorage.setItem('positionId', currentEmployee.employeeData.positionId);

                callback();
            }
            else {
                alert(`${data.fullName} \nОтметка прошла успешно!`);
            }
        }
        catch (error) {
            if (!error?.response) {
                console.log('Сервер не отвечает.');
            } 
            else {
                console.log('Запрос был прерван:', error.message);
            }
        }
    }

    const signOut = (callback) => {
        setUserData(null);

        localStorage.clear();

        callback();
    }

    return (
        <AuthContext.Provider value={{ userData, signIn, signOut, signInFirstStage, signInSecondStage }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;