import { UserModel } from '../model/UserModel';
import { loginUser, GetAllUser, DeleteUser, UpdateUser, DeleteUserById, LockUserById, UnlockUserById } from '../service/UserService';
import { useState } from 'react';
export const useloginUser = () => {
  const [dataUser, setdataUser] = useState<UserModel[]>([]);
  const LoginUser = async (user: UserModel) => {
    try {
      const newHospital = await loginUser(user);

      return newHospital;
    } catch (error) {
      console.error('Failed login', error);
      return error
    }
  };

  const getAllUser = async () => {
    try {
      const getAllUser = await GetAllUser();
      return getAllUser;
    } catch (error) {
      console.error('Failed to get product', error);
      return error
    }
  };
  const deleteUser = async (id: string) => {
    try {
      const deleteUser = await DeleteUser(id);
      return deleteUser;
    } catch (error) {
      console.error('Failed to delete produc', error);
      return error
    }
  }

  const updateUser = async (id: string, user: UserModel) => {
    try {
      const updateUser = await UpdateUser(id, user);
      return updateUser;
    } catch (error) {
      console.error('Failed to update produc', error);
      return error
    }
  }

  //deleteUser by id
  const deleteUserbyId = async (id: string) => {
    try {
      const deleteUserById = await DeleteUserById(id);
      return deleteUserById;
    } catch (error) {
      console.error('Failed to delete user', error);
      return error
    }

  }
  //updateUser by id
  const updateUserbyId = async (id: string, user: UserModel) => {
    try {
      const updateUserById = await UpdateUser(id, user);
      return updateUserById;
    } catch (error) {
      return error
    }
  }
  //lockuser by id
  const lockUserbyId = async (id: string) => {
    try {
      const lockUserById = await LockUserById(id);
      return lockUserById;
    } catch (error) {
      return error
    }
  }
  //unlockuser by id
  const unlockUserbyId = async (id: string) => {
    try {
      const unlockUserById = await UnlockUserById(id);
      return unlockUserById;
    } catch (error) {
      return error
    }
  }

  return {
    LoginUser, getAllUser, deleteUser, updateUser, deleteUserbyId, updateUserbyId, lockUserbyId, unlockUserbyId
  };
}