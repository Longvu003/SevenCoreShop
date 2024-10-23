import { ex } from '@fullcalendar/core/internal-common';
import {UserModel} from '../model/UserModel';
const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác
export const loginUser = async  (user:UserModel):Promise<UserModel>=>{
    const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu 
      return data;  // Trả về đối tượng 
}

export const GetAllUser = async ():Promise<UserModel[]>=>{
    const response = await fetch(`${API_URL}/users/getalluser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu 
      return data;  // Trả về đối tượng 
}

export const DeleteUser = async (id:string):Promise<UserModel>=>{
    const response = await fetch(`${API_URL}/users/${id}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu 
      return data;  // Trả về đối tượng 
}

export const UpdateUser = async (id:string,user:UserModel):Promise<UserModel>=>{
    const response = await fetch(`${API_URL}/users/${id}/update`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu 
      return data;  // Trả về đối tượng 
}

//delete user by id
export const DeleteUserById = async (id:string):Promise<UserModel>=>{
    const response = await fetch(`${API_URL}/users/${id}/deleteuserbyid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: any = await response.json();

      if (!response.ok) {
        return data
      }
    
      // Chuyển đổi phản hồi thành JSON và trả về đối tượng kiểu 
      return data;  // Trả về đối tượng 
}