import AxiosInstance from './AxiosInstance';


export const AccountingService = {
    getAccounting
};

async function getAccounting(year, month, stockId) {
    try {
        const response = await AxiosInstance.get('/Accounting', { params: { year: year, month: month, stockId: stockId } });

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
