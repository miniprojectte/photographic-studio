// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getTodayBookings
} = require('../controllers/bookingController');

// Base route /api/bookings
router.route('/')
  .get(getBookings)
  .post(createBooking);

// Get today's bookings
router.get('/today', getTodayBookings);

// Route with ID parameter /api/bookings/:id
router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;

