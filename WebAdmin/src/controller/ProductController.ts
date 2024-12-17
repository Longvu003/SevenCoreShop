import { useEffect, useState } from 'react';
import { Product } from '../model/ProductModel';
import { GetProduct, DeleteProduct,EditProductByid,CreateProduct, GetProductById } from '../service/ProducService';

export const userProducts = () => {


    const getProduct = async () => {
        try {
            const getProducts = await GetProduct();
            return getProducts;
        } catch (error) {
            console.error('Failed to get product', error);
            return error
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const deleteProducts = await DeleteProduct(id);
            return deleteProducts;
        } catch (error) {
            console.error('Failed to delete produc', error);
            return error
        }
    };

    const editProduct = async (id: string, product:Product) => {
        try {
            const updateProduct = await EditProductByid(id,product);
            return updateProduct;
        } catch (error) {
            console.error('Failed to update product', error);
            return error
        }
    }

    const createProduct = async (product: Product) => {
        try {
            const createProducts = await CreateProduct(product);
            return createProducts;
        } catch (error) {
            console.error('Failed to create product', error);
            return error
        }
    }

    const getProductById = async (id: string) => {
        try {
            const getProductById = await GetProductById(id);
            return getProductById;
        } catch (error) {
            console.error('Failed to get id products', error);
            return error
        }
    }


    return {
        getProduct, deleteProduct, editProduct,createProduct, getProductById
    };
};
