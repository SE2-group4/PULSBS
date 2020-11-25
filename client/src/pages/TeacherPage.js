import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import { CoursePanel, LecturePanel, StudentPanel, EditModal, DeleteModal } from '../components/TeacherComp';
import Lecture from '../entities/lecture';

/**
 *  elementForPage is a configuration parameter to limit the number of entries of the tables showing courses/lectures/students
 *  in the same instance (min value: 2)
 */
const elementForPage = 2;

class TeacherPage extends React.Component {

    /**
     * TeacherPage constructor
     * @param {User} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            courses: [], lectures: [], students: [],                         //elements
            selectedCourse: null, selectedLecture: null,                     //selected elements
            lectureIdToUpdate: null, deliveryToUpdate: null,                 //change delivery management
            lectureIdToDelete: null,                                         //delete lecture
            courseMap: new Map(), cPages: 1,                                 //course pagination
            lectureMap: new Map(), lPages: 1,                                //lecture pagination
            studentMap: new Map(), sPages: 1,                                //student pagination
            fetchErrorC: false, fetchErrorL: false, fetchErrorS: false       //fetch errors
        };
    }

    /**
     * componentDidMount fetches the all courses of the teacher 
     */
    componentDidMount() {
        API.getCoursesByTeacherId(this.state.user.userId)
            .then((courses) => {
                let i = 0;
                let nMap = new Map();
                courses.forEach(function (item) {
                    nMap.set(item.courseId, Math.floor(i / elementForPage));
                    i++;
                });
                let nPages = Math.ceil(i / elementForPage);
                this.setState({ courses: courses, courseMap: nMap, cPages: nPages, fetchErrorC: false });
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchErrorC: errormsg });
            });
    }

    /**
     * updateLectures fetches all lectures of the selected teacher's course 
     */
    updateLectures = (courseId) => {
        API.getLecturesByCourseIdByTeacherId(this.state.user.userId, courseId)
            .then((lectures) => {
                let i = 0;
                let nMap = new Map();
                lectures.forEach(function (item) {
                    nMap.set(item.lectureId, Math.floor(i / elementForPage));
                    i++;
                });
                let nPages = Math.ceil(i / elementForPage);
                this.setState({ lectures: lectures, lectureMap: nMap, lPages: nPages, selectedCourse: courseId, selectedLecture: null, fetchErrorL: false, students: [], sPages: 1, fetchErrorS: false });
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ selectedCourse: courseId, lectures: [], selectedLecture: null, lPages: 1, fetchErrorL: errormsg, students: [], sPages: 1, fetchErrorS: false });
            });
    }

    /**
     * updateStudents fetches all students of the selected lecture of a teacher's selected course 
     */
    updateStudents = (lectureId) => {
        API.getStudentsByLecture(this.state.user.userId, this.state.selectedCourse, lectureId)
            .then((students) => {
                let i = 0;
                let nMap = new Map();
                students.forEach(function (item) {
                    nMap.set(item.studentId, Math.floor(i / elementForPage));
                    i++;
                });
                let nPages = Math.ceil(i / elementForPage);
                this.setState({ students: students, studentMap: nMap, sPages: nPages, selectedLecture: lectureId, fetchErrorS: false })
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ selectedLecture: lectureId, students: [], sPages: 1, fetchErrorS: errormsg });
            });
    }

    /**
     * resetSelected lets to reset the selected course/lecture (and related states)
     */
    resetSelected = (type) => {
        switch (type) {
            case "course":
                this.setState({ selectedCourse: null, lectures: [], selectedLecture: null, lPages: 1, fetchErrorL: false, students: [], sPages: 1, fetchErrorS: false })
                break;
            case "lecture":
                this.setState({ selectedLecture: null, students: [], sPages: 1, fetchErrorS: false });
                break;
            default:
                break;
        }
    }

    //Error handler
    closeError = (errorName) => {
        this.setState({ [errorName]: false });
    }

    // EditModal handlers
    showEditModal = (lectureId, delivery) => {
        this.setState({ lectureIdToUpdate: lectureId, deliveryToUpdate: delivery });
    }

    // EditModal handlers
    showDeleteModal = (lectureId) => {
        this.setState({ lectureIdToDelete: lectureId });
    }

    closeEditModal = () => {
        this.setState({ lectureIdToUpdate: null, deliveryToUpdate: null });
    }

    closeDeleteModal = () => {
        this.setState({ lectureIdToDelete: null });
    }

    updateDelivery = () => {
        var deliveryToUpdate = this.state.deliveryToUpdate;
        var newDel = deliveryToUpdate == 'PRESENCE' ? 'REMOTE' : 'PRESENCE';
        API.updateDeliveryByLecture(this.state.user.userId, this.state.selectedCourse, this.state.lectureIdToUpdate, newDel)
            .then(() => {
                //ok from server
                var newLectures = this.state.lectures.slice();
                var newLecture, i;
                var lectureIdToUpdate = this.state.lectureIdToUpdate;
                newLectures.forEach(function (item, index) {
                    if (item.lectureId == lectureIdToUpdate) {
                        newLecture = new Lecture(item.lectureId, item.courseId, item.classId, item.startingDate, item.duration, item.bookingDeadline, newDel);
                        i = index;
                    }
                });
                newLectures.splice(i, 1, newLecture);
                this.setState({ lectures: newLectures, lectureIdToUpdate: null, deliveryToUpdate: null });
            }).catch(() => {
                //!ok from server
                //...
            });
    }

    deleteLecture = () => {
        //TODO api call

        var newLectures = this.state.lectures.slice();
        var i;
        var lectureIdToDelete = this.state.lectureIdToDelete;
        newLectures.forEach(function (item, index) {
            if (item.lectureId == lectureIdToDelete) {
                i = index;
            }
        });
        newLectures.splice(i, 1);
        //update pagination
        i = 0;
        let nMap = new Map();
        newLectures.forEach(function (item) {
            nMap.set(item.lectureId, Math.floor(i / elementForPage));
            i++;
        });
        let nPages = Math.ceil(i / elementForPage);
        if (lectureIdToDelete === this.state.selectedLecture) {
            this.setState({ lectures: newLectures, lectureIdToDelete: null, lectureMap: nMap, lPages: nPages, selectedLecture: null, students: [], sPages: 1 });
        }
        else {
            this.setState({ lectures: newLectures, lectureIdToDelete: null, lectureMap: nMap, lPages: nPages });
        }
    }

    render() {
        return (
            <>
                { this.state.lectureIdToUpdate &&
                    <EditModal editClose={this.closeEditModal} lectureId={this.state.lectureIdToUpdate} delivery={this.state.deliveryToUpdate} updateDelivery={this.updateDelivery} />}
                { this.state.lectureIdToDelete &&
                    <DeleteModal deleteClose={this.closeDeleteModal} lectureId={this.state.lectureIdToDelete} deleteLecture={this.deleteLecture} />}
                <Container fluid>
                    <Row>
                        <Col sm={8}>
                            <CoursePanel courses={this.state.courses}                                                           //courses
                                sCourse={this.state.selectedCourse} pageMap={this.state.courseMap} nPages={this.state.cPages}   //courses pagination
                                update={this.updateLectures} reset={this.resetSelected}                                         //interaction with Lecture Panel
                                fetchError={this.state.fetchErrorC} closeError={this.closeError}                                //error handling
                            />
                            <br />
                            <br />
                            <LecturePanel lectures={this.state.lectures}                                                                                    //lectures
                                sLecture={this.state.selectedLecture} pageMap={this.state.lectureMap} nPages={this.state.lPages}                            //lectures pagination
                                update={this.updateStudents} reset={this.resetSelected}                                                                     //interaction with Student Panel                                                 
                                showEditModal={this.showEditModal}                                                                                          //EditDelivery management                                                                     
                                showDeleteModal={this.showDeleteModal}                                                                                      //Delete
                                fetchError={this.state.fetchErrorL} closeError={this.closeError}                                                            //error handling
                            />
                            <br />
                            <br />
                            <StudentPanel students={this.state.students}                                            //students
                                pageMap={this.state.studentMap} nPages={this.state.sPages}                          //students pagination
                                fetchError={this.state.fetchErrorS} closeError={this.closeError}                    //error handling
                            />
                        </Col>
                        <Col sm={4}><> </></Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default TeacherPage;
