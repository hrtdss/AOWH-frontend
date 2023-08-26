import axios from 'axios';

import AxiosInstance from './AxiosInstance';


export const StockService = {
    getListOfStocks,
    getLinksByStock
};

async function getListOfStocks() {
    try {
        const response = await axios.get('https://b2b.otr-it.ru/api/public/storages')

        if (response.status !== 200) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        let data = await response.data;

        let result = []; // { value: '', label: 'Все' }
        for (let i = 0; i < data.length; i++) {
            result.push({ value: data[i].id, label: data[i].fullTitle });
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

async function getLinksByStock(stockId) {
    try {
        const response = await AxiosInstance.get(`/Stock/${stockId}`)

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