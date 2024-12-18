
// export interface Category {
//     category_id: string;
//     category_name: string;

import { Category } from "./CategoriesModel";

    
// }

export interface Products {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    images: string;
    description: string;
    categoryId: Category;
    avaialble: boolean;
    creatAt: string;
    updateAt: string;
}