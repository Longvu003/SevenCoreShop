import { ex } from "@fullcalendar/core/internal-common"
import { Products } from "../model/ProductModel"
import API_URL from "../Config"
export const GetProduct = async (): Promise<Products> => {
    const response = await fetch(`${API_URL}/products/all`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data: any = await response.json()

    if (!response.ok) {
        return data
    }

    return data
}

//creat new product
export const CreateProduct = async (product: Products): Promise<Products> => {
    const response = await fetch(`${API_URL}/products/add`, {
        method: "post",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data: any = await response.json()

    if (!response.ok) {
        return data
    }

    return data
}

export const DeleteProduct = async (id: string): Promise<Products> => {
    const response = await fetch(`${API_URL}/products/${id}/delete`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data: any = await response.json()

    if (!response.ok) {
        return data
    }

    return data
}

// get product by id
export const GetProductById = async (id: string): Promise<Products> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const errorData = await response.json() // Lấy dữ liệu lỗi
        throw new Error(errorData.message || "Failed to fetch product") // Ném lỗi nếu không thành công
    }

    const data: Products = await response.json()
    return data // Trả về dữ liệu sản phẩm
}

export const EditProductByid = async (id: string, product: Products): Promise<Products> => {
    const response = await fetch(`${API_URL}/products/update/${id}`, {
        method: "put",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data: any = await response.json()

    if (!response.ok) {
        return data
    }

    return data
}

export const GetProductByCategoryId = async (id: string): Promise<Products[]> => {
    try {
        const response = await fetch(`${API_URL}/products?categoryId=${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if (!response.ok) {
            return []
        }
        return data.products || []
    } catch (error) {
        console.error("Failed to fetch products by category ID:", error)
        return []
    }
}
<<<<<<< HEAD
=======

// Update product availability
export const UpdateProductAvailability = async (id: string, available: boolean): Promise<Products> => {
  const response = await fetch(`${API_URL}/products/${id}/availability`, {
    method: "post",
    body: JSON.stringify({ available }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: any = await response.json();

  if (!response.ok) {
    return data;
  }

  return data;
};
>>>>>>> c80f2b0358a9614232bb6cf1c7de73bc2e28c092
