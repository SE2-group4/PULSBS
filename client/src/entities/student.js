class Student{
    constructor(studentId,firstName,lastName,email,password){
        this.studentId=studentId;
        this.firstName=firstName;
        this.lastName=lastName;
        this.email=email;
        this.password=password;
    }
    
        static from(json){
            return Object.assign(new Student(),json);
        }
    }
    
export default Student;












