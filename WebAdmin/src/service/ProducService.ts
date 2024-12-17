import { ex } from '@fullcalendar/core/internal-common';
import { Product } from '../model/ProductModel';
const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác
export const GetProduct = async (): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/all`, {
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

//creat new product
export const CreateProduct = async (product: Product): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
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

  return data;
}

export const DeleteProduct = async (id: string): Promise<Product> => {
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

  return data;
}

// get product by id
export const GetProductById = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
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

export const EditProductByid = async (id: string, product: Product): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "put",
    body: JSON.stringify(product),
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