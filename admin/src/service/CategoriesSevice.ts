import React from 'react';
import { Category } from '../model/CategoriesModel';
import { GetProductByCategoryId } from './ProducService'; 
const API_URL = 'http://localhost:7777';

export const GetCategories = async (): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: any = await response.json();

  if (!response.ok) {
    return data
  }

  return data;  // Trả về đối tượng Hospital
}

export const DeleteCategoriesByid = async (id: string): Promise<Category> => {

    // Kiểm tra xem có sản phẩm nào đang hoạt động trong danh mục này không
    const products = await GetProductByCategoryId(id);
    if (products.length > 0) {
      throw new Error('Cannot delete category with active products');
    }

  const response = await fetch(`${API_URL}/categories/${id}/delete`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: any = await response.json();

  if (!response.ok) {
    return data
  }

  return data;
}

export const UpdateCategoriesByid = async (id: string | undefined, category: Category): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}/update`, {
    method: "post",
    body: JSON.stringify(category),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: any = await response.json();

  if (!response.ok) {
    return data
  }

  return data;
}

export const CreateCategories = async (category: Category): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/add`, {
    method: "post",
    body: JSON.stringify(category),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: any = await response.json();

  if (!response.ok) {
    return data
  }

  return data;
}

export const GetCategoriesById = async (id: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: any = await response.json();

  if (!response.ok) {
    return data
  }

  return data;
}