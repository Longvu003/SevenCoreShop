import { useEffect, useState } from 'react';
import { Products } from '../model/ProductModel';
import { GetProduct, DeleteProduct,UpdateProductByid } from '../service/ProducService';

export const userProducts = () => {


    const getProduct = async () => {
        try {
            const getProducts = await GetProduct();

            // Cập nhật danh sách bệnh viện khi tạo thành công

            // Thông báo thành công
            return getProducts;
        } catch (error) {
            console.error('Failed to create hospital', error);
            return error
        }
    };

    const deleteProduct = async (id: string) => {
        try {
            const deleteProducts = await DeleteProduct(id);


            // Cập nhật danh sách bệnh viện khi tạo thành công

            // Thông báo thành công
            return deleteProducts;
        } catch (error) {
            console.error('Failed to create hospital', error);
            return error
        }
    };

    const updateProduct = async (id: string,product:Products) => {
        try {
            const updateProduct = await UpdateProductByid(id,product);
            // Thông báo thành công
            return updateProduct;
        } catch (error) {
            console.error('Failed to create product', error);
            return error
        }
    }


    return {

        getProduct, deleteProduct, updateProduct
    };
};
