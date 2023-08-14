import { createContext, useState } from 'react';
import axios from "axios";

import { API_URL } from '../services/Constants';


const AuthContext = createContext('');

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(JSON?.parse(localStorage.getItem('access')));

    const signIn = async (password, callback) => {
        try {
            const response = await axios.post(`http://localhost:8081/api/LogIn`, { password }, { withCredentials: true })

            if (response.status !== 200) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            const data = await response.data;

            const accesses = data.accesses;

            let numberOfPages = 0;
            Object.values(accesses).forEach(value => numberOfPages += value);
                        
            if (numberOfPages !== 0) {
                setUserData(accesses);

                localStorage.setItem('jwtToken', data.token);
                localStorage.setItem('access', JSON.stringify(accesses));
                localStorage.setItem('stockId', data.stocks[0].stockId); // !

                callback();
            }
            else {
                alert("Отметка о посещении был проставлена или же работник уволен.");
                // some actions
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

        localStorage.removeItem('jwtToken');
        localStorage.removeItem('access');
        localStorage.removeItem('stockId');

        callback();
    }

    return (
        <AuthContext.Provider value={{ userData, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;