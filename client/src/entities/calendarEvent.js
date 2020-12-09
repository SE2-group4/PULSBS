class CalendarEvent {
    constructor(id, title, start, end, color, status, lectureId, courseId, bookingDeadline, availableSeats, className) {
        this.id = id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.color = color;
        this.status = status;
        this.lectureId = lectureId;
        this.courseId = courseId;
        this.bookingDeadline = bookingDeadline;
        this.availableSeats = availableSeats;
        this.class = className;
    }
}

export default CalendarEvent;