class Course{
    constructor(courseId,description,year){
        this.courseId=courseId;
        this.description=description;
        this.year=year;
    }

    static from(json){
        return Object.assign(new Course(),json);
    }
}

export default Course;