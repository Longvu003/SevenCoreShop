export interface AdModel {
    _id: string; // ID của quảng cáo
    title: string; // Tiêu đề quảng cáo
    tag: string; // Thẻ phân loại quảng cáo
    description: string; // Mô tả quảng cáo
    image: File | null; // Tệp hình ảnh (sẽ cần chuyển đổi từ chuỗi)
    createdAt: string; // Ngày tạo quảng cáo
    updatedAt: string; // Ngày cập nhật quảng cáo
}