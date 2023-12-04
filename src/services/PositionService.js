import AxiosInstance from './AxiosInstance';

import { ADMINISTRATOR, FRANCHISE_MANAGER, STOCK_MANAGER, DISMISSED_EMPLOYEE } from './Constants';


export const PositionService = {
    getListOfPositions,
    getDataAboutPosition,
    addPosition,
    editPosition,
    deletePosition
};

async function getListOfPositions(action) {
    try {
        const response = await AxiosInstance.get('/Position')

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = response.data;

        // if (action !== 'restore') {
        //     data.splice(data.findIndex(value => value.positionId === DISMISSED_EMPLOYEE), 1);
        // }
        
        const userPositionId = localStorage.getItem('positionId');
        const requiredData = [];

        // if (userPositionId === ADMINISTRATOR) {
        //     for (let i = 0; i < data.length; i++) {
        //         if (action === 'restore' && data[i].positionId === DISMISSED_EMPLOYEE) {
        //             requiredData.push({ value: data[i].positionId, label: data[i].name, isDisabled: true });
        //         }
        //         else {
        //             requiredData.push({ value: data[i].positionId, label: data[i].name });
        //         }
        //     }
        // }
        // else if (userPositionId === FRANCHISE_MANAGER) {
        //     for (let i = 0; i < data.length; i++) {
        //         if (data[i].positionId === FRANCHISE_MANAGER || (action === 'restore' && data[i].positionId === DISMISSED_EMPLOYEE)) {
        //             requiredData.push({ value: data[i].positionId, label: data[i].name, isDisabled: true });
        //         }
        //         else if (data[i].positionId !== ADMINISTRATOR) { // && data[i].positionId !== FRANCHISE_MANAGER
        //             requiredData.push({ value: data[i].positionId, label: data[i].name });
        //         }
        //     }
        // }
        // else if (userPositionId === STOCK_MANAGER) {
        //     for (let i = 0; i < data.length; i++) {
        //         if (data[i].positionId === STOCK_MANAGER || (action === 'restore' && data[i].positionId === DISMISSED_EMPLOYEE)) {
        //             requiredData.push({ value: data[i].positionId, label: data[i].name, isDisabled: true });
        //         }
        //         else if (data[i].positionId !== ADMINISTRATOR && data[i].positionId !== FRANCHISE_MANAGER) { // && data[i].positionId !== STOCK_MANAGER
        //             requiredData.push({ value: data[i].positionId, label: data[i].name });
        //         }
        //     }
        // }
        
        for (let i = 0; i < data.length; i++) {
            requiredData.push({ value: data[i].positionId, label: data[i].name });
        }

        return requiredData;
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

async function getDataAboutPosition(positionId) {
    try {
        const response = await AxiosInstance.get(`/Position/${positionId}`)

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return response.data;
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

async function addPosition(values) {
    try {
        const response = await AxiosInstance.post('/Position', values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return true;
    }
    catch (error) {
        if (!error?.response) {
            console.log('Сервер не отвечает.');
        } 
        else {
            console.log('Запрос был прерван:', error);
        }
    }
}

async function editPosition(values) {
    try {
        const response = await AxiosInstance.put('/Position', values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return true;
    }
    catch (error) {
        if (!error?.response) {
            console.log('Сервер не отвечает.');
        } 
        else {
            console.log('Запрос был прерван:', error);
        }
    }
}

async function deletePosition(positionId) {
    try {
        const response = await AxiosInstance.delete(`/Position/${positionId}`)

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return true;
    }
    catch (error) {
        if (!error?.response) {
            console.log('Сервер не отвечает.');
        }
        else {
            if (error.response.status === 400) {
                alert(error.response.data);
                return false;
            } 
            
            console.log('Запрос был прерван:', error.message);
        }
    }
}