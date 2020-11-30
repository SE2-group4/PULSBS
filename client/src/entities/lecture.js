class Lecture {
    constructor(lectureId, courseId, classId, startingDate, duration, bookingDeadline, delivery, numBookings) {
        this.lectureId = lectureId;
        this.courseId = courseId;
        this.classId = classId;
        this.startingDate = startingDate;
        this.duration = duration;
        this.bookingDeadline = bookingDeadline;
        this.delivery = delivery;
        this.numBookings = numBookings;
    }

    static from(json) {
        return Object.assign(new Lecture(), json);
    }
}

export default Lecture;