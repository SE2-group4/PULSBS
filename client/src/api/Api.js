import User from '../entities/user';
import Course from '../entities/course';
import Lecture from '../entities/lecture';
import Student from '../entities/student';
import Schedule from '../entities/schedule';
import LectureWithClassInfo from '../entities/lectureWithClassInfo';

var sizeof = require('object-sizeof');
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
                response.json()
                    .then((user) => {
                        resolve(User.from(user));
                    });
            } else {
                response.json()
                    .then((obj) => { reject({ source: "Login", error: "invalid username and/or password" }) }) // error msg in the response body
                    .catch((err) => { reject({ source: "Login", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Login", error: "server error" }) }); // connection errors
    });
}
/**
 * userLogout performs logout also on server
 */
async function userLogout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                reject(null);
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
            else { reject("Server error (getCoursesByStudentId)"); }
        }).catch((err) => { reject("Server cannot communicate") })
    }
    );
}


/**
 *  getLecturesByCourseId performs a GET request towards the server to gain the all the lectures of a certain course of a certain student
 */
async function getLecturesByCourseId(Uid, Cid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${Uid}/courses/${Cid}/lectures`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((lectures) => resolve(parseLectures(lectures)))
            }

            else reject("Server error (getLecturesByCourseId)");
        }).catch((err) => { reject("Server cannot communicate") })
    });
}

function parseLectures(lectures) {
    return lectures.map((lecture) => new LectureWithClassInfo(lecture.lecture.lectureId, lecture.lecture.courseId, lecture.lecture.classId, lecture.lecture.startingDate,
        lecture.lecture.duration, lecture.lecture.bookingDeadline, lecture.lecture.delivery, lecture.nBookings, lecture.class_.capacity, lecture.class_.description))
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
            } else { reject("Server error") }
        }).catch((err) => { reject("Server cannot communicate") }); // connection errors
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
            if (response.status === 200) {
                response.json().then((obj) => { resolve(obj.availableSeats) })
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
            else reject("Server error (getBookedLectures)");
        }).catch((err) => { reject("Server cannot communicate") })
    });
}

/**
 * Permit to put the student in waiting list
 * @param {*} Uid StudentId
 * @param {*} Cid Course Id
 * @param {*} Lid Lecture Id
 */
async function putInWaitingList(Uid, Cid, Lid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/students/${Uid}/courses/${Cid}/lectures/${Lid}/queue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId: Uid }),
        }).then((response) => {
            if (response.ok) {
                resolve()
            } else reject("Server error")
        }).catch((err) => { reject("Server cannot communicate") }); // connection errors
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
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj.map((c) => Course.from(c))); })
                    .catch((err) => { reject({ source: "Course", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject({ source: "Course", error: "invalid parameter error" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Course", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Course", error: "server error" }) }); // connection errors
    });
}

/**
 *  getLecturesByCourseIdByTeacherId performs a GET request towards the server to gain the all the lectures of 
 *	a certain course taught by a certain teacher
 *  @param {*} Uid teacherId
 *  @param {*} Cid courseId
 *  @param {*} dateFrom date
 *  @param {*} dateTo date
 *  @param {*} bookings bookings
 *  @param {*} attendances attendances
 */
async function getLecturesByCourseIdByTeacherId(Uid, Cid, dateFrom, dateTo, bookings, attendances) {
    let qfrom = dateFrom ? "from=" + dateFrom : "";
    let qto = dateTo ? "to=" + dateTo : "";
    qto = qfrom && qto ? "&" + qto : qto;
    let qbook = bookings ? "bookings=true" : "";
    qbook = qbook && (qfrom || qto) ? "&" + qbook : qbook;
    let qatt = attendances ? "attendances=true" : "";
    qatt = qatt && (qfrom || qto || qbook) ? "&" + qatt : qatt;
    let query = qfrom || qto || qbook || qatt ? "?" + qfrom + qto + qbook + qatt : "";

    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures${query}`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => {
                        resolve(obj.map((l) => {
                            l.lecture["numBookings"] = l.bookings;
                            l.lecture["attendances"] = l.attendances;
                            return Lecture.from(l.lecture);
                        }
                        ));
                    })
                    .catch((err) => { reject({ source: "Lecture", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject({ source: "Lecture", error: "invalid parameter error" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // connection errors
    });
}

/**
 * 	getStudentsByLecture performs a GET request towards the server to gain the all the students booked to 
 *	a certain lecture of a certain course taught by a certain teacher
 *  @param {*} Uid teacherId
 *  @param {*} Cid courseId
 *  @param {*} Lid lectureId
 *  @param {*} status status
 */
async function getStudentsByLecture(Uid, Cid, Lid, status) {
    let query = status ? "?status=true" : "";
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures/${Lid}/students${query}`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => {
                        resolve(obj.map((s) => {
                            s.student["bookingStatus"] = s.bookingStatus;
                            return Student.from(s.student);
                        }));
                    })
                    .catch((err) => { reject({ source: "Student", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject({ source: "Student", error: "invalid parameter error" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Student", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Student", error: "server error" }) }); // connection errors
    });
}

/**
 *  updateDeliveryByLecture performs a PUT request toward the server to update Delivery attribute of a certain lecture of
 *  a certain course taught by a certain teacher  
 *  @param {*} Uid teacherId
 *  @param {*} Cid courseId
 *  @param {*} Lid lectureId
 *  @param {*} Delivery delivery {presence,remote}
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
                    .then((obj) => { reject({ source: "Lecture", error: "can't update delivery" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // connection errors
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
                    .then((obj) => { reject({ source: "Lecture", error: "can't delete lecture" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // connection errors
    });
}

/**
 * Update student status 
 * @param {*} Uid teacherId
 * @param {*} Cid courseId
 * @param {*} Lid lectureId
 * @param {*} Sid studentId
 * @param {*} status {PRESENT,ABSENT}
 */
async function updateStudentStatus(Uid, Cid, Lid, Sid, status) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/teachers/${Uid}/courses/${Cid}/lectures/${Lid}/students/${Sid}?status=${status}`, {
            method: 'PUT',
        }).then((response) => {
            if (response.ok) {
                resolve(); //student status correctly updated
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject({ source: obj.statusCode, error: obj.message }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Student", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Student", error: "server error" }) }); // connection errors
    });
}

/************************* SUPPORT OFFICER API *************************************/

/**
* performs a POST to send a file to back-end
* @param {*} id officerId
* @param {*} type string [students,courses,teachers,lectures,classes]
* @param {*} data file
*/

async function uploadList(id, type, data) {
    let formData = new FormData();
    formData.append('file', data);
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${id}/uploads/${type}`, {
            method: 'POST',
            body: formData,
        }).then((response) => {
            if (response.ok)
                resolve();
            else
                response.json()
                    .then((obj) => { reject({ source: "SupportOfficer", error: obj.message }); }) // error msg in the response body
                    .catch(() => { reject({ source: "SupportOfficer", error: "server error" }) }); // something else
        }).catch(() => { reject({ source: "Upload", error: "Server connection error" }) }); // connection errors
    });

}

async function getCoursesBySupportId(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${id}/courses`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ source: "SupportOfficer", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                if (response.status === 404)
                    reject()
                else reject("err")

            }
        }).catch((err) => { reject("err") }); // connection errors
    });
}

async function getLecturesByCourseId_S(id, courseId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${id}/courses/${courseId}/lectures`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ source: "SupportOfficer", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                if (response.status === 404)
                    reject()
                else reject("err")

            }
        }).catch((err) => { reject("err") }); // connection errors
    });
}


async function updateDeliveryByLecture_S(id, courseId, lectureId, delivery) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${id}/courses/${courseId}/lectures/${lectureId}?switchTo=${delivery}`, {
            method: 'PUT',
        }).then((response) => {
            if (response.ok) {
                resolve(); //delivery correctly updated
            } else {
                response.json()
                    .then((obj) => { reject({ source: "SupportOfficer", error: "can't update delivery" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "supportOfficer", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "SupportOfficer", error: "server error" }) }); // connection errors
    });
}

async function deleteLecture_S(Tid, Cid, Lid) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${Tid}/courses/${Cid}/lectures/${Lid}`, {
            method: 'DELETE'
        }).then((response) => {
            if (response.status === 204) {
                resolve()
            } else {
                response.json()
                    .then((obj) => { reject({ source: "Lecture", error: "can't delete lecture" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Lecture", error: "server error" }) }); // connection errors
    });
}

async function getSchedulesBySupportId(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${id}/schedules`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => {
                        resolve(obj.map((s) => Schedule.from(s)));
                    })
                    .catch(() => { reject({ source: "SupportOfficer", error: "Application parse error" }) }); // something else
            } else {
                response.json()
                    .then((obj) => reject({ source: "SupportOfficer", error: obj.message }))
                    .catch(() => reject({ source: "SupportOfficer", error: "Server error" }));
            }
        }).catch(() => { reject({ source: "SupportOfficer", error: "Server connection error" }) }); // connection errors
    });
}

async function changeScheduleData(id, newSchedule) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${id}/schedules/${newSchedule.scheduleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newSchedule),
        }).then((response) => {
            if (response.ok) {
                resolve();
            } else {
                response.json()
                    .then((obj) => { reject({ source: "SupportOfficer", error: obj.message }); }) // error msg in the response body
                    .catch(() => { reject({ source: "SupportOfficer", error: "Server error" }) }); // something else
            }
        }).catch(() => { reject({ source: "SupportOfficer", error: "Server error" }) }); // connection errors
    });
}

async function getRoomsBySupportId(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/supportOfficers/${id}/rooms`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => {
                        resolve(obj);
                    })
                    .catch(() => { reject({ source: "SupportOfficer", error: "Application parse error" }) }); // something else
            } else {
                response.json()
                    .then((obj) => reject({ source: "SupportOfficer", error: obj.message }))
                    .catch(() => reject({ source: "SupportOfficer", error: "Server error" }));
            }
        }).catch(() => { reject({ source: "SupportOfficer", error: "Server connection error" }) }); // connection errors
    });
}

/************************ BOOKING MANAGER ************************************/

async function getStudentBySSN(id, ssn) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/managers/${id}/students?ssn=${ssn}`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ source: "Student", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                if (response.status === 404)
                    reject()
                else reject("err")

            }
        }).catch((err) => { reject("err") }); // connection errors
    });
}

async function getStudentBySerialNumber(id, serialNumber) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/managers/${id}/students?serialNumber=${serialNumber}`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ source: "Student", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                if (response.status === 404)
                    reject()
                else reject("err")
            }
        }).catch((err) => { reject("err") }); // connection errors
    });
}

async function generateReport(id, serialNumber, date) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/managers/${id}/tracingReport/${serialNumber}?date=${date}`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ source: "Student", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject({ source: "Student", error: "invalid parameter error" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Student", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Student", error: "server error" }) }); // connection errors
    });
}

async function getAllCourses(id) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/managers/${id}/courses`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj) })
                    .catch((err) => { reject({ source: "Course", error: "application parse error" }) }); // something else
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject({ source: "Course", error: "invalid parameter error" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Course", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Course", error: "server error" }) }); // connection errors
    });
}


async function getAllCourseLectures(id, courseId) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + `/managers/${id}/courses/${courseId}/lectures?bookings=true&cancellations=true&attendances=true`).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => {

                        resolve(obj.map((l) => {
                            l.lecture["numBookings"] = l.bookings;
                            l.lecture["attendances"] = l.attendances;
                            return Lecture.from(l.lecture);
                        }
                        ));
                    })
                    .catch((err) => { reject({ source: "Course", error: "application parse error" }) }); // something else*/
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { console.log(obj); reject({ source: "Course", error: "invalid parameter error" }); }) // error msg in the response body
                    .catch((err) => { reject({ source: "Course", error: "server error" }) }); // something else
            }
        }).catch((err) => { reject({ source: "Course", error: "server error" }) }); // connection errors
    });
}

/******************************************************************************/

const API = {
    userLogin, userLogout, getCoursesByStudentId, getLecturesByCourseId, bookALecture, cancelLectureReservation, getBookedLectures, putInWaitingList, getCoursesByTeacherId,
    getLecturesByCourseIdByTeacherId, getStudentsByLecture, updateDeliveryByLecture, deleteLecture, uploadList, getStudentBySerialNumber, getStudentBySSN, generateReport,
    getAllCourses, getCoursesBySupportId, getLecturesByCourseId_S, updateDeliveryByLecture_S, updateStudentStatus, getAllCourseLectures, deleteLecture_S,
    getSchedulesBySupportId, changeScheduleData, getRoomsBySupportId,
};
export default API;
