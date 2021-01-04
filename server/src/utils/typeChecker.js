const Lecture = require("../entities/Lecture");
const Booking = require("../entities/Booking");

/**
 * Check if the switchTo is a valid delivery mode
 * @param {String} switchTo
 * @returns {Boolean}
 */
function isValidDeliveryMode(switchTo) {
    if (!switchTo) return false;

    if (
        switchTo.toUpperCase() === Lecture.DeliveryType.PRESENCE ||
        switchTo.toUpperCase() === Lecture.DeliveryType.REMOTE
    ) {
        return true;
    }

    return false;
}

/**
 * Check if the status is a valid value for Bookings.status
 * @param {String} status 
 * @returns {Boolean}
 */
function isValidBookingStatus(status) {
    if (!status) return false;

    if (
        status.toUpperCase() === Booking.BookingType.PRESENT ||
        status.toUpperCase() === Booking.BookingType.NOT_PRESENT
    ) {
        return true;
    }

    return false;
}

module.exports = { isValidDeliveryMode, isValidBookingStatus };
