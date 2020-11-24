import User from '../entities/user';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import Student from '../entities/student';
/**
 * API.js contains all the API for server communications
 */
const baseURL = "/api/v1";

/************************ LOGIN API *******************************/
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
            body: JSON.stringify({ email: email, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((user) => {
                    resolve(User.from(user));
                });
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

/************************* STUDENT API *************************************/
/**
 * getCoursesByStudentId performs a GET request towards the server to gain the all courses of a certain student
 */
async function getCoursesByStudentId(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${id}/courses`).then((response) => {
            if (response.ok)
                resolve(response.json());
            else reject((obj) => { reject(obj); });
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
}


/**
 *  getLecturesByCourseId performs a GET request towards the server to gain the all the lectures of a certain course of a certain student
 */
async function getLecturesByCourseId(Uid, Cid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${Uid}/courses/${Cid}/lectures`).then((response) => {
            if (response.ok)
                resolve(response.json());
            else reject((obj) => { reject(obj); });
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
}


/**
 * bookALecture sends to server the course, student and lecture IDs in order to book the lecture
 */
async function bookALecture(Uid, Cid, Lid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${Uid}/courses/${Cid}/lectures/${Lid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId: Uid }),
        }).then((response) => {
            if (response.ok) {
                resolve()
            } else {
                response.json()
                    .then((obj) => { reject(obj.error); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

/**
 * Delete the reservation for a lecture 
 * @param {*} Uid studentId
 * @param {*} Cid courseId
 * @param {*} Lid lectureId
 */
async function cancelLectureReservation(Uid, Cid, Lid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${Uid}/courses/${Cid}/lectures/${Lid}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 204) {
                resolve()
            } else {
                response.json()
                    .then((obj) => { reject(obj.error); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

/**
 * Fetch all the booked lectures of the student
 * @param {*} Uid studentId
 */
async function getBookedLectures(Uid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${Uid}/bookings`).then((response) => {
            if (response.ok)
                resolve(response.json());
            else reject((obj) => { reject(obj); });
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) })
    });
}


/************************** TEACHER API *****************************/
/**
 * 	getCoursesByTeacherId performs a GET request towards the server to gain the all courses taught by 
 *	a certain teacher
 *  @param {*} id teacherId
 */
async function getCoursesByTeacherId(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${id}/courses`).then((response) => {
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
}

/**
 *  getLecturesByCourseIdByTeacherId performs a GET request towards the server to gain the all the lectures of 
 *	a certain course taught by a certain teacher
 *  @param {*} Uid teacherId
 *  @param {*} Cid courseId
 *  @param {*} dateFrom date
 *  @param {*} dateTo date
 */
async function getLecturesByCourseIdByTeacherId(Uid, Cid, dateFrom, dateTo) {
    let qfrom = dateFrom ? "from=" + dateFrom : "";
    let qto = dateTo ? "to=" + dateTo : "";
    qto = qfrom ? "&" + qto : qto;                      //chiedere conferma
    let query = qfrom || qto ? "?" + qfrom + qto : "";

    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures${query}`).then((response) => {
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
}

/**
 * 	getStudentsByLecture performs a GET request towards the server to gain the all the students booked to 
 *	a certain lecture of a certain course taught by a certain teacher
 *  @param {*} Uid teacherId
 *  @param {*} Cid courseId
 *  @param {*} Lid lectureId
 */
async function getStudentsByLecture(Uid, Cid, Lid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures/${Lid}/students`).then((response) => {
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
}

/**
 *  updateDeliveryByLecture performs a PUT request toward the server to update Delivery attribute of a certain lecture of
 *  a certain course taught by a certain teacher  
 *  @param {*} Uid teacherId
 *  @param {*} Cid courseId
 *  @param {*} Lid lectureId
 *  @param {*} Delivery delivery{presence,remote}
 */
async function updateDeliveryByLecture(Uid, Cid, Lid, Delivery) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures/${Lid}?switchTo=${Delivery}`, {
            method: 'PUT',
        }).then((response) => {
            if (response.status === 204) {
                resolve(); //delivery correctly updated
            } else {
                response.json()
                    .then((obj) => { reject(obj.error); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

/**
 * Delete a lecture 
 * @param {*} Tid teacherId
 * @param {*} Cid courseId
 * @param {*} Lid lectureId
 */
async function deleteLecture(Tid, Cid, Lid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${Tid}/courses/${Cid}/lectures/${Lid}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 204) {
                resolve()
            } else {
                response.json()
                    .then((obj) => { reject(obj.error); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

const API = {
    userLogin, getCoursesByStudentId, getLecturesByCourseId, bookALecture, cancelLectureReservation, getBookedLectures, getCoursesByTeacherId,
    getLecturesByCourseIdByTeacherId, getStudentsByLecture, updateDeliveryByLecture, deleteLecture
};
export default API;
