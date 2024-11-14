import { useEffect, useState } from 'react';
import { Products } from '../model/ProductModel';
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

    const editProduct = async (id: string,product:Products) => {
        try {
            const updateProduct = await EditProductByid(id,product);
            return updateProduct;
        } catch (error) {
            console.error('Failed to update product', error);
            return error
        }
    }

    const createProduct = async (product: Products) => {
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
            const getProducts = await GetProductById(id);
            return getProducts;
        } catch (error) {
            console.error('Failed to get product', error);
            return error
        }
    }


    return {
        getProduct, deleteProduct, editProduct,createProduct,getProductById
    };
};
