import AxiosInstance from './AxiosInstance';


export const ShiftService = {
    getListOfOpenShifts,
    getPastShifts,
    openShift,
    editShift,
    closeShift,
    setCommentsForShift
};

async function getListOfOpenShifts(stockId) {
    try {
        const response = await AxiosInstance.get(`/Shift/${stockId}`);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = response.data;

        return {
            value: {
                shiftId: data.shiftId,
                dayOrNight: data.dayOrNight,
                employees: data.employees
            },
            label: `${data.dayOrNight} -- ${data.openingDateAndTime} -- ...` 
        };
    }
    catch (error) {
        if (!error?.response) {
            console.log('Сервер не отвечает.');
        } 
        else {
            if (error.response.status === 400) {
                return 'Смена не найдена';
            }

            console.log('Запрос был прерван:', error.message);
        }
    }   
}

async function getPastShifts(stockId) {
    try {
        const response = await AxiosInstance.get(`/Shift/past/${stockId}`);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = response.data;

        const result = [];
        for (let value of data) {
            result.push({ 
                value: { 
                    dayOrNight: value.dayOrNight,
                    employees: value.employees
                },
                label: `${value.dayOrNight} -- ${value.openingDateAndTime} -- ${value.closingDateAndTime}` 
            });
        }

        return result;
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
        const response = await AxiosInstance.post('/Shift/open', values);

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

async function editShift(shiftId, values) {
    try {
        const response = await AxiosInstance.put(`/Shift/${shiftId}`, values);

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

async function closeShift(values) {
    try {
        const response = await AxiosInstance.post('/Shift/close', values);

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

async function setCommentsForShift(shiftInfoId, values) {
    try {
        const response = await AxiosInstance.post(`/Shift/${shiftInfoId}`, values);

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