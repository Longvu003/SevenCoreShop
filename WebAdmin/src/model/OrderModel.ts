// export interface OrderModel {
//     ID_User: string; // ID của người dùng (ObjectId dạng chuỗi)
//     Total: number; // Tổng tiền đơn hàng
//     Products: string[]; // Mảng chứa ID của các sản phẩm (dạng chuỗi)
//     Status: string; // Trạng thái đơn hàng
//     CreatedAt: string; // Ngày tạo đơn hàng (dạng chuỗi)
// }

// model/OrderModel.ts
export interface OrderModel {
    _id: string;
    ID_User: string;
    Total: number;
    Products: string[]; // Mảng ID sản phẩm
    Status: string;
    CreatedAt: string; // Hoặc Date nếu bạn muốn
    // Thêm các trường khác nếu có
}

