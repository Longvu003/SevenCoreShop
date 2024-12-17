import { Products } from "../model/ProductModel"
import { GetProduct, DeleteProduct, EditProductByid, CreateProduct, GetProductById } from "../service/ProducService"
// import { handleApiError } from "../utils/errorHandler"

export const userProducts = () => {
    const getProduct = async () => {
        try {
            const products = await GetProduct()
            return products
        } catch (error) {
            console.error("Failed to get product", error)
            return error
        }
    }

    const deleteProduct = async (id: string) => {
        try {
            const result = await DeleteProduct(id)
            return result
        } catch (error) {
            console.error("Failed to delete produc", error)
            return error
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
            console.error("Failed to update product", error)
            return error
        }
    }

    const createProduct = async (product: Products) => {
        try {
            const createdProduct = await CreateProduct(product)
            return createdProduct
        } catch (error) {
            console.error("Failed to create product", error)
            return error
        }
    }

    const getProductById = async (id: string) => {
        try {
            const product = await GetProductById(id)
            return product
        } catch (error) {
            console.error("Failed to get product", error)
            return error
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
