import AxiosInstance from './AxiosInstance';


export const AccountingService = {
    getAccounting
};

const allStocks = JSON?.parse(sessionStorage.getItem('allStocks'));

async function getAccounting(year, month, stockId) {
    try {
        const response = await AxiosInstance.get('/Accounting', { params: { year: year, month: month, stockId: stockId } });

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.data;
        const index = allStocks.findIndex(stock => stock.value === stockId);

        const accounting = {
            stock: allStocks[index],
            date: [year, month],
            data: data
        };

        localStorage.setItem('savedAccounting', JSON.stringify(accounting));
        
        return data;
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
