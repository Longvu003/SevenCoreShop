

export interface Voucher {
    _id: string; // Unique identifier for the voucher
    code: string; // Unique identifier for the voucher
    titleVoucher: string; // Title of the voucher
    discountValue: number; // Discount value in percentage or fixed amount
    quantity: number; 
    expiryDate: Date; // Expiry date of the voucher
    status: "active" | "inactive"; // Current status of the voucher
    
  }
  