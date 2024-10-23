import React from 'react';
import {Category} from '../model/CategoriesModel';
import { GetCategories,DeleteCategoriesByid,UpdateCategoriesByid,CreateCategories,GetCategoriesById } from '../service/CategoriesSevice';


export const categoryController = () => {

  const getCategories = async () => {
      try {
          const getCategories = await GetCategories();
          return getCategories;
      } catch (error) {
          console.error('Failed to get categories', error);
          return error
      }
  }

  const deleteCategoriesById = async (id: string) => {
      try {
          const deleteCategories = await DeleteCategoriesByid(id);
          return deleteCategories;
      } catch (error) {
          console.error('Failed to delete categories', error);
          return error
      }
  }

  const updateCategories = async (id: string | undefined,category:Category) => {
      try {
          const updateCategories = await UpdateCategoriesByid(id,category);
          return updateCategories;
      } catch (error) {
          console.error('Failed to update categories', error);
          return error
      }
  }

  const createCategories = async (category:Category) => {
      try {
          const createCategories = await CreateCategories(category);
          return createCategories;
      } catch (error) {
          console.error('Failed to create categories', error);
          return error
      }
  }

  // getCategoriesbyId
  const getCategoriesById = async (id: string) => {
    try {
        const getCategoriesById = await GetCategoriesById(id);
        return getCategoriesById;
    } catch (error) {
        console.error('Failed to get id categories', error);
        return error
    }
}

  return {
      getCategories, deleteCategoriesById, updateCategories, createCategories,getCategoriesById
  };
  
};
