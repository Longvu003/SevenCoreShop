export interface Order {
    _id: string;
    userId: string;
    items: {
        productId: string;
        name: string;
        quantity: number;
        price: number;
        image: string[];
    }[];
    totalAmount: number;
    address: string;
    orderCode: string;
    paymentMethod: string;
    status: string;
    date: Date;
}