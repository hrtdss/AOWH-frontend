import AxiosInstance from './AxiosInstance';


export const EmployeeService = {
    getListOfEmployees,
    getDataByEmployeeId,
    addEmployee,
    editEmployee,
    terminateEmployee
};

const allStocks = JSON?.parse(sessionStorage.getItem('allStocks'));

async function getListOfEmployees() {
    try {
        const response = await AxiosInstance.get('/Employee');

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

async function getDataByEmployeeId(employeeId) {
    try {
        const response = await AxiosInstance.get(`/Employee/${employeeId}`);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        
        const data = response.data;

        const stocks = data.stocks;
        let result = [];

        for (let stock of stocks) {
            result.push({ value: stock.stockId, label: stock.stockName });
        }

        const requiredData = {
            password: data.password,
            name: data.name,
            surname: data.surname,
            patronymic: data.patronymic,
            birthday: data.birthday,
            passportNumber: data.passportNumber,
            passportIssuer: data.passportIssuer,
            passportIssueDate: data.passportIssueDate,
            startOfTotalSeniority: data.startOfTotalSeniority,
            startOfLuchSeniority: data.startOfLuchSeniority,
            dateOfTermination: data.dateOfTermination,
            positionId: data.position.positionId,
            salary: data.salary,
            quarterlyBonus: data.position.quarterlyBonus,
            link: data.link,
            stocks: result,
            forkliftControl: data.forkliftControl,
            rolleyesControl: data.rolleyesControl,
            percentageOfSalaryInAdvance: data.percentageOfSalaryInAdvance,
            dateOfStartInTheCurrentPosition: data.dateOfStartInTheCurrentPosition,
            dateOfStartInTheCurrentStock: data.dateOfStartInTheCurrentStock,
            dateOfStartInTheCurrentLink: data.dateOfStartInTheCurrentLink
        };

        return { employeeId: data.employeeId, employeeData: requiredData };
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

async function addEmployee(values) {
    try {
        const response = await AxiosInstance.post('/Employee', values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = response.data;

        const stocks = JSON.parse(data.stocks);
        let result = [];

        for (let stock of stocks) {
            const index = allStocks.findIndex(data => data.value === stock);
            result.push({ stockId: allStocks[index].value, stockName: allStocks[index].label });
        }

        const newValue = { 
            employeeId: data.employeeId, 
            name: data.name, 
            surname: data.surname, 
            patronymic: data.patronymic, 
            stocks: result, 
            link: data.link 
        };
        
        return newValue;
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

async function editEmployee(employeeId, values) {
    try {
        const response = await AxiosInstance.put(`/Employee/${employeeId}`, values);

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = response.data;

        const stocks = JSON.parse(data.stocks);
        let result = [];

        for (let stock of stocks) {
            const index = allStocks.findIndex(data => data.value === stock);
            result.push({ stockId: allStocks[index].value, stockName: allStocks[index].label });
        }

        const newValue = { 
            employeeId: data.employeeId, 
            name: data.name, 
            surname: data.surname, 
            patronymic: data.patronymic, 
            stocks: result, 
            link: data.link 
        };

        return newValue;
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

async function terminateEmployee(employeeId, values) {
    try {
        const response = await AxiosInstance.delete(`/Employee/${employeeId}`, { data: values });

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
