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

export const UpdateUser = async (id: string, user: UserModel): Promise<UserModel> => {
  try {
      const response = await fetch(`${API_URL}/users/${id}/updateuserbyid`, {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update user');
      }

      const data: UserModel = await response.json();
      return data;  // Trả về đối tượng 
  } catch (error) {
      throw error;  // Ném lại lỗi để xử lý ở nơi khác nếu cần
  }
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

//update user by id
export const UpdateUserById = async (id: string, user: UserModel): Promise<UserModel> => {
  try {
      const response = await fetch(`${API_URL}/users/${id}/updateuserbyid`, {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update user');
      }

      const data: UserModel = await response.json();
      return data;  // Trả về đối tượng 
  } catch (error) {
      console.error('Error updating user:', error);
      throw error;  // Ném lại lỗi để xử lý ở nơi khác nếu cần
  }
}

//lockuser by id
export const LockUserById = async (id: string): Promise<UserModel> => {
  try {
      const response = await fetch(`${API_URL}/users/${id}/lockuserbyid`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to lock user');
      }

      const data: UserModel = await response.json();
      return data;  // Trả về đối tượng 
  } catch (error) {
      console.error('Error locking user:', error);
      throw error;  // Ném lại lỗi để xử lý ở nơi khác nếu cần
  }
}
//unlock user by id
export const UnlockUserById = async (id: string): Promise<UserModel> => {
  try {
      const response = await fetch(`${API_URL}/users/${id}/unlockuserbyid`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to unlock user');
      }

      const data: UserModel = await response.json();
      return data;  // Trả về đối tượng 
  } catch (error) {
      console.error('Error unlocking user:', error);
      throw error;  // Ném lại lỗi để xử lý ở nơi khác nếu cần
  }
}