import { AdModel } from "../model/AdModel";

const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác

export const CreateAd = async (ad: AdModel): Promise<AdModel> => {
    const formData = new FormData();
    formData.append('title', ad.title);
    formData.append('description', ad.description);
    formData.append('tag', ad.tag); // Thêm trường tag
    if (ad.image) {
        formData.append('image', ad.image); // Nếu có hình ảnh
    }

   
        const response = await fetch(`${API_URL}/ads`, {
            method: "POST",
            body: formData, // Sử dụng FormData
        });
        const data = response.json();
        // if (!response.ok) {
        //     throw new Error(data.message || 'Failed to create ad');
        // }
        return data;
    
};

export const GetAllAd = async (): Promise<AdModel[]> => {
    const response = await fetch(`${API_URL}/ads`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch ads');
    }
    return data;
};

export const DeleteAd = async (id: string) => {
    const response = await fetch(`${API_URL}/ads/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Nếu yêu cầu thành công, không cần đọc dữ liệu
    if (!response.ok) {
        const data = await response.json(); // Chỉ đọc dữ liệu nếu có lỗi
        throw new Error(data.message || 'Failed to delete ad');
    }
    
    return { status: true }; // Trả về trạng thái thành công
};

// Cập nhật quảng cáo
export const UpdateAd = async (id: string, ad: AdModel): Promise<AdModel> => {
    const formData = new FormData();
    formData.append('title', ad.title);
    formData.append('description', ad.description);
    formData.append('tag', ad.tag); // Thêm trường tag
    if (ad.image) {
        formData.append('image', ad.image); // Nếu có hình ảnh
    }

    const response = await fetch(`${API_URL}/ads/${id}`, {
        method: "POST",
        body: formData, // Sử dụng FormData
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update ad');
    }
    return data;
};
