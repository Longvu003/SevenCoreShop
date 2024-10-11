
export interface Category {
    category_id: string;
    category_name: string;
}

export interface Products {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    images: string[];
    description: string;
    category: Category;
    avaialble: boolean;
    creatAt: string;
    updateAt: string;
}
