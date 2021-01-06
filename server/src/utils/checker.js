const Booking = require("../entities/Booking");
const Course = require("../entities/Course");
const Lecture = require("../entities/Lecture");
const Teacher = require("../entities/Teacher");
const db = require("../db/Dao");

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

/**
 * Check if a lecture is switchable.
 * A lecture is switchable if the request is sent 30m before the scheduled starting time of a lecture
 * @param {Lecture} lecture
 * @param {String} mode
 * @param {Date} requestDateTime
 * @returns {Boolean}
 */
function isLectureSwitchable(lecture, mode, requestDateTime, strictMode = true) {
    const newMode = mode.toUpperCase();

    if (strictMode) {
        if (newMode === Lecture.DeliveryType.PRESENCE || lecture.delivery === Lecture.DeliveryType.REMOTE) {
            return false;
        }
    }

    if (!requestDateTime) requestDateTime = new Date();

    const lectStartingTimeMs = lecture.startingDate.getTime();
    const requestTimeMs = requestDateTime.getTime();
    const minDiffAllowed = 30 * 60 * 1000;

    if (lectStartingTimeMs - requestTimeMs > minDiffAllowed) {
        return true;
    }

    return false;
}

/**
 * Check if a lecture is cancellable.
 * A lecture is cancellable if the request is sent 1h before the scheduled starting time of a lecture
 * @param {Lecture} lecture
 * @param {Date} requestDateTime
 * @returns {Boolean}
 */
function isLectureCancellable(lecture, requestDateTime) {
    if (!requestDateTime) requestDateTime = new Date();

    const lectStartingTimeMs = lecture.startingDate.getTime();
    const requestTimeMs = requestDateTime.getTime();
    const minDiffAllowed = 60 * 60 * 1000;

    if (lectStartingTimeMs - requestTimeMs > minDiffAllowed) {
        return true;
    }

    return false;
}

/**
 * Check if course has a lecture with id = lectureId
 *
 * courseId {Integer}
 * lectureId {Integer}
 * returns {Promise} boolean
 **/
async function courseLectureCorrelation(courseId, lectureId) {
    let doesBelong = false;

    const courseLectures = await db.getLecturesByCourseId(new Course(courseId));
    if (courseLectures.length > 0) {
        doesBelong = courseLectures.some((lecture) => lecture.lectureId === lectureId);
    }

    return doesBelong;
}

/**
 * Check if teacher is in charge of the course
 *
 * teacherId {Integer}
 * courseId {Integer}
 * returns {Promise} boolean
 **/
async function teacherCourseCorrelation(teacherId, courseId) {
    let isTeachingThisCourse = false;

    const teacherCourses = await db.getCoursesByTeacher(new Teacher(teacherId));
    if (teacherCourses.length > 0) {
        isTeachingThisCourse = teacherCourses.some((course) => course.courseId === courseId);
    }

    return isTeachingThisCourse;
}

module.exports = {
    courseLectureCorrelation,
    isLectureCancellable,
    isLectureSwitchable,
    isValidBookingStatus,
    isValidDeliveryMode,
    teacherCourseCorrelation,
};
