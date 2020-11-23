class Lecture{
    constructor(lectureId,courseId,classId,date,bookingDeadline,delivery){
        this.lectureId=lectureId;
        this.courseId=courseId;
        this.classId=classId;
        this.date=date;
        this.bookingDeadline=bookingDeadline;
        this.delivery=delivery;
    }

    static from(json){
        return Object.assign(new Lecture(),json);
    }
}

export default Lecture;