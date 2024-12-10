import { Product } from "./ProductModel";
import { UserModel } from "./UserModel";

// OrderModel.ts
// export interface Product {
//   productId: string;   // ID của sản phẩm
//   quantity: number;    // Số lượng của sản phẩm
//   total: number;       // Tổng giá trị của sản phẩm (quantity * price)
// }

// Định nghĩa interface hoặc type cho User
// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   // Các trường khác của User nếu có
// }

export interface OrderModel {
  _id: string;                // ID của đơn hàng
  userId: UserModel;             // ID của người dùng (user)
  products: Product[];        // Mảng các sản phẩm trong đơn hàng
  totalAmount: number;        // Tổng tiền của đơn hàng
  status: 'pending' | 'completed' | 'canceled';   // Trạng thái đơn hàng
  paymentMethod: 'credit_card' | 'paypal' | 'momo' | 'cash_on_delivery';  // Phương thức thanh toán
  paymentStatus: 'unpaid' | 'paid' | 'failed';    // Trạng thái thanh toán
  deliveryStatus: 'pending' | 'shipped' | 'delivered';  // Trạng thái giao hàng
  payUrl?: string;            // URL thanh toán (có thể có nếu phương thức thanh toán yêu cầu)
  orderDate: string;          // Ngày tạo đơn hàng (dạng ISO string)
  updatedAt: string;          // Thời gian cập nhật đơn hàng (dạng ISO string)
}
