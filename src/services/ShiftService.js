import AxiosInstance from './AxiosInstance';


export const ShiftService = {
    getListOfOpenShifts,
    openShift,
    closeShift,
    // editCurrentShift,
    // editPastShift,
};

async function getListOfOpenShifts(stockId) {
    try {
        const response = await AxiosInstance.get(`/Shift/get/${stockId}`)

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

async function openShift(values) {
    try {
        const response = await AxiosInstance.post('/Shift/open', values)

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

async function closeShift(values) {
    try {
        const response = await AxiosInstance.post('/Shift/close', values)

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
            console.log('Запрос был прерван:', error.message);
        }
    }
}