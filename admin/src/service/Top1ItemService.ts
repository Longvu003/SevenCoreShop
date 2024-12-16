import {ThongKe} from '../model/Top1ItemModel';

const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác

export const GetThongKe = async ():Promise<ThongKe> => {   
        const response = await fetch(`${API_URL}/bestsell/thongke`, {
        });
        const data = response.json();
        return data;
    
};