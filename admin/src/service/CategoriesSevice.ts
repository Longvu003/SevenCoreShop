import React from "react"
import { Category } from "../model/CategoriesModel"
import { GetProductByCategoryId } from "./ProducService"

import API_URL from "../Config"
export const GetCategories = async (): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/getAllcategory`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    })
    const data: any = await response.json()

    if (!response.ok) {
        return data
    }

    return data // Trả về đối tượng Hospital
}

export const DeleteCategoriesByid = async (id: string): Promise<void> => {
    try {
        // // Fetch products by category ID
        // const products = await GetProductByCategoryId(id);

        // // Handle undefined or null product response
        // if (!products) {
        //     console.error('Error fetching products for category:', id);
        //     alert('Lỗi khi lấy sản phẩm. Vui lòng thử lại.');
        //     return; // Stop further execution
        // }

        // // Check if category contains active products
        // if (products.length > 0) {
        //     alert("Không thể xóa danh mục có sản phẩm đang hoạt động");
        //     return;  // Stop further execution
        // }

        // Proceed with delete request
        const response = await fetch(`${API_URL}/categories/${id}/delete`, {
            method: "POST", // Use POST for delete operation
            headers: {
                "Content-Type": "application/json",
            },
        })

        // Check if response is okay
        if (!response.ok) {
            const errorData = await response.json() // Parse the error response
            console.error("Error deleting category:", errorData)
            alert("Xóa Thất Bại: " + (errorData.message || "Lỗi không xác định"))
            return
        }

        // If everything goes well, show success message
        alert("Xóa danh mục thành công")
    } catch (error) {
        // Handle unexpected errors (network issues, etc.)
        console.error("Unexpected error during delete:", error)
        alert("Đã xảy ra lỗi. Vui lòng thử lại.")
    }
}

export const UpdateCategoriesByid = async (id: string | undefined, category: Category): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}/update`, {
        method: "post",
        body: JSON.stringify(category),
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

export const CreateCategories = async (category: Category): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/add`, {
        method: "post",
        body: JSON.stringify(category),
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

export const GetCategoriesById = async (id: string): Promise<Category> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
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
