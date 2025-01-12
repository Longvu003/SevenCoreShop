const express = require('express');
const router = express.Router();
const VoucherController = require('../controllers/VoucherController');

// Route to validate a voucher
// Method: POST
// URL: /vouchers/validate
// Description: Validates a voucher provided by the user
router.post('/validate', async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ status: false, message: 'Voucher code is required' });
        }

        const validationResult = await VoucherController.validateVoucher(code);
        return res.status(200).json({ status: true, data: validationResult });
    } catch (error) {
        console.error('Validate voucher error:', error.message);
        res.status(500).json({ status: false, message: error.message });
    }
});

// Route to create a new voucher (Admin function)
// Method: POST
// URL: /vouchers/create
// Description: Allows admins to create a new voucher
router.post('/', async (req, res, next) => {
    try {
        const { code, discountValue, quantity, expiryDate, titleVoucher } = req.body;
        const newVoucher = await VoucherController.createVoucher(code, discountValue, quantity, expiryDate, titleVoucher);
        return res.status(201).json({ status: true, data: newVoucher });
    } catch (error) {
        console.error('Create voucher error:', error.message);
        res.status(500).json({ status: false, message: error.message });
    }
});

// Route to get all vouchers (Admin function)
// Method: GET
// URL: /vouchers
// Description: Retrieves a list of all vouchers for admin purposes
router.get('/', async (req, res, next) => {
    try {
        const vouchers = await VoucherController.getVouchers();
        return res.status(200).json({ status: true, data: vouchers });
    } catch (error) {
        console.error('Get vouchers error:', error.message);
        res.status(500).json({ status: false, message: error.message });
    }
});


router.delete('/:id/', async (req, res, next) => {
    try {
        const id = req.params.id;
        const voucher = await VoucherController.deleteVoucherById(id);
        return res.status(200).json({ status: true, data: voucher });
    } catch (error) {
        console.log('Delete voucher error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

router.put('/:id/update', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { code, discountValue, quantity, expiryDate, titleVoucher } = req.body;
        const voucher = await VoucherController.updateVoucher(id, code, discountValue, quantity, expiryDate, titleVoucher);
        return res.status(200).json({ status: true, data: voucher });
    } catch (error) {
        console.log('Update voucher error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

router.put('/:id/updateQuantity', async (req, res, next) => {
    try {
        const id = req.params.id;
            const voucher = await VoucherController.useVoucher(id);
        return res.status(200).json({ status: true, data: voucher });
    } catch (error) {
        console.log('Update quantity voucher error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const voucher = await VoucherController.getVoucherById(id);
        return res.status(200).json({ status: true, data: voucher });
    } catch (error) {
        console.log('Get voucher by id error', error.message);
        res.status(500).json({ status: false, data: error.message });
    }
});

module.exports = router;
