import { Products } from "../model/ProductModel"
import { GetProduct, DeleteProduct, EditProductByid, CreateProduct, GetProductById } from "../service/ProducService"

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
            const product = await GetProductById(id)
            return product
        } catch (error) {
            return handleApiError(error, "Get product by id")
        }
    }

    return {
        getProduct,
        deleteProduct,
        editProduct,
        createProduct,
        getProductById,
    }
}
