/**
 * Booking entity
 * @author Gastaldi Paolo
 * @version 1.0.0
 */
"use strict";

class Booking {
    /**
     * type status for the booking
     */
    static BookingType = {
        ERROR: "ERROR",
        UNDEFINED: "UNDEFINED",
        BOOKED: "BOOKED",
        UNBOOKED: "UNBOOKED",
        PRESENT: "PRESENT",
        NOT_PRESENT: "NOT_PRESENT",
        ABSENT: "NOT_PRESENT",
        // add more here
    };
}

module.exports = Booking;
