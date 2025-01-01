import { PayOnline } from '../model/PayOnlineModel';
import { GetPayOnlineList, DeletePayOnlineById, UpdatePayOnlineById, CreatePayOnline, GetPayOnlineById } from '../service/PayOnlineSevice';

export const payOnlineController = () => {

    const getPayOnlineList = async () => {
        try {
            const payOnlineList = await GetPayOnlineList();
            return payOnlineList;
        } catch (error) {
            console.error('Failed to get pay online list', error);
            return error;
        }
    };

    const deletePayOnlineById = async (id: string) => {
        try {
            const deletePayOnline = await DeletePayOnlineById(id);
            return deletePayOnline;
        } catch (error) {
            console.error('Failed to delete pay online entry', error);
            return error;
        }
    };

    const updatePayOnline = async (id: string | undefined, payOnline: PayOnline) => {
        try {
            const updatePayOnline = await UpdatePayOnlineById(id, payOnline);
            return updatePayOnline;
        } catch (error) {
            console.error('Failed to update pay online entry', error);
            return error;
        }
    };

    const createPayOnline = async (payOnline: PayOnline) => {
        try {
            const createPayOnline = await CreatePayOnline(payOnline);
            return createPayOnline;
        } catch (error) {
            console.error('Failed to create pay online entry', error);
            return error;
        }
    };

    const getPayOnlineById = async (id: string) => {
        try {
            const getPayOnlineById = await GetPayOnlineById(id);
            return getPayOnlineById;
        } catch (error) {
            console.error('Failed to get pay online entry by id', error);
            return error;
        }
    };

    return {
        getPayOnlineList, deletePayOnlineById, updatePayOnline, createPayOnline, getPayOnlineById
    };
};