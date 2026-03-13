const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');
const Booking = require('../models/bookingModel');

// Lazy-load Razorpay instance so missing keys don't crash server startup
function getRazorpay() {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay keys not configured in .env');
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

// ── POST /api/payment/create-order ──────────────────────────────────────────
// Creates a Razorpay order for a given session type & amount
router.post('/create-order', protect, async (req, res) => {
    try {
        const razorpay = getRazorpay();
        const { amount, sessionType, currency = 'INR' } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Razorpay expects paise (1 INR = 100 paise)
            currency,
            receipt: `bk_${Date.now()}`,  // max 40 chars
            notes: {
                userId: req.user.id.toString(),
                sessionType,
            },
        });

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to create payment order' });
    }
});

// ── POST /api/payment/verify ────────────────────────────────────────────────
// Verifies the Razorpay signature and creates the booking on success
router.post('/verify', protect, async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingData,            // { name, email, phone, sessionType, date, message }
        } = req.body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
        }

        // Verify HMAC-SHA256 signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Payment verification failed – invalid signature' });
        }

        // Signature valid → create the booking record
        const booking = await Booking.create({
            ...bookingData,
            user: req.user.id,
            paymentStatus: 'paid',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: 'confirmed',    // Auto-confirm paid bookings
        });

        await booking.populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Payment verified and booking confirmed!',
            booking,
        });
    } catch (err) {
        console.error('Verify payment error:', err);
        res.status(500).json({ success: false, message: err.message || 'Payment verification failed' });
    }
});

module.exports = router;
