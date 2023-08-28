import AxiosInstance from './AxiosInstance';


export const WorkPlanService = {
    setWorkPlan,
    getWorkPlan
};

async function setWorkPlan(employeeId, year, month, values) {
    try {
        const response = await AxiosInstance.post('/WorkPlan', { params: { employeeId: employeeId, year: year, month: month } }, values);

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

async function getWorkPlan(employeeId, year, month) {
    try {
        const response = await AxiosInstance.get('/WorkPlan', { params: { employeeId: employeeId, year: year, month: month } });

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
            if (error.response.status === 400) {
                return false;
            }

            console.log('Запрос был прерван:', error.message);
        }
    }
}