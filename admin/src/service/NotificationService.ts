import React from "react"
import { Notification } from "../model/NotificationModel"
const API_URL = "http://localhost:7777"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

export const GetNotification = async (): Promise<Notification> => {
    const response = await fetch(`${API_URL}/Notification/`, {
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

export const deleteNotificationByid = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/Notification/${id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Error deleting Notification:", errorData)
            MySwal.fire({
                title: "Xóa Thất Bại",
                text: errorData.message || "Lỗi không xác định",
                icon: "error",
                confirmButtonText: "OK",
            })
            return
        }
        return response.json()
    } catch (error) {
        console.error("Unexpected error during delete:", error)
        MySwal.fire({
            title: "Xóa Thất Bại",
            text: error instanceof Error ? error.message : "Lỗi không xác định",
            icon: "error",
            confirmButtonText: "OK",
        })
    }
}

// export const UpdateNotificationByid = async (id: string | undefined, Notification: NotificationModel): Promise<NotificationModel> => {
//     const response = await fetch(`${API_URL}/categories/${id}/update`, {
//         method: "post",
//         body: JSON.stringify(Notification),
//         headers: {
//             "Content-Type": "application/json",
//         },
//     })
//     const data: any = await response.json()

//     if (!response.ok) {
//         return data
//     }

//     return data
// }

export const CreateNotification = async (notification: Notification): Promise<Notification> => {
    const response = await fetch(`${API_URL}/Notification/`, {
        method: "post",
        body: JSON.stringify(notification),
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

export const UpdateNotificationByid = async (id: string | undefined, notification: Notification): Promise<Notification> => {
    const response = await fetch(`${API_URL}/Notification/${id}/update`, { 
        method: "put",
        body: JSON.stringify(notification),
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

export const GetNotificationById = async (id: string): Promise<Notification> => {
    const response = await fetch(`${API_URL}/Notification/${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch notification")
    }

    const data: Notification = await response.json()
    return data
}