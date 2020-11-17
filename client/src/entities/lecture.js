class Lecture{
    constructor(lectureId,courseId,classId,date,bookingDeadline){
        this.lectureId=lectureId;
        this.courseId=courseId;
        this.classId=classId;
        this.date=date;
        this.bookingDeadline=bookingDeadline;
    }

    static from(json){
        return Object.assign(new Lecture(),json);
    }
}

export default Lecture;