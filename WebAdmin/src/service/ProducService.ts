import { ex } from '@fullcalendar/core/internal-common';
import {Products} from '../model/ProductModel';
const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác
export const GetProduct = async  ():Promise<Products>=>{
    const response = await fetch(`${API_URL}/products`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu Hospital
      return data;  // Trả về đối tượng Hospital
}

export const DeleteProduct = async  (id:string):Promise<Products>=>{
    const response = await fetch(`${API_URL}/products/${id}/delete`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu Hospital
      return data; 
}

export const UpdateProductByid = async  (id:string,product:Products):Promise<Products>=>{
    const response = await fetch(`${API_URL}/products/${id}/update`, {
        method: "post",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu Hospital
      return data; 
}