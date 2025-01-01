import { ThongKe } from '../model/Top1ItemModel';
import {GetThongKe} from '../service/Top1ItemService';
import { useState } from 'react';

export const Top1ItemController = () => {
   
    const thongke = async () => {
        try {
            const thongKe = await GetThongKe();
            return thongKe;
        } catch (error) {
            console.error('Lỗi Tải Dữ Liệu', error);
            return [];
        }
    };
    return {
        thongke, 
      };
};