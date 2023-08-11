import AxiosInstance from './AxiosInstance';


export const PositionService = {
    getListOfPositions,
    getDataAboutPosition,
    addPosition,
    editPosition
};

async function getListOfPositions() {
    try {
        const response = await AxiosInstance.get('/Position')

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