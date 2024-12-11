export interface ThongKe {
    name: string;   
    TongTienThang: number;
    TongTienNam: number;
    TongDonHang: Array<{
        _id: string;
        quantity: number;
    }>;
    bestSellingProduct: Array<
    {
        _id: string;
        name: string;
    }>;

}
