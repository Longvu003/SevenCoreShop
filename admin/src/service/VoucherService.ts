import React from "react"
import { Voucher } from "../model/VoucherModel"
const API_URL = "http://localhost:7777"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

export const getListVoucher = async (): Promise<Voucher> => {
    const response = await fetch(`${API_URL}/Voucher/`, {
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

export const deleteVoucherByid = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/Voucher/${id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error("Error deleting Voucher:", errorData)
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


export const createNewVoucher = async (voucher: Voucher): Promise<Voucher> => {
    const response = await fetch(`${API_URL}/Voucher/`, {
        method: "post",
        body: JSON.stringify(voucher),
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

export const UpdateVoucherByid = async (id: string | undefined, voucher: Voucher): Promise<Voucher> => {
    const response = await fetch(`${API_URL}/Voucher/${id}/update`, { 
        method: "put",
        body: JSON.stringify(voucher),
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

export const GetVoucherById = async (id: string): Promise<Voucher> => {
    const response = await fetch(`${API_URL}/Voucher/${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch Voucher")
    }

    const data: Voucher = await response.json()
    return data
}