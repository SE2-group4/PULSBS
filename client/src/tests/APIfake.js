import User from "../entities/user";
import Course from '../entities/course';
import Lecture from '../entities/lecture'
/**
 * APIfake.js contains fake API which emulates the REST API behaviours
 */
const students =[
                new User(1,"Student","Francesco", "Rossi","fr@email.com","ciao1"),
                new User(3,"Teacher","Monica","Gialli","mg@email.com","ciao2")
                ]
/** 
 * All the courses of stedent[0] (Francesco Rossi)
 */ 
const courses = [
                new Course(1,"Web Aplication 1","2020"),
                new Course(2,"Data Science","2020")
                ]

/**
 * All the lectures
 */
const lectures = [
                new Lecture(1,1,1,"10-11-2020 12:00"),
                new Lecture(2,1,1,"25-11-2020 13:00"),
                new Lecture(3,2,2,"12-12-2020 09:00")
                ]
/**
 * All the lessons booked
 */
const booked =[];

/**
 * userLogin sends to server the user credentials and it returns success or failure (and the description of them)
 */
async function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        let okUser;
        for (let s of students)
            if(s.email===email)
                if(s.password===password)
                    okUser=s;
        if(okUser===undefined)
            reject({"error" : "Invalid credentials"})
        else if (okUser)
                resolve(okUser);
    })
        
}


/**
 * getCoursesByStudentId performs a GET request towards the server to gain the all courses of a certain student
 */
async function getCoursesByStudentId(id){
    return new Promise((resolve,reject)=>{
        resolve(courses);
    });
};


/**
 *  getLecturesByCourseId performs a GET request towards the server to gain the all the lectures of a certain course of a certain student
 */
async function getLecturesByCourseId(Uid,Cid){
    return new Promise((resolve,reject)=>{
        /*fetch(baseURL + `/students/${Uid}/courses/${Cid}`).then((response)=>{
            if(response.ok)
                resolve(response.json());
            else reject((obj) => { reject(obj); });
        }).catch((err)=>{ reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    */
        resolve(lectures.filter((l)=>l.courseId===Cid));
   });
};


/**
 * bookALecture sends to server the course, student and lecture IDs in order to book the lecture
 */
async function bookALecture(Uid,Cid,Lid) {
    return new Promise((resolve, reject) => {
        resolve();
        })
}

export {userLogin,getCoursesByStudentId,getLecturesByCourseId,bookALecture};