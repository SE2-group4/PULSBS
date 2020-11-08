class Lecture{
    constructor(lectureId,courseId,classId,date){
        this.lectureId=lectureId;
        this.courseId=courseId;
        this.classId=classId;
        this.date=date;
    }

    static from(json){
        return Object.assign(new Lecture(),json);
    }
}

export default Lecture;