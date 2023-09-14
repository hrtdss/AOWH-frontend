import AxiosInstance from './AxiosInstance';


export const AccountingService = {
    getAccounting,
    updateEmployeeAccounting
};

async function getAccounting(year, month, stockId) {
    try {
        const response = await AxiosInstance.get('/Accounting', { params: { year: year, month: month, stockId: stockId } });

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const accountingData = await response.data;

        const allStocks = JSON?.parse(localStorage.getItem('allStocks'));
        const index = allStocks.findIndex(stock => stock.value === stockId);

        const accounting = {
            stock: allStocks[index],
            date: [year, month],
            data: accountingData
        };

        localStorage.setItem('savedAccounting', JSON.stringify(accounting));
        
        return accountingData;
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

async function updateEmployeeAccounting(index, fieldName, values) {
    try {
        const response = await AxiosInstance.patch('/Accounting/certainFields', values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const accounting = JSON.parse(localStorage.getItem('savedAccounting'));

        const requiredEmployee = accounting.data[index];
        requiredEmployee[fieldName] = values[fieldName];

        accounting.data[index] = requiredEmployee;

        localStorage.setItem('savedAccounting', JSON.stringify(accounting));
        
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