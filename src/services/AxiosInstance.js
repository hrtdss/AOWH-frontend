import axios from 'axios';

import { API_URL } from './Constants';


const AxiosInstance = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'content-type': 'application/json',
        'ngrok-skip-browser-warning': true
    }
});

AxiosInstance.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('jwtToken')}`
    return config;
});

AxiosInstance.interceptors.response.use(config => {
    return config;
}, async error => {
    const initialRequest = {...error.config};
    initialRequest._isRetry = true;

    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        if (error.response.data === 'Invalid refresh token') {
            localStorage.removeItem('access');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('stockId');

            return window.location = '/AOWH-frontend/login';
        }
        else {
            try {
                let oldToken = localStorage.getItem('jwtToken');

                const response = await AxiosInstance.post('/LogIn/refresh-token', oldToken, { withCredentials: true })

                if (response.status === 200) {
                    localStorage.setItem('jwtToken', response.data);
                    return AxiosInstance.request(initialRequest);
                }
                else {
                    console.log('Неудачное обновление токена', response) // !
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
    }

    throw error;
})

export default AxiosInstance;