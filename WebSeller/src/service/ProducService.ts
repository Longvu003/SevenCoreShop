import { ex } from '@fullcalendar/core/internal-common';
import { Products } from '../model/ProductModel';
const API_URL = 'http://localhost:7777'; // Cập nhật URL chính xác
export const GetProduct = async (): Promise<Products> => {
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

  return data;
}

//creat new product
export const CreateProduct = async (product: Products): Promise<Products> => {
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

export const DeleteProduct = async (id: string): Promise<Products> => {
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
export const GetProductById = async (id: string): Promise<Products> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json(); // Lấy dữ liệu lỗi
    throw new Error(errorData.message || 'Failed to fetch product'); // Ném lỗi nếu không thành công
  }

  const data: Products = await response.json();
  return data; // Trả về dữ liệu sản phẩm
}


export const EditProductByid = async (id: string, product: Products): Promise<Products> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}/update`, {
      method: "post",  
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Kiểm tra nếu response không thành công
    if (!response.ok) {
      const contentType = response.headers.get("Content-Type");
      let errorMessage = 'Unknown error';
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        errorMessage = data.message || 'Unknown error';
      }
      console.error('Error updating product:', errorMessage);
      throw new Error(errorMessage);
    }

    // Trả về kết quả nếu update thành công
    const data: Products = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;  // Ném lại lỗi để có thể xử lý ở phía gọi hàm
  }
};



export const GetProductByCategoryId = async (id: string): Promise<Products[]> => {
  try {
      const response = await fetch(`${API_URL}/products?categoryId=${id}`, {
          method: "get",
          headers: {
              "Content-Type": "application/json",
          },
      });
      const data = await response.json();
      if (!response.ok) {
          return []; 
      }
      return data.products || []; 
  } catch (error) {
      console.error('Failed to fetch products by category ID:', error);
      return []; 
  }
}