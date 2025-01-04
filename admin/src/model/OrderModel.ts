export interface OrderModel {
    _id: string
    userId: string
    items: {
        productId: string
        name: string
        quantity: number
        price: number
        image: string[]
    }[]
    totalAmount: number
    // address: string
    address: Array<{
        userNameAddress: string
        phoneAddress: string
        province: string
        district: string
        ward: string
        addressDetail: string
    }>
    orderCode: string
    paymentMethod: string
    status: string
    statuspay: string
    date: Date
}
