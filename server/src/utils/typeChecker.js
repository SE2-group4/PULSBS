const Lecture = require("../entities/Lecture");

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

module.exports = { isValidDeliveryMode };
