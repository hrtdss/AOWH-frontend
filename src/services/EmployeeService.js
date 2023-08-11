import AxiosInstance from './AxiosInstance';


export const EmployeeService = {
    getListOfEmployees,
    getDataByEmployeeId,
    addEmployee,
    editEmployee
};

const stocks = JSON?.parse(sessionStorage.getItem('stocks'));

async function getListOfEmployees() {
    try {
        const response = await AxiosInstance.get('/Employee')

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
        const response = await AxiosInstance.get(`/Employee/${employeeId}`)

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }
        
        const data = response.data;

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
            stocks: `[${data.stocks[0].stockId}]`, // ! fix
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

        const index = stocks.findIndex(value => value.stockId === parseInt(data.stocks.replace(/[^0-9]+/g, "")));
        const newValue = { employeeId: data.employeeId, 
                            name: data.name, 
                            surname: data.surname, 
                            patronymic: data.patronymic, 
                            stocks: [stocks[index]], 
                            link: data.link };
        
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

        const index = stocks.findIndex(value => value.stockId === parseInt(data.stocks.replace(/[^0-9]+/g, "")));
        const newValue = { employeeId: data.employeeId, 
                            name: data.name, 
                            surname: data.surname, 
                            patronymic: data.patronymic, 
                            stocks: [stocks[index]], 
                            link: data.link };
        
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

