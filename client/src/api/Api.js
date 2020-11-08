import User from "../entities/user";
import Course from '../entities/course';
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
                resolve(Course.from(response.json()));
            else reject((obj) => { reject(obj); });
        }).catch((err)=>{ reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
};


/**
 *  getLecturesByCourseId performs a GET request towards the server to gain the all the lectures of a certain course of a certain student
 */
async function getLecturesByCourseId(Uid,Cid){
    return new Promise((resolve,reject)=>{
        fetch(baseURL + `/students/${Uid}/courses/${Cid}`).then((response)=>{
            if(response.ok)
                resolve(response.json());
            else reject((obj) => { reject(obj); });
        }).catch((err)=>{ reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
};


/**
 * bookALecture sends to server the course, student and lecture IDs in order to book the lecture
 */
async function bookALecture() {
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
