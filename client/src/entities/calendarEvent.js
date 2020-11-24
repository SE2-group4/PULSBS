class CalendarEvent{
    constructor(id,title,start,end,color,status,lectureId,courseId,bookingDeadline){
        this.id=id;
        this.title=title;
        this.start=start;
        this.end=end;
        this.color=color;
        this.status=status;
        this.lectureId=lectureId;
        this.courseId=courseId;
        this.bookingDeadline=bookingDeadline
    }
}

export default CalendarEvent;