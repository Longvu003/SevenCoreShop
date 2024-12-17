// export interface Category {
//     category_id: string
//     category_name: string
// }

import { Category } from "./CategoriesModel"

export interface Product {
    _id: string
    name: string
    price: number
    quantity: number
    images: string[] // Mảng hình ảnh của sản phẩm
    description: string // Mô tả sản phẩm
    category: Category // Danh mục sản phẩm
    available: boolean // Trạng thái có sẵn hay không
    createdAt: string // Ngày tạo
    updatedAt: string // Ngày cập nhật
}