import { Products } from "../model/ProductModel"
import { GetProduct, DeleteProduct, EditProductByid, CreateProduct, GetProductById, UpdateProductAvailability } from "../service/ProducService"

const handleApiError = (error: any, action: string) => {
    console.error(`${action} failed`, error)
    return { error: true, message: `${action} failed: ${error.message || error}` }
}

export const userProducts = () => {
    const getProduct = async () => {
        try {
            const products = await GetProduct()
            return products
        } catch (error) {
            return handleApiError(error, "Get product")
        }
    }

    const deleteProduct = async (id: string) => {
        try {
            const result = await DeleteProduct(id)
            return result
        } catch (error) {
            return handleApiError(error, "Delete product")
        }
    }

    const editProduct = async (id: string, product: Products) => {
        try {
            if (!product.category) {
                throw new Error("Category is required")
            }

            const updatedProduct = await EditProductByid(id, product)
            return updatedProduct
        } catch (error) {
            return handleApiError(error, "Update product")
        }
    }

    const createProduct = async (product: Products) => {
        try {
            const createdProduct = await CreateProduct(product)
            return createdProduct
        } catch (error) {
            return handleApiError(error, "Create product")
        }
    }

    const getProductById = async (id: string) => {
        try {
            const getProducts = await GetProductById(id)
            return getProducts
        } catch (error) {
            console.error("Failed to get product", error)
            return error
        }
    }

    const updateProductAvailability = async (id: string, available: boolean) => {
        try {
            const updatedProduct = await UpdateProductAvailability(id, available)
            return updatedProduct
        } catch (error) {
            console.error("Failed to update product availability", error)
            return error
        }
    }

    return {
        getProduct,
        deleteProduct,
        editProduct,
        createProduct,
        getProductById,
        updateProductAvailability,
    }
}
