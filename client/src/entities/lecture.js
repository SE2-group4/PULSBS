class Lecture{
    constructor(lectureId,courseId,classId,startingDate,bookingDeadline,delivery){
        this.lectureId=lectureId;
        this.courseId=courseId;
        this.classId=classId;
        this.startingDate=startingDate;
        this.bookingDeadline=bookingDeadline;
        this.delivery=delivery;
    }

    static from(json){
        return Object.assign(new Lecture(),json);
    }
}

export default Lecture;