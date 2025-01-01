import { PayOnline } from '../model/PayOnlineModel';
const API_URL = 'http://localhost:7777';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const GetPayOnlineList = async (): Promise<PayOnline[]> => {
    const response = await fetch(`${API_URL}/payonline`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data: any = await response.json();

    if (!response.ok) {
        return data;
    }

    return data;
};

export const DeletePayOnlineById = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/payonline/${id}/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error deleting pay online entry:', errorData);
            MySwal.fire({
                title: 'Xóa Thất Bại',
                text: errorData.message || 'Lỗi không xác định',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        return response.json();
    } catch (error) {
        console.error('Unexpected error during delete:', error);
        MySwal.fire({
            title: 'Xóa Thất Bại',
            text: error instanceof Error ? error.message : 'Lỗi không xác định',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};

export const UpdatePayOnlineById = async (id: string | undefined, payOnline: PayOnline): Promise<PayOnline> => {
    const response = await fetch(`${API_URL}/payonline/${id}/update`, {
        method: "post",
        body: JSON.stringify(payOnline),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data: any = await response.json();

    if (!response.ok) {
        return data;
    }

    return data;
};

export const CreatePayOnline = async (payOnline: PayOnline): Promise<PayOnline> => {
    const response = await fetch(`${API_URL}/payonline/add`, {
        method: "post",
        body: JSON.stringify(payOnline),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data: any = await response.json();

    if (!response.ok) {
        return data;
    }

    return data;
};

export const GetPayOnlineById = async (id: string): Promise<PayOnline> => {
    const response = await fetch(`${API_URL}/payonline/${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pay online entry');
    }

    const data: PayOnline = await response.json();
    return data;
};