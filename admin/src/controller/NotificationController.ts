import { GetNotificationById, UpdateNotificationByid } from './../service/NotificationService';
import { Notification } from './../model/NotificationModel';
import React from 'react';
import { GetNotification, CreateNotification, deleteNotificationByid } from '../service/NotificationService';


export const notificationController = () => {

  const getNotification = async () => {
      try {
          const getNotification = await GetNotification();
          return getNotification;
      } catch (error) {
          console.error('Failed to get Notification', error);
          return error
      }
  };

  const deleteNotificationById = async (id: string) => {
      try {
          const deleteNotification = await deleteNotificationByid(id);
          return deleteNotification;
      } catch (error) {
          console.error('Failed to delete Notification', error);
          return error
      }
  };

  const UpdateNotification = async (id: string | undefined, notification: Notification) => {
        try {
            const updateNotification = await UpdateNotificationByid(id, notification);
            return updateNotification;
        } catch (error) {
            console.error('Failed to update notification', error);
            return error
        }
    };

  const createNotification = async (notification: Notification) => {
      try {
          const createNotification = await CreateNotification(notification);
          return createNotification;
      } catch (error) {
          console.error('Failed to create categories', error);
          return error
      }
  };

  const getNotificationById = async (id: string) => {
      try {
          const getNotificationById = await GetNotificationById(id);
          return getNotificationById;
      } catch (error) {
          console.error('Failed to get id categories', error);
          return error
      }
    };

  return {
      getNotification, createNotification, deleteNotificationById, UpdateNotification, getNotificationById
  };
  
};
