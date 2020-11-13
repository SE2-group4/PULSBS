import User from '../entities/user';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import Student from '../entities/student';
/**
 * API.js contains all the API for server communications
 */
const baseURL = "/api/v1";


/**
 * userLogin sends to server the user credentials and it returns success or failure (and the description of them)
 */
async function userLogin(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(User.from(user));
                });
            } else{
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


/**
 * getCoursesByStudentId performs a GET request towards the server to gain the all courses of a certain student
 */
async function getCoursesByStudentId(id){
    return new Promise((resolve,reject)=>{
        fetch(baseURL + `/students/${id}/courses`).then((response)=>{
            if(response.ok)
                resolve(response.json());
            else reject((obj) => { reject(obj); });
        }).catch((err)=>{ reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
};


/**
 *  getLecturesByCourseId performs a GET request towards the server to gain the all the lectures of a certain course of a certain student
 */
async function getLecturesByCourseId(Uid,Cid){
    return new Promise((resolve,reject)=>{
        fetch(baseURL + `/students/${Uid}/courses/${Cid}/lectures`).then((response)=>{
            if(response.ok)
                resolve(response.json());
            else reject((obj) => { reject(obj); });
        }).catch((err)=>{ reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
};


/**
 * bookALecture sends to server the course, student and lecture IDs in order to book the lecture
 */
async function bookALecture(Uid,Cid,Lid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${Uid}/courses/${Cid}/lectures/${Lid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({studentId: Uid}),
        }).then((response) => {
            if (response.ok) {
                console.log("ok prenotato");
               resolve()
            } else{
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

/**
 * 	getCoursesByTeacherId performs a GET request towards the server to gain the all courses taught by 
 *	a certain teacher
 */
async function getCoursesByTeacherId(id){
    return new Promise((resolve,reject)=>{
        fetch(baseURL + `/teachers/${id}/courses`).then((response)=>{
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve(obj.map((c) => Course.from(c))); }) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
};

/**
 *  getLecturesByCourseIdByTeacherId performs a GET request towards the server to gain the all the lectures of 
 *	a certain course taught by a certain teacher
 */
async function getLecturesByCourseIdByTeacherId(Uid,Cid){
    return new Promise((resolve,reject)=>{
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures`).then((response)=>{
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve(obj.map((l) => Lecture.from(l))); }) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
};

/**
 * 	getStudentsByLecture performs a GET request towards the server to gain the all the students booked to 
 *	a certain lecture of a certain course taught by a certain teacher
 */
async function getStudentsByLecture(Uid,Cid,Lid) {
    return new Promise((resolve,reject)=>{
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures/${Lid}/students`).then((response)=>{
            const status = response.status;
            if (response.ok) {
                response.json()
                .then((obj) => { resolve(obj.map((s) => Student.from(s))); }) 
                .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { obj.status = status; reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
};

const API= {userLogin,getCoursesByStudentId,getLecturesByCourseId,bookALecture,getCoursesByTeacherId,getLecturesByCourseIdByTeacherId,getStudentsByLecture};
export default API;
