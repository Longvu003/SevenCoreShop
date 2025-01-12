import { Voucher } from "./../model/VoucherModel"
import React from "react"
import { deleteVoucherByid, createNewVoucher, getListVoucher, UpdateVoucherByid, GetVoucherById } from "../service/VoucherService"

export const voucherController = () => {
    const getVoucher = async () => {
        try {
            const getVoucher = await getListVoucher()
            return getVoucher
        } catch (error) {
            console.error("Failed to get vouchers", error)
            return error
        }
    }

    const deleteVoucherById = async (id: string) => {
        try {
            const deleteVoucher = await deleteVoucherByid(id)
            return deleteVoucher
        } catch (error) {
            console.error("Failed to delete Voucher", error)
            return error
        }
    }

    const createVoucher = async (voucher: Voucher) => {
        try {
            const createVoucher = await createNewVoucher(voucher)
            return createVoucher
        } catch (error) {
            console.error("Failed to create Voucher", error)
            return error
        }
    }

    const UpdateVoucher = async (id: string | undefined, voucher: Voucher) => {
        try {
            const updateVoucher = await UpdateVoucherByid(id, voucher)
            return updateVoucher
        } catch (error) {
            console.error("Failed to update notification", error)
            return error
        }
    }

    const getVoucherById = async (id: string) => {
        try {
            const getVoucherById = await GetVoucherById(id)
            return getVoucherById
        } catch (error) {
            console.error("Failed to get id categories", error)
            return error
        }
    }

    return {
        getVoucher,
        deleteVoucherById,
        createVoucher,
        getVoucherById,
        UpdateVoucher
    }
}
