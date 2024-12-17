import { AdModel } from '../model/AdModel';
import { CreateAd, GetAllAd, DeleteAd, UpdateAd } from '../service/AdService';
import { useState, useEffect } from 'react';

export const useAdController = () => {
    const [dataAd, setDataAd] = useState<AdModel[]>([]);

    // Lấy tất cả quảng cáo
    const getAllAds = async () => {
        try {
            const ads = await GetAllAd();
            setDataAd(ads); // Cập nhật trạng thái với danh sách quảng cáo
            return ads;
        } catch (error) {
            console.error('Lỗi Tải Quảng Cáo', error);
            return [];
        }
    };

    // Tạo quảng cáo mới
    const createAd = async (ad: AdModel) => {
        try {
            const newAd = await CreateAd(ad);
            setDataAd((prevAds) => [...prevAds, newAd]); // Cập nhật trạng thái với quảng cáo mới
            return { status: true, newAd }; // Trả về trạng thái thành công
        } catch (error) {
            console.error('Lỗi Tạo Quảng Cáo', error);
            return { status: false, message: 'Lỗi không xác định' }; // Trả về thông báo lỗi
        }
    };

    // Xóa quảng cáo theo ID
    const deleteAdbyid = async (id: string) => {
        try {
            const response = await DeleteAd(id);
            // Kiểm tra cấu trúc phản hồi từ API
            console.log('Delete Response:', response);
            if (response.status) {
                setDataAd((prevAds) => prevAds.filter((ad) => ad._id !== id)); // Xóa quảng cáo khỏi trạng thái
                return { status: true }; // Trả về trạng thái thành công
            } else {
                console.error('Lỗi Xóa Quảng Cáo: ', response);
                return { status: false, message: response }; // Trả về thông báo lỗi
            }
        } catch (error) {
            console.error('Lỗi Xóa Quảng Cáo', error);
            return { status: false, message: 'Lỗi không xác định' }; // Trả về thông báo lỗi chung
        }
    };

    // Cập nhật quảng cáo
    const updateAd = async (id: string, ad: AdModel) => {
        try {
            const updatedAd = await UpdateAd(id, ad);
            setDataAd((prevAds) => prevAds.map((item) => (item._id === id ? updatedAd : item))); // Cập nhật quảng cáo trong trạng thái
            return { status: true, updatedAd }; // Trả về trạng thái thành công
        } catch (error) {
            console.error('Lỗi Cập Nhật Quảng Cáo', error);
            return { status: false, message: 'Lỗi Cập Nhật Quảng Cáo' }; // Trả về thông báo lỗi
        }
    };

    // Tải danh sách quảng cáo khi khởi tạo hook
    useEffect(() => {
        getAllAds();
    }, []);

    return {
        createAd,
        getAllAds,
        deleteAdbyid,
        updateAd,
        dataAd,
    };
};