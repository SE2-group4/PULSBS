class LectureWithClassInfo {
    constructor(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery, numBookings, classCapacity, className) {
        this.lectureId = lectureId;
        this.courseId = courseId;
        this.classId = classId;
        this.startingDate = startingDate;
        this.duration = duration;
        this.bookingDeadline = bookingDeadline;
        this.delivery = delivery;
        this.numBookings = numBookings;
        this.classCapacity = classCapacity;
        this.className = className;
    }

    static from(json) {
        return Object.assign(new LectureWithClassInfo(), json);
    }
}

export default LectureWithClassInfo;